//const amqp = require('amqp-connection-manager');
const Telegraf = require('telegraf');

const config = require('./config');
const { hostname, locale, username, vhost, password, port, protocol, tghost, tgtoken } = config.getProperties();

/*
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
*/

const bot = new Telegraf(tgtoken);
bot.command('image', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }));
bot.on('text', ({ replyWithHTML }) => replyWithHTML('<b>Hello</b>'));

// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
bot.telegram.setWebhook(`https://${tghost}/${tgtoken}`)

// Start https webhook
bot.startWebhook(`/${tgtoken}`, null, 3000);
