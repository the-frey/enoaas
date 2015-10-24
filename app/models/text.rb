class Text
  include Mongoid::Document

  field :sender, type: String
  field :content, type: String

  class << self

    def latest
      Text.desc(:created_at).limit(1).first
    end

  end

end