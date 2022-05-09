class CreateScreenshots < ActiveRecord::Migration[7.0]
  def change
    create_table :screenshots do |t|

      t.string :screenshot
      t.references :subdomain, null: false, foreign_key: true

      t.timestamps
    end
  end
end
