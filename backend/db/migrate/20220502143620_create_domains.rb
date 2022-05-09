class CreateDomains < ActiveRecord::Migration[7.0]
  def change
    create_table :domains do |t|

      t.string :name
      t.references :scan, null: false, foreign_key: true

      t.timestamps
    end
  end
end
