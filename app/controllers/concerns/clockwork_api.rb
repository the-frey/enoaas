require 'clockwork'

module ClockworkAPI

  self.send_text(number, message)
    api = Clockwork::API.new(ENV['CLOCKWORK_API_KEY'])
    message = api.messages.build(:to => number, :content => message)
    response = message.deliver
  end

end