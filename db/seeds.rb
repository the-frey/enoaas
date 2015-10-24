# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Text.create(sender: '0161700347', content: 'example content')
Text.create(sender: '0241252152', content: 'shit this is rubbish')
Text.create(sender: '5129055121', content: 'yes this is really good')
Text.create(sender: '6326236236', content: 'neutral vague sentiment')
Text.create(sender: '9080385923', content: 'a text from some user that is quite long compared to the other ones')
Text.create(sender: '9878973244', content: 'short')