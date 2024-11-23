class Event < ApplicationRecord
  belongs_to :admin, class_name: 'User'
  has_many :event_images, dependent: :destroy
  has_rich_text :description

  validates :title, presence: true
  validates :description, presence: true
  validates :start_date, presence: true
end
