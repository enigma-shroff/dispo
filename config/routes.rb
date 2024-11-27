Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root 'pages#landing'
  devise_for :users
  
  resources :events, only: [:show] do
    member do
      post :upload
      post :export
    end
    resources :event_images
  end
  
  get 'events', to: redirect('/admin/events')

  namespace :admin do
    resources :events do
      member do
        get :generate_qr
      end
    end
  end
end

