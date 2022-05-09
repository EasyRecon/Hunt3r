require 'rails_helper'
require 'spec_helper'

RSpec.describe 'Healths', type: :request do
  describe 'GET /' do
    it 'returns http success' do
      get '/'

      expect(response.body).to eq('{"message":"UP"}')
      expect(response.status).to eq(200)
    end
  end
end
