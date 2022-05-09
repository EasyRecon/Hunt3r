class CreateProviders < ActiveRecord::Migration[7.0]
  def change
    create_table :providers do |t|
      t.string :name, unique: true
      t.jsonb :infos, default: {}

      t.timestamps
    end
  end
end
