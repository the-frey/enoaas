class CompositionsController < ApplicationController

  def show
    text_to_use = Text.latest

    @sentiment = text_to_use.analyse_sentiment
    @content = text_to_use.content
    @sender = text_to_use.sender
  end

end