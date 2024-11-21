class CreateEventImages < ActiveRecord::Migration[8.0]
  def change
    create_table :event_images do |t|
      t.references :event, foreign_key: true
      t.references :user, foreign_key: true
      t.text :image_data

      t.timestamps
    end
  end
end
