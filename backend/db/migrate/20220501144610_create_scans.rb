class CreateScans < ActiveRecord::Migration[7.0]
  def change
    create_table :scans do |t|
      t.string :domain
      t.string :state
      t.string :type_scan
      t.boolean :meshs
      t.string :excludes, array: true
      t.string :instance_type
      t.string :provider
      t.boolean :notifs
      t.boolean :active_recon
      t.boolean :intel
      t.boolean :leak
      t.boolean :nuclei
      t.string :nuclei_severity, array: true
      t.boolean :custom_interactsh
      t.boolean :all_templates
      t.string :custom_templates, array: true
      t.boolean :permutation
      t.boolean :gau
      t.float :cost

      t.timestamps
    end
  end
end
