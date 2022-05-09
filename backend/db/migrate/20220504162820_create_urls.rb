class CreateUrls < ActiveRecord::Migration[7.0]
  def change
    create_table :urls do |t|
      t.text :url, maximum: 1300
      t.integer :status_code
      t.integer :content_length
      t.references :subdomain, null: false, foreign_key: { on_delete: :cascade }

      t.timestamps
    end
  end
end
