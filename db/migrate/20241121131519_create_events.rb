class CreateEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :events do |t|
      t.string :title
      t.text :description
      t.date :start_date
      t.references :admin, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
