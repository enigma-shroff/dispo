# app/helpers/event_images_helper.rb
module EventImagesHelper
  def images_per_slide
    if request.user_agent =~ /Mobile|webOS/
      3 # Adjust for smaller screens
    else
      6 # Default for larger screens
    end
  end
end
