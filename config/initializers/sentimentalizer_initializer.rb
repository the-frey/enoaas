require 'sentimentalizer'

Enoaas::Application.configure do
  config.after_initialize do
    Sentimentalizer.setup
  end
end
