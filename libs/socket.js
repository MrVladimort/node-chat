const socketIO = require('socket.io');
const socketioJwt = require('socketio-jwt');
const socketRedis = require('socket.io-redis');
const config = require('config');

function socket(server) {
    const io = socketIO.listen(server);

    /*io.adapter(socketRedis({
        host: 'pub-redis-13835.eu-central-1-1.1.ec2.redislabs.com', port: 13835
    }));*/

    let users = {};
    function getUsers(obj) {
        let tmp = [];
        for(let i in obj) tmp.push(obj[i]);
        return tmp.join(', ');
    }

    io.sockets.on('connection', function (client) {
        client.on('send', function (data){
            io.sockets.emit('message', {message: client.nickname + ': ' + data.message});
        });

        client.on('hello', function (data) {
            client.nickname = data.nickname;
            client.broadcast.emit('message', {message: data.nickname+' присоединился к чату'});
            if(Object.keys(users).length > 0){
                let userList = getUsers(users);
                client.emit('message', {message: 'Уже в чате: ' + userList + '!'});
            }else{
                client.emit('message', {message: 'Кроме вас в чате никого :('});
            }
            users[client.id] = data.nickname;
        });

        client.on('disconnect', function () {
            if(Object.keys(users).length > 1)
                client.broadcast.emit('message', {message: client.nickname + ' покинул чат'});
            delete users[client.id];
        });
    });


    /*io
        .on('connection', socketioJwt.authorize({
            secret: config.jwtsecret,
            timeout: 15000
        }))

        .on('authenticated', function (socket) {
            console.log('Это мое имя из токена: ' + socket.decoded_token.nickname);
        });
        */
}

/*const socketEmitter = require('socket.io-emitter');
const redisClient = require('redis').createClient();
socket.emitter = socketEmitter(redisClient);*/

module.exports = socket;