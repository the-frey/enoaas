require 'rails_helper'

describe TextsController, type: :controller do
  it "#text" do
    post :create, content: 'foo', number: '123'
    expect(response.status).to eq 200
  end
end