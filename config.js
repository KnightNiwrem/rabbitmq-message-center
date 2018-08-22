const convict = require('convict');
const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV.toUpperCase() : 'DEVELOPMENT';

// Define a schema
const config = convict({
  hostname: {
    doc: 'The hostname for the rabbitmq connection',
    default: 'localhost',
    env: 'RABBITMQ_HOSTNAME',
  },
  locale: {
    doc: 'The locale for the rabbitmq connection',
    default: 'en_US',
    env: 'RABBITMQ_LOCALE',
  },
  username: {
    doc: 'The username for the rabbitmq connection',
    default: 'guest',
    env: 'RABBITMQ_USERNAME',
  },
  vhost: {
    doc: 'The vhost for the rabbitmq connection',
    default: '/',
    env: 'RABBITMQ_VHOST',
  },
  password: {
    doc: 'The password for the rabbitmq connection',
    default: 'guest',
    env: 'RABBITMQ_PASSWORD',
  },
  port: {
    doc: 'The port for the rabbitmq connection',
    format: 'port',
    default: 5672,
    env: 'RABBITMQ_PORT',
  },
  protocol: {
    doc: 'The protocol for the rabbitmq connection',
    default: 'amqp',
    env: 'RABBITMQ_PROTOCOL',
  },
  tghost: {
    doc: 'The hostname for the telegram server',
    default: 'localhost',
    env: 'RABBITMQ_TELEGRAM_HOST'
  },
  tgtoken: {
    doc: 'The telegram bot token for interaction with rabbitmq through telegram',
    default: '',
    env: 'RABBITMQ_TELEGRAM_BOTTOKEN'
  },
});

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;
