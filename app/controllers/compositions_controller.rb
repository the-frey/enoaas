class CompositionsController < ApplicationController

  def show
    text_to_use = Text.latest

    @sender = text_to_use.scramble_sender
    @id = text_to_use.id_as_string
    @sentiment = Text.analyse_sentiment_history
    @content_length = Text.length_history
    @chord_progression = Text.chord_progression_history
    @tempo = Text.tempo_history
  end

end
