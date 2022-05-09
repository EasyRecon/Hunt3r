class CreateInvoices < ActiveRecord::Migration[7.0]
  def change
    create_table :invoices do |t|
      t.string :user_name
      t.string :user_lastname
      t.string :user_address
      t.string :user_phone
      t.string :user_email
      t.string :user_siret
      t.boolean :user_vat
      t.string :user_vat_number
      t.string :user_bank
      t.string :user_iban
      t.string :user_bic
      t.string :client_project
      t.string :client_name
      t.string :client_btw
      t.string :client_address
      t.string :client_email

      t.references :platform, null: false, foreign_key: true

      t.timestamps
    end
  end
end
