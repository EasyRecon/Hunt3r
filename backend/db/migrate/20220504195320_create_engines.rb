class CreateEngines < ActiveRecord::Migration[7.0]
  def change
    create_table :engines do |t|
      t.string :name
      t.jsonb :infos, default: {
        type_scan: '',
        instance_type: '',
        provider: '',
        notifs: false,
        active_recon: false,
        intel: false,
        leak: false,
        nuclei: false,
        all_templates: false,
        permutation: false,
        gau: false,
        custom_templates: []
      }

      t.timestamps
    end
  end
end
