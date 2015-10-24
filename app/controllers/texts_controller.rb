class TextsController < ApplicationController

  # receives texts from clockwork
  def create
    sender = params[:from]
    content = params[:content]

    sender = sender.remove(' ') rescue nil

    text = Text.create(sender: sender, content: content)

    if text
      render text: "#{content}", status: 200, layout: false
    else
      render text: "Sorry, something went wrong.", status: 500, layout: false
    end
  end

  # receives ajax calls from frontend
  def update_music_from_text
    latest_text = Text.latest

    content = latest_text.content
    latest_text_id = latest_text.id_as_string
    sentiment = latest_text.analyse_sentiment
    content_length = latest_text.content.length
    chord_progression = latest_text.chord_progression
    tempo = latest_text.tempo

    render json: {latest_text_id: latest_text_id, content: content, content_length: content_length, chord_progression: chord_progression, tempo: tempo}.to_json, status: 200, layout: false
  end

end