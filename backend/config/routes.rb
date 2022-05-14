Rails.application.routes.draw do
  root 'home#index'

  defaults format: :json do
    scope 'api' do
      namespace :auth do
        post 'login', to: 'sessions#create'
        delete 'logout', to: 'sessions#destroy'
      end

      namespace :admin do
        # Users management
        get 'users', to: 'users#index'
        post 'users', to: 'users#create'
        delete 'users/:id', to: 'users#destroy'

        # Providers management
        get 'providers', to: 'providers#index'
        post 'providers', to: 'providers#create'
        patch 'providers', to: 'providers#update'
        delete 'providers/:name', to: 'providers#destroy'

        # BB Platforms management
        get 'platforms', to: 'platforms#index'
        post 'platforms', to: 'platforms#create'
        patch 'platforms', to: 'platforms#update'
        delete 'platforms/:name', to: 'platforms#destroy'

        # BB Platforms Stats
        get 'platforms/:name/stats', to: 'platformstats#index'
        patch 'platforms/:name/stats', to: 'platformstats#update'

        # Tools management
        get 'tools', to: 'tools#index'
        get 'tools/model', to: 'tools#model'
        post 'tools', to: 'tools#create'

        # Invoice Generation - Only for Intigriti ATM
        get 'platforms/:name/invoice', to: 'invoice#index'
        post 'platforms/:name/invoice', to: 'invoice#create'
        get 'platforms/:name/invoice/generate', to: 'invoice#generate'

        # Other Hunt3r Platforms management
        get 'meshs', to: 'meshs#index'
        post 'meshs', to: 'meshs#create'
        post 'meshs/sync', to: 'meshs#sync'
        patch 'meshs', to: 'meshs#update'
        delete 'meshs/:id', to: 'meshs#destroy'
      end

      # User profile management
      get 'profile', to: 'profile#index'
      patch 'profile', to: 'profile#update'

      # Programs management
      get 'programs', to: 'programs#index'
      patch 'programs', to: 'programs#update'

      # Scopes management
      get 'programs/:id/scopes', to: 'scopes#index'
      patch 'programs/:id/scopes', to: 'scopes#update'

      # Custom Nuclei templates management
      get 'nuclei', to: 'nuclei#index'
      post 'nuclei', to: 'nuclei#create'
      delete 'nuclei/:name', to: 'nuclei#destroy'

      # Scans management
      get 'scans', to: 'scans#index'
      get 'scans/model', to: 'scans#model'
      post 'scans', to: 'scans#create'
      patch 'scans', to: 'scans#update_outside'

      # Servers management
      get 'servers', to: 'servers#index'
      delete 'servers/:uid', to: 'servers#destroy'
      delete 'servers/:uid/outside', to: 'servers#destroy_outside'

      # Notifications management
      get 'notifications', to: 'notifications#index'
      post 'notifications', to: 'notifications#create_outside'
      delete 'notifications', to: 'notifications#destroy'

      # Leaks management
      get '/leaks', to: 'leaks#index'
      post '/leaks', to: 'leaks#create_outside'

      # Domains management
      get '/domains', to: 'domains#index'
      post '/domains/mesh', to: 'domains#index_outside'
      delete '/domains/:id', to: 'domains#destroy'

      # Subdomains management
      get '/subdomains', to: 'subdomains#index'
      post '/subdomains', to: 'subdomains#create_outside'

      # Screenshot management
      get '/screenshots/:subdomain_id', to: 'screenshots#index'
      post '/screenshots', to: 'screenshots#create_outside'

      # Vulnerabilities management
      get '/vulnerabilities', to: 'vulnerabilities#index'
      post '/vulnerabilities', to: 'vulnerabilities#create_outside'
      delete '/vulnerabilities/:id', to: 'vulnerabilities#destroy'

      # URLS management
      get '/urls/:subdomain_id', to: 'urls#index'
      post '/urls', to: 'urls#create_outside'

      # Scans engine management
      get 'engines', to: 'engines#index'
      post 'engines', to: 'engines#create'
      patch 'engines', to: 'engines#update'
      delete 'engines/:id', to: 'engines#destroy'
    end
  end
end
