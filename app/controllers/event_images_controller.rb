class EventImagesController < ApplicationController
  before_action :set_event

  def index
    debugger
    @event_images = @event.event_images

    respond_to do |format|
      format.html
    end
  end

  private
  
  def set_event
    @event = Event.find(params[:id])
  end

end