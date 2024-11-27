class CreateExportedFiles < ActiveRecord::Migration[8.0]
  def change
    create_table :exported_files do |t|
      t.references :event, null: false, foreign_key: true
      t.text :file_data
      t.string :file_type
      t.string :status, default: "pending"

      t.timestamps
    end
  end
end
