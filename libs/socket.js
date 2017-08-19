const socketIO = require('socket.io');
const socketioJwt = require('socketio-jwt');
const socketRedis = require('socket.io-redis');
const config = require('config');

function socket(server) {
    const io = socketIO(server);

    io.adapter(socketRedis({
        host: 'pub-redis-13835.eu-central-1-1.1.ec2.redislabs.com', port: 13835
    }));

    io
        .on('connection', socketioJwt.authorize({
            secret: config.jwtsecret,
            timeout: 15000
        }))

        .on('authenticated', function (socket) {
            console.log('Это мое имя из токена: ' + socket.decoded_token.nickname);
        });
}


const socketEmitter = require('socket.io-emitter');
const redisClient = require('redis').createClient();
socket.emitter = socketEmitter(redisClient);

module.exports = socket;
