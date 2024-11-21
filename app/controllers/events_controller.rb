class EventsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_event, only: [:show, :upload]
  skip_before_action :verify_authenticity_token, only: [:upload]
  skip_before_action :authenticate_user!
  
  
  def index
    @events = Event.all
  end
  
  def show
    @event_images = @event.event_images
  end
  
  def upload

    valid_images = params[:images].select { |image| image.present? && image != "" }
    if valid_images.present?
      valid_images.each do |image|
        @event.event_images.create!(image: image)
      end
      
      render json: { message: 'Image uploaded successfully' }, status: :created
    else
      render json: { error: 'No image provided' }, status: :bad_request
    end
  end
  
  private
  
  def set_event
    @event = Event.find(params[:id])
  end
end