class EventImagesController < ApplicationController
  before_action :set_event, only: [:index]

  def index
    debugger
    @event_images = @event.event_images

    respond_to do |format|
      format.html
    end
  end

  def destroy
    @event_image = EventImage.find(params[:id])

    if @event_image.destroy
      head :no_content
    else
      head :unprocessable_entity
    end
  end

  private
  
  def set_event
    @event = Event.find(params[:id])
  end

end