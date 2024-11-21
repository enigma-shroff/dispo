require "image_processing/mini_magick"
class ImageUploader < Shrine
  plugin :processing
  plugin :versions
  plugin :delete_raw
  plugin :determine_mime_type
 
  process(:store) do |io, context|
    versions = { original: io }
    
    io.download do |original|
      pipeline = ImageProcessing::MiniMagick.source(original)

      # Create a thumbnail with disposable-camera-like filter
      versions[:thumb] = pipeline
                          .resize_to_limit(200, 200) # Resize
                          .convert("jpg")           # Convert format
                          .saver(quality: 85)       # Optimize quality
                          .call

      # Apply the disposable-camera-like effects to a filtered version
      versions[:filtered] = pipeline.call do |path|
        MiniMagick::Image.new(path).tap do |img|
          img.vignette                          # Add vignette
          img.blur("0x1")                       # Apply slight blur
          img.modulate("110,90,100")            # Adjust saturation and brightness
          img.colorspace("Gray")                # Grayscale effect
          img.brightness_contrast('-30x-10')    # Brightness/contrast adjustment
          img.noise("multiplicative")           # Add noise
          img.write(path)                       # Save changes
        end
      end
    end
    
    versions
  end
 end