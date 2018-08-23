const amqp = require('amqp-connection-manager');
const exec = (require('util')).promisify(require('child_process').exec);
const Telegraf = require('telegraf');

const config = require('./config');
const { hostname, locale, username, vhost, password, port, protocol, tghost, tgtoken } = config.getProperties();

/****************
 * Rabbitmq
 ***************/
const connection = amqp.connect(`amqp://${username}:${password}@localhost`);
const channelWrapper = connection.createChannel({ json: true });

/****************
 * Telegram Bot
 ***************/

const bot = new Telegraf(tgtoken);
bot.hears(/(\/)?newuser [a-zA-Z_]+ [a-zA-Z0-9_-]+/, async (ctx) => {
  const [ , username, password, ] = ctx.match;
  const createCommand = `docker exec -i rabbitmq rabbitmqctl add_user ${username} ${password}`;
  const { createOut, createErr } = await exec(createCommand);
  if (createErr) {
    ctx.reply(`Could not create user ${username} - username is probably already taken!`);
    return;
  }

  const permissionCommand = `docker exec -i rabbitmq rabbitmqctl set_permissions ${username} "" "" ${username}-.*`;
  const { permissionOut, permissionErr } = await exec(permissionCommand);
  if (permissionErr) {
    ctx.reply(`Could not set permissions for user ${username}!`);
    return;
  }

  ctx.reply(`Created user ${username} with password ${password}`);
});

// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
bot.telegram.setWebhook(`https://${tghost}/${tgtoken}`);

// Start https webhook
bot.startWebhook(`/${tgtoken}`, null, 3000);
