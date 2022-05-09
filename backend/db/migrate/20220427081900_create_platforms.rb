class CreatePlatforms < ActiveRecord::Migration[7.0]
  def change
    create_table :platforms do |t|
      t.string :name, unique: true
      t.string :email
      t.string :password
      t.string :otp
      t.string :hunter_username
      t.text :jwt, maximum: 1000

      t.timestamps
    end
  end
end
