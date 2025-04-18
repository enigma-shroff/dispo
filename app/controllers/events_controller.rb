class EventsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_event, only: [:show, :upload]
  skip_before_action :verify_authenticity_token, only: [:upload]
  skip_before_action :authenticate_user!

  
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

  def export
    event = Event.find(params[:id])
    type = params[:type]

    ExportFileJob.perform_async(event.id, type)
    render json: { message: "Export started. Please wait..." }, status: :ok
  end

  private
  
  def set_event
    @event = Event.find(params[:id])
  end

  def event_url(event)
    "#{request.base_url}/events/#{event.id}"
  end

end