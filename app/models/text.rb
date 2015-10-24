class Text
  include Mongoid::Document

  attr_accessor :sentiment

  field :sender, type: String
  field :content, type: String

  def analyse_sentiment
    sentiment.nil? ? Sentimentalizer.analyze(content).overall_probability : sentiment
  end

  class << self

    def latest
      Text.desc(:created_at).limit(1).first
    end

  end

end