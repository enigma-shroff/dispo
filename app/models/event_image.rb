class EventImage < ApplicationRecord
  belongs_to :event
  belongs_to :user, optional: true

  include ImageUploader::Attachment(:image)
  
  validates :image_data, presence: true
  after_save :invalidate_exported_files
  after_destroy :invalidate_exported_files

  private

  def invalidate_exported_files
    event.exported_files.destroy_all
  end
end
