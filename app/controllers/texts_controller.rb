class TextsController < ApplicationController

  # receives texts from clockwork
  def create
    sender = params[:from]
    content = params[:content]

    text = Text.create(sender: sender, content: content)

    if text
      render text: "#{content}", status: 200, layout: false
    else
      render text: "Sorry, something went wrong.", status: 500, layout: false
    end
  end

  # receives ajax calls from frontend
  def update_music_from_text

  end

end