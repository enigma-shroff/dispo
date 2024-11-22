class EventsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_event, only: [:show, :upload]
  skip_before_action :verify_authenticity_token, only: [:upload]
  skip_before_action :authenticate_user!

  def show
    @event_images = @event.event_images
  end
  
  def upload

    valid_images = params[:images].select { |image| image.present? && image != "" }
    if valid_images.present?
      valid_images.each do |image|
        @event.event_images.create!(image: image)
      end
      
      flash[:notice] = 'Images uploaded successfully'
    else
      flash[:alert] = 'No valid images provided'
    end
    return redirect_to event_path(@event)
  end

  private
  
  def set_event
    @event = Event.find(params[:id])
  end

  def event_url(event)
    "#{request.base_url}/events/#{event.id}"
  end

end