class ExportedFile < ApplicationRecord
  include FileUploader::Attachment(:file) # Adds the file attachment

  belongs_to :event

  validates :file_type, inclusion: { in: %w[pdf zip], message: "must be either 'pdf' or 'zip'" }
  validates :status, inclusion: { in: %w[pending completed failed], message: "is invalid" }
end