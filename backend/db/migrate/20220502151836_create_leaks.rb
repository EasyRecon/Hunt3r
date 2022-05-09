class CreateLeaks < ActiveRecord::Migration[7.0]
  def change
    create_table :leaks do |t|
      t.string :username
      t.string :email
      t.string :password
      t.references :domain, null: false, foreign_key: true

      t.timestamps
    end
    add_index :leaks, %i[username email password], unique: true
  end
end
