const Cookies = require('cookies');
const config = require('config');
//const mongoose = require('mongoose');
const co = require('co');
const User = require('../models/user');
const socketIO = require('socket.io');
//const socketRedis = require('socket.io-redis');
const sessionStore = require('./sessionStore');

function socket(server) {
    const io = socketIO.listen(server);

    let users = {};
    function getUsers(obj) {
        let tmp = [];
        for(let i in obj) tmp.push(obj[i]);
        return tmp.join(', ');
    }

    io.use(function(socket, next) { // req
        let handshakeData = socket.request;

        let cookies = new Cookies(handshakeData, {}, config.keys);

        let sid = 'koa:sess:' + cookies.get('sid');

        co(function* () {
            let session = yield* sessionStore.get(sid, true);

            if (!session) {
                throw new Error("No session");
            }

            if (!session.passport && !session.passport.user) {
                throw new Error("Anonymous session not allowed");
            }

            // if needed: check if the user is allowed to join
            socket.user = yield User.findOne({email: session.passport.user});

            console.log(socket.user.nickname);

            // if needed later: refresh socket.session on events
            socket.session = session;

            // on restarts may be junk sockedIds
            // no problem in them
            session.socketIds = session.socketIds ? session.socketIds.concat(socket.id) : [socket.id];

            console.log(session.socketIds);

            yield sessionStore.save(sid, session);

            socket.on('disconnect', function() {
                co(function* clearSocketId() {
                    let session = yield* sessionStore.get(sid, true);
                    if (session) {
                        session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
                        yield* sessionStore.save(sid, session);

                        if(session.socketIds.length === 0){
                            socket.broadcast.emit('message', {message: socket.user.nickname + ' покинул чат'});
                            delete users[socket.user.nickname];
                        }
                    }else{
                        socket.broadcast.emit('message', {message: socket.user.nickname + ' покинул чат'});
                        delete users[socket.user.nickname];
                    }

                }).catch(function(err) {
                    console.error("session clear error", err);
                });
            });
        }).then(function() {
            next();
        }).catch(function(err) {
            console.error(err);
            next(new Error("Error has occured."));
        });
    });

    io.sockets.on('connection', function (client) {
        client.on('send', function (data){
            io.sockets.emit('message', {message: client.nickname + ': ' + data.message});
        });

        client.on('hello', function (data) {
            client.nickname = data.nickname;

            if(!users[client.nickname]) {
                client.broadcast.emit('message', {message: client.nickname + ' присоединился к чату'});

                if (Object.keys(users).length > 0) {
                    let userList = getUsers(users);
                    client.emit('message', {message: 'Уже в чате: ' + userList + '!'});
                } else {
                    client.emit('message', {message: 'Кроме вас в чате никого :('});
                }
            }

            users[client.nickname] = client.nickname;
        });
    });
}

//TODO
/*io.adapter(socketRedis({ uri: 'pub-redis-13835.eu-central-1-1.1.ec2.redislabs.com:13835' }));
const socketEmitter = require('socket.io-emitter');
const redisClient = require('redis').createClient();
socket.emitter = socketEmitter(redisClient);*/

module.exports = socket;
