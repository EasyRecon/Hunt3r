class CreateTools < ActiveRecord::Migration[7.0]
  def change
    create_table :tools do |t|
      t.string :name
      t.jsonb :infos, default: {}

      t.timestamps
    end
  end
end
