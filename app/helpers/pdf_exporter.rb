require 'prawn'
require 'nokogiri'
require 'open-uri'

class PdfExporter
  def self.generate_pdf(event, file_path)
    Prawn::Document.generate(file_path) do |pdf|
      # Add Event Title
      pdf.text event.title, size: 24, style: :bold, align: :center
      pdf.move_down 10

      # Parse and Render RichText Description
      if event.description.present?
        render_rich_text(pdf, event.description)
      else
        pdf.text "No description available.", size: 14, align: :center, color: "gray"
      end

      pdf.start_new_page

      # Add Event Images (from event_images association)
      event.event_images.each do |image|
        begin
          render_image(pdf, image.image[:filtered].download)
          pdf.start_new_page unless image == event.event_images.last
        rescue => e
          pdf.text "Error displaying image: #{e.message}", size: 12, color: "red"
        end
      end
    end
  end

  private

  def self.render_rich_text(pdf, rich_text)
    # Parse the full HTML of the RichText body
    html_content = rich_text.body.to_html
    document = Nokogiri::HTML::DocumentFragment.parse(html_content)

    # Traverse all descendant nodes
    document.traverse do |node|
      case node.name
      when "p"
        pdf.text node.text.strip, size: 12, align: :left
      when "action-text-attachment"
        handle_attachment(pdf, node)
      when "text"
        pdf.text node.text.strip, size: 12, inline_format: true unless node.text.strip.empty?
      end
    end
  end

  def self.handle_attachment(pdf, node)
    # Extract URL directly from the `action-text-attachment` tag
    url = node["url"]
    if url.present?
      begin
        io = URI.open(url)
        render_image(pdf, io)

        # Render caption if available
        caption = node["caption"]
        pdf.text caption, size: 10, align: :center, style: :italic if caption.present?
      rescue => e
        puts "Error displaying image from URL: #{e.message}"
      end
    else
      puts "Invalid or missing image URL."
    end
  end

  def self.render_image(pdf, image_source)
    # Render the image with proper scaling
    pdf.move_down 10
    pdf.image image_source, fit: [200, 200], position: :center, vposition: :center
    pdf.move_down 10
  end
end
