class EventImage < ApplicationRecord
  belongs_to :event
  belongs_to :user, optional: true

  include ImageUploader::Attachment(:image)
  
  validates :image_data, presence: true
end
