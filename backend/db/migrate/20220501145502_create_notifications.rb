class CreateNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :notifications do |t|
      t.string :type_message, null: false
      t.string :message, null: false

      t.timestamps
    end
  end
end
