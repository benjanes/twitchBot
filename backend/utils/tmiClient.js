const tmi = require('tmi.js');
const chooseChannel = require('./tmiConfig');

const client = new tmi.client(chooseChannel([
  'tsm_dyrus',
]));

client.connect();

module.exports = client;
