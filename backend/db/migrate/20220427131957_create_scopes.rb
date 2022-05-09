class CreateScopes < ActiveRecord::Migration[7.0]
  def change
    create_table :scopes do |t|
      t.string :scope
      t.string :scope_type
      t.datetime :last_scan
      t.references :program, null: false, foreign_key: true

      t.timestamps
    end
  end
end
