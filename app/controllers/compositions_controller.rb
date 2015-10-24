class CompositionsController < ApplicationController

  def show
    text_to_use = Text.latest

    @sentiment = Text.analyse_sentiment_history
    @content_length = Text.length_history
    @chord_progression = Text.chord_progression_history
    @tempo = Text.tempo_history
  end

end