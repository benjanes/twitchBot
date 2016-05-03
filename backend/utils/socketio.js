const twitchIO = require('socket.io');
// const twitchClient = require('./tmiClient');

const eventEmitter = require('./eventEmitter');
// const messageController = require('../db/messageController');

const tmi = require('tmi.js');
const chooseChannel = require('./tmiConfig');


exports.establishConnection = () => {
  let twitchClient = null;
  let channelList = [];

  return {
    connect: (channel) => {
      if (channelList.indexOf(channel) !== -1) return;
      channelList.push(channel);

      if (twitchClient) {
        twitchClient.disconnect().then(() => {
          console.log('Connecting to: ', channelList);
          twitchClient = new tmi.client(chooseChannel(channelList));
          twitchClient.connect();

          twitchClient.on('chat', (channel, user, msg) => {
            eventEmitter.emit('chatMessage', { channel, user, msg });
          });
        });
      } else {
        twitchClient = new tmi.client(chooseChannel(channelList));
        twitchClient.connect();

        twitchClient.on('chat', (channel, user, msg) => {
          eventEmitter.emit('chatMessage', { channel, user, msg });
          // messageController.saveMessage(msgObj);
        });
      }
    }
  }
}


exports.ioConnect = server => {
  const io = twitchIO.listen(server);

  io.sockets.on('connection', socket => {

    socket.on('channel:subscribe', channel => {
      console.log('subscribe to: ', channel);
      socket.join(channel);
    });

    socket.on('channel:unsubscribe', channel => {
      console.log('unsubscribe from: ', channel);
      socket.leave(channel);
    });

    eventEmitter.on('chatMessage', message => {
      let channel = message.channel.substr(1);
      io.to(channel).emit('message', message);
    });

  });

  return io;
};
