class Event < ApplicationRecord
  belongs_to :admin, class_name: 'User'
  has_many :event_images, dependent: :destroy
  
  validates :title, presence: true
  validates :description, presence: true
  validates :start_date, presence: true
end
