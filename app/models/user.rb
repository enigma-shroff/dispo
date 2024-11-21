class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :rememberable,
         :recoverable, :validatable
  
  enum :role, { user: 0, admin: 1 }
  has_many :event_images
  has_many :admin_events, 
           class_name: 'Event', 
           foreign_key: 'admin_id'
end
