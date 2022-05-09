class CreatePrograms < ActiveRecord::Migration[7.0]
  def change
    create_table :programs do |t|
      t.string :name
      t.string :slug
      t.boolean :vdp
      t.references :platform, null: false, foreign_key: true

      t.timestamps
    end
  end
end
