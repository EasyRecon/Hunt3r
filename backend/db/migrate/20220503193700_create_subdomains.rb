class CreateSubdomains < ActiveRecord::Migration[7.0]
  def change
    create_table :subdomains do |t|
      t.string :url
      t.jsonb :infos,
              default: {
                title: '',
                status_code: 0,
                content_length: 0,
                location: '',
                ip: '',
                cname: '',
                body_hash: '',
                ports: [],
                technologies: [],
                cdn: ''
              }

      t.references :domain, null: false, foreign_key: true

      t.timestamps
    end
    add_index :subdomains, :url, unique: true
  end
end
