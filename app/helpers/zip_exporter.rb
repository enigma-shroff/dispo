require 'zip'

class ZipExporter
  def self.generate_zip(event, file_path)
    Zip::File.open(file_path, Zip::File::CREATE) do |zipfile|
      event.event_images.each do |image|
        zipfile.add(image.image[:filtered].metadata["filename"], image.image[:filtered].download)
      end
    end
  end
end
