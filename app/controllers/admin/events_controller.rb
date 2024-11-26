class Admin::EventsController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin
  before_action :set_event, only: [:edit, :update, :destroy, :generate_qr]
  
  def index
    @events = Event.where(admin: current_user)
  end
  
  def edit
  end
  
  def update
    if @event.update(event_params)
      redirect_to admin_events_path, notice: 'Event updated successfully'
    else
      render :edit
    end
  end

  def new
    @event = Event.new
  end
  
  def create
    @event = current_user.admin_events.build(event_params)
    
    if @event.save
      redirect_to admin_events_path, notice: 'Event created successfully'
    else
      render :new
    end
  end

  def destroy
    if @event.destroy
      redirect_to admin_events_path, notice: 'Event destroyed successfully'
    else
      render :edit
    end
  end
  
  def generate_qr
    url = event_url(@event) # Generates the full URL for the event
    qr_code = RQRCode::QRCode.new(url)
  
    svg = qr_code.as_svg(
      offset: 0,
      color: "000",
      shape_rendering: "crispEdges",
      module_size: 6
    )
  
    render plain: svg, content_type: "image/svg+xml"
  end

  private
  
  def require_admin
    authorize :admin, :access?
  end
  
  def event_params
    params.require(:event).permit(:title, :description, :start_date)
  end
  
  def set_event
    @event = current_user.admin_events.find(params[:id])
  end
end