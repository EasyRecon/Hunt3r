class CreateServers < ActiveRecord::Migration[7.0]
  def change
    create_table :servers do |t|
      t.string :uid, index: { unique: true }
      t.string :name
      t.string :ip
      t.string :state

      t.references :scan, null: false, foreign_key: true

      t.timestamps
    end
  end
end
