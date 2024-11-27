class FileUploader < Shrine
  plugin :validation_helpers
  plugin :determine_mime_type

  Attacher.validate do
    # validate_max_size 100 * 1024 * 1024, message: "is too large (max 100 MB)"
    validate_mime_type_inclusion ["application/pdf", "application/zip"], message: "must be a PDF or ZIP file"
  end
end