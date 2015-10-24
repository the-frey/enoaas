class CompositionsController < ApplicationController

  def show
    text_to_use = Text.latest

    @sentiment = text_to_use.analyse_sentiment
    @content_length = text_to_use.content.length
    @chord_progression = text_to_use.chord_progression
    @tempo = text_to_use.tempo
  end

end