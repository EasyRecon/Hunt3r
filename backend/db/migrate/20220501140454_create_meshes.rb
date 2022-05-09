class CreateMeshes < ActiveRecord::Migration[7.0]
  def change
    create_table :meshes do |t|
      t.string :name
      t.string :url
      t.string :token

      t.timestamps
    end
  end
end
