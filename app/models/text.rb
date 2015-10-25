class Text
  include Mongoid::Document
  include Mongoid::Timestamps::Created

  attr_accessor :sentiment, :chords

  field :sender, type: String
  field :content, type: String

  def id_as_string
    id.to_s
  end

  def analyse_sentiment
    return sentiment unless sentiment.nil?
    sentiment = Sentimentalizer.analyze(content).overall_probability rescue nil
    if sentiment.nil?
      sentiment = 0
    end
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
  end

  # returns the tempo
  def tempo
    positive = (analyse_sentiment > 0.5)

    if positive
      lower_bound = ((analyse_sentiment * 100) * 1.5).round 
      Text.number_within_bounds(lower_bound, Random.rand(200), lower_bound + 10)
    else
      lower_bound = (analyse_sentiment * 100).round
      Text.number_within_bounds(lower_bound, Random.rand(120), lower_bound + 10)
    end
  end

  class << self

    def latest
      Text.desc(:created_at).limit(1).first()
    end

    def last_but_one
      Text.desc(:created_at).limit(2).all()[1]
    end

    def last_two
      [last_but_one, latest]
    end

    def number_within_bounds(bottom_bound, number, upper_bound)
      [bottom_bound, number, upper_bound].sort[1]
    end

    def tempo_history
      hist = Text.desc(:created_at).limit(5).map(&:tempo)
      return average_of_stuff(hist)
    end

    def chord_progression_history
      hist = Text.desc(:created_at).limit(5).map(&:chord_progression)
      return average_of_stuff(hist)
    end

    def analyse_sentiment_history
      hist = Text.desc(:created_at).limit(5).map(&:analyse_sentiment)
      return average_of_stuff(hist)
    end

    def length_history
      hist = Text.desc(:created_at).limit(5).map{ |a| a.content.length }
      return average_of_stuff(hist)
    end

    def average_of_stuff(data)
      if data.length() == 0
        return 0
      end
      result = 0.0
      weights = 0.0
      data.reverse.each_with_index do |value, index|
        weight = Math.erf((Math::PI/2.0)*1.0*index/data.length())
        result += weight*value
        weights += weight
      end
      result = result/(weights)
      return result
    end
  end

end
