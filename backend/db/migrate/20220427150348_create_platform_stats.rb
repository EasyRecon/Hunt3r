class CreatePlatformStats < ActiveRecord::Migration[7.0]
  def change
    create_table :platform_stats do |t|
      t.string :report_id
      t.string :report_title
      t.string :severity
      t.float :reward
      t.string :currency
      t.boolean :collab
      t.string :report_status
      t.date :report_date

      t.references :platform, null: false, foreign_key: true

      t.timestamps
    end
  end
end
