class CreateVulnerabilities < ActiveRecord::Migration[7.0]
  def change
    create_table :vulnerabilities do |t|
      t.string :name
      t.string :severity
      t.string :matched_at

      t.timestamps
    end
  end
end
