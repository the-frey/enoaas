class Text
  include Mongoid::Document

  attr_accessor :sentiment, :chords

  field :sender, type: String
  field :content, type: String

  def analyse_sentiment
    return sentiment unless sentiment.nil?
    sentiment = Sentimentalizer.analyze(content).overall_probability
    sentiment
  end

  # returns a number between 0 and 9
  def chord_progression
    return chords unless chords.nil?
    number = sender.to_i rescue nil

    if number.nil?
      Random.rand(10)
    elsif number.to_s.chars.length < 3
      number.to_s.chars.map(&:to_i).sum
    else
      number.to_s.chars.map(&:to_i).last(3).sum.to_s.chars.map(&:to_i).last
    end

    chords = (number == 0) ? 1 : number
    chords
  end

  # returns the tempo
  def tempo
    positive = (analyse_sentiment > 0.5)
    length = content.length

    bottom_bound = Text.number_within_bounds(60, (analyse_sentiment * 100).round, 100)
    number = ((length / 2).round + (bottom_bound * 2))
    upper_bound = 200

    tempo_candidate = positive ? Text.number_within_bounds(bottom_bound, number, upper_bound) : Text.number_within_bounds((bottom_bound + Random.rand(bottom_bound)), number, upper_bound)
    Text.number_within_bounds(bottom_bound, Random.rand(tempo_candidate), upper_bound)
  end

  class << self

    def latest
      Text.desc(:created_at).limit(1).last
    end

    def last_but_one
      Text.desc(:created_at).limit(2).all()[1]
    end

    def number_within_bounds(bottom_bound, number, upper_bound)
      [bottom_bound, number, upper_bound].sort[1]
    end

  end

end