class ExportFileJob
  include Sidekiq::Worker

  def perform(event_id, type)
    event = Event.find(event_id)

    # Create an ExportedFile record
    exported_file = ExportedFile.find_or_create_by!(
      event: event,
      file_type: type,
    )

    exported_file.update(status: "pending")
    begin
      # Generate the file
      file_name = "event_#{event.title}_#{type}.#{type}"
      file_path = Rails.root.join("tmp", file_name)

      case type
      when "zip"
        ZipExporter.generate_zip(event, file_path)
      when "pdf"
        PdfExporter.generate_pdf(event, file_path)
      end

      # Attach the file using Shrine
      File.open(file_path) do |file|
        exported_file.file = file
        exported_file.status = "completed"
        exported_file.save!
      end

      # Clean up
      File.delete(file_path) if File.exist?(file_path)
    rescue StandardError => e
      exported_file.update(status: "failed")
      raise e
    end
  end
end
