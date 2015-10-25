class TextsController < ApplicationController

  skip_before_filter :verify_authenticity_token, except: [:update_music_from_text]

  # receives texts from clockwork
  def create
    sender = params[:from]
    content = params[:content]

    sender = sender.remove(' ') rescue nil

    text = Text.create(sender: sender, content: content)
    ClockworkAPI.send_text(sender, ("#{EnoQuotes.get_quote}.\n- Brian"))

    if text
      render text: "#{content}", status: 200, layout: false
    else
      render text: "Sorry, something went wrong.", status: 500, layout: false
    end
  end

  # receives texts from slack
  def create_slack
    sender = params[:user_id]
    content = params[:text]

    sender = sender.remove(' ') rescue nil
    sender = sender.remove('U') rescue nil

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

    sender = latest_text.sender
    content = latest_text.content
    latest_text_id = latest_text.id_as_string
    sentiment = Text.analyse_sentiment_history
    content_length = Text.length_history
    chord_progression = Text.chord_progression_history
    tempo = Text.tempo_history

    quote = EnoQuotes.get_quote

    render json: {sender: sender, content: content, latest_text_id: latest_text_id, sentiment: sentiment, content_length: content_length, chord_progression: chord_progression, tempo: tempo, quote: quote}.to_json, status: 200, layout: false
  end

end