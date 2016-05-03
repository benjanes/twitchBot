const messageController = require('./db/messageController');
const chatChannels = require('./utils/socketio');
const establishConnection = chatChannels.establishConnection();

establishConnection.connect('imaqtpie');

module.exports = (app, express) => {
  app.get('/messages', (req, res) => {
    messageController.getMessages((data) => {
      res.send(data);
      res.end();
    });
  });
  
  app.post('/api/channels/subscribe', (req, res) => {
    var data = '';

    req.on('data', function(chunk) {
      data += chunk;
    });

    req.on('end', () => {
      const channel = data.toString();
      
      establishConnection.connect(channel);
      // socket subscription should be initiated from client.

      res.send({ channel });
      res.end();
    });

  });
};
