const amqp = require('amqp-connection-manager');
const config = require('./config');
const { hostname, locale, username, vhost, password, port, protocol } = config.getProperties();

const connection = amqp.connect(`amqp://${username}:${password}@localhost`);
const channelWrapper = connection.createChannel({ 
  json: true,
  setup: (channel) => channel.assertQueue('rxQueueName', { durable: false })
});

channelWrapper.sendToQueue('rxQueueName', { hello: 'world' })
.then(() => {
  return console.log("Message was sent!  Hooray!");
}).catch((err) => {
  return console.log("Message was rejected...  Boo!");
});
