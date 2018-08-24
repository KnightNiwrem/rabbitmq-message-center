const amqp = require('amqp-connection-manager');
const { exec } = require('shelljs');
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

bot.hears(/(?:\/)?newuser ([a-zA-Z_]+) ([a-zA-Z0-9_-]+)/, (ctx) => {
  const [ , username, password, ] = ctx.match;
  const createCommand = `docker exec -i rabbitmq rabbitmqctl add_user ${username} ${password}`;
  const { stdout: createOut, stderr: createErr } = exec(createCommand);
  if (createErr) {
    return ctx.reply(`Could not create user ${username} - username is probably already taken!`);
  }

  const permissionCommand = `docker exec -i rabbitmq rabbitmqctl set_permissions ${username} "" "" ${username}-.*`;
  const { stdout: permissionOut, stderr: permissionErr } = exec(permissionCommand);
  if (permissionErr) {
    return ctx.reply(`Could not set permissions for user ${username}!`);
  }

  return ctx.reply(`Created user ${username} with password ${password}`);
});

bot.hears(/(?:\/)?exchanges/, (ctx) => {
  const listCommand = `docker exec -i rabbitmq rabbitmqctl list_exchanges`;
  const { stdout, stderr } = exec(listCommand);
  stdout.split("\n").forEach((line) => {
    console.log(JSON.stringify(line.split(" ")));
  });
});

// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
bot.telegram.setWebhook(`https://${tghost}/${tgtoken}`);

// Start https webhook
bot.startWebhook(`/${tgtoken}`, null, 3000);
