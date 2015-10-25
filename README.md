# Eno as a Service

NB: has little to do with Brian Eno, and is not a service offering.

Generates music based on successive text messages sent to it.

## Usage

Visit `http://enoaas.herokuapp.com` to see it in action.

Text the number `+44 7860 033 606` your message. A little later, you should see and hear a change to the music and visuals.

## Development and Deployment

To run locally:

    $ rake db:seed
    $ rails s

To deploy:

- Currently assumes Heroku config w/MongoLab
- Set up a Clockwork account or API that posts to `http://<app-host>/text`
- Party time.