require 'rails_helper'

describe TextsController, type: :controller do
  let!(:text) { Text.create(sender: '123', content: 'foo bar') }

  it "#create" do
    post :create, content: 'foo', number: '123'
    expect(response.status).to eq 200
  end

  it "#update_music_from_text" do
    get :update_music_from_text, format: :json
    expect(!!(response.body.match(/foo bar/)[0])).to eq true
  end

  it "#create_slack" do
    post :create_slack, text: 'foo', user_id: 'U123'
    expect(response.status).to eq 200
  end
end