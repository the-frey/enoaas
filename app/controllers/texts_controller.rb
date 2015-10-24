class TextsController < ApplicationController

  # receives texts from clockwork
  def create
    phone_number = params[:from]
    content = params[:content]

    render text: "#{content}", status: 200, layout: false
  end

  # receives ajax calls from frontend
  def update_music_from_text

  end

end