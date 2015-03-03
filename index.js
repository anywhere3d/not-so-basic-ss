var static = require('./static');
static(process.env.PORT || 5000);

var PeerServer = require('peer').PeerServer;
var WebSocketServer = require('ws').Server;

var peerServer = PeerServer({port: 9000, path: '/myapp'});
var wss = new WebSocketServer({port: 9001});

var peers = {};
peerServer.on('connection', function (namespacedId) {
  //groups peer ids according to their namespaces
  // { 
  //   default: [ 
  //     '4a78940f2f1f8b03195103a3baafc0db1425405629865787',
  //     '4a78940f2f1f8b03195103a3baafc0db1425405629865787'
  //    ],
  //   otherexperiment: [ 
  //     '4a78940f2f1f8b03195103a3baafc0db1425405629865787',
  //     '4a78940f2f1f8b03195103a3baafc0db1425405629865787'
  //    ]
  // }

  console.log('Peer connected with id:', namespacedId); 

  var prefix = getPrefix(namespacedId);
  var id = getId(namespacedId);
  
  //if the prefix doesn't exist create it
  if (!peers.hasOwnProperty(prefix))
    peers[prefix] = [];

  peers[prefix].push(namespacedId);

  console.log(peers);

  signalMaster(prefix); 
});

// peerServer.on('disconnect', function (id) {
//   console.log('Peer %s disconnected', id);
//   var i = peers.indexOf(id);
//   peers.splice(i, 1);

//   // signalMaster();
// });

var masterSockets = {};
  
wss.on('connection', function(socket) {

  socket.on('message', function(namespacedId){
    var prefix = getPrefix(namespacedId);
    var id = getId(namespacedId);

    if (masterSockets[prefix] === undefined){
      masterSockets[prefix] = socket;
      signalMaster(prefix);  

      socket.on('close', function() {
        masterSockets[prefix] = undefined;
        console.log('Master' + prefix + 'disconnected.');
      });
    }
  });
});

function signalMaster(prefix){  
  if (!masterSockets[prefix] || peers[prefix].length === 0 )
    return;

  console.log('Sending peer list  to Master');
  masterSockets[prefix].send(JSON.stringify(peers[prefix]), function ack(error) {
    if (error)
      console.log('Error sending data to Master client.');
  });
}

function getPrefix(id){
  return id.split('-')[0];  
}

function getId(id){
  return id.split('-')[1];  
}