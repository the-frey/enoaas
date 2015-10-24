require 'rails_helper'

describe ApiController, type: :controller do
  it "#text" do
    get :text, content: 'foo', number: '123'
    expect(response.status).to eq 200
  end
end