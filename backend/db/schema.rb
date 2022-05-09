# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_05_08_073735) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "domains", force: :cascade do |t|
    t.string "name"
    t.bigint "scan_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["scan_id"], name: "index_domains_on_scan_id"
  end

  create_table "engines", force: :cascade do |t|
    t.string "name"
    t.jsonb "infos", default: {"gau"=>false, "leak"=>false, "intel"=>false, "notifs"=>false, "nuclei"=>false, "provider"=>"", "type_scan"=>"", "permutation"=>false, "active_recon"=>false, "all_templates"=>false, "instance_type"=>"", "custom_templates"=>[]}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "invoices", force: :cascade do |t|
    t.string "user_name"
    t.string "user_lastname"
    t.string "user_address"
    t.string "user_phone"
    t.string "user_email"
    t.string "user_siret"
    t.boolean "user_vat"
    t.string "user_vat_number"
    t.string "user_bank"
    t.string "user_iban"
    t.string "user_bic"
    t.string "client_project"
    t.string "client_name"
    t.string "client_btw"
    t.string "client_address"
    t.string "client_email"
    t.bigint "platform_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["platform_id"], name: "index_invoices_on_platform_id"
  end

  create_table "leaks", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.string "password"
    t.bigint "domain_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["domain_id"], name: "index_leaks_on_domain_id"
    t.index ["username", "email", "password"], name: "index_leaks_on_username_and_email_and_password", unique: true
  end

  create_table "meshes", force: :cascade do |t|
    t.string "name"
    t.string "url"
    t.string "token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.string "type_message", null: false
    t.string "message", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "platform_stats", force: :cascade do |t|
    t.string "report_id"
    t.string "report_title"
    t.string "severity"
    t.float "reward"
    t.string "currency"
    t.boolean "collab"
    t.string "report_status"
    t.date "report_date"
    t.bigint "platform_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["platform_id"], name: "index_platform_stats_on_platform_id"
  end

  create_table "platforms", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password"
    t.string "otp"
    t.string "hunter_username"
    t.text "jwt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "programs", force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.boolean "vdp"
    t.bigint "platform_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["platform_id"], name: "index_programs_on_platform_id"
  end

  create_table "providers", force: :cascade do |t|
    t.string "name"
    t.jsonb "infos", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "scans", force: :cascade do |t|
    t.string "domain"
    t.string "state"
    t.string "type_scan"
    t.boolean "meshs"
    t.string "instance_type"
    t.string "provider"
    t.boolean "notifs"
    t.boolean "active_recon"
    t.boolean "intel"
    t.boolean "leak"
    t.boolean "nuclei"
    t.string "nuclei_severity", array: true
    t.boolean "custom_interactsh"
    t.boolean "all_templates"
    t.string "custom_templates", array: true
    t.boolean "permutation"
    t.boolean "gau"
    t.float "cost"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "scopes", force: :cascade do |t|
    t.string "scope"
    t.string "scope_type"
    t.datetime "last_scan"
    t.bigint "program_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["program_id"], name: "index_scopes_on_program_id"
  end

  create_table "screenshots", force: :cascade do |t|
    t.string "screenshot"
    t.bigint "subdomain_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["subdomain_id"], name: "index_screenshots_on_subdomain_id"
  end

  create_table "servers", force: :cascade do |t|
    t.string "uid"
    t.string "name"
    t.string "ip"
    t.string "state"
    t.bigint "scan_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["scan_id"], name: "index_servers_on_scan_id"
    t.index ["uid"], name: "index_servers_on_uid", unique: true
  end

  create_table "sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "last_used_at"
    t.boolean "status", default: true
    t.string "token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["last_used_at"], name: "index_sessions_on_last_used_at"
    t.index ["status"], name: "index_sessions_on_status"
    t.index ["token"], name: "index_sessions_on_token", unique: true
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "subdomains", force: :cascade do |t|
    t.string "url"
    t.jsonb "infos", default: {"ip"=>"", "cdn"=>"", "cname"=>"", "ports"=>[], "title"=>"", "location"=>"", "body_hash"=>"", "status_code"=>0, "technologies"=>[], "content_length"=>0}
    t.bigint "domain_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["domain_id"], name: "index_subdomains_on_domain_id"
    t.index ["url"], name: "index_subdomains_on_url", unique: true
  end

  create_table "tools", force: :cascade do |t|
    t.string "name"
    t.jsonb "infos", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "urls", force: :cascade do |t|
    t.text "url"
    t.integer "status_code"
    t.integer "content_length"
    t.bigint "subdomain_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["subdomain_id"], name: "index_urls_on_subdomain_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "role", default: "user", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "vulnerabilities", force: :cascade do |t|
    t.string "name"
    t.string "severity"
    t.string "matched_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "domains", "scans"
  add_foreign_key "invoices", "platforms"
  add_foreign_key "leaks", "domains"
  add_foreign_key "platform_stats", "platforms"
  add_foreign_key "programs", "platforms"
  add_foreign_key "scopes", "programs"
  add_foreign_key "screenshots", "subdomains"
  add_foreign_key "servers", "scans"
  add_foreign_key "sessions", "users"
  add_foreign_key "subdomains", "domains"
  add_foreign_key "urls", "subdomains", on_delete: :cascade
end
