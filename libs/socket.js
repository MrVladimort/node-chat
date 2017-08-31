const Cookies = require('cookies');
const config = require('config');
const co = require('co');
const User = require('../models/user');
const socketIO = require('socket.io');
const sessionStore = require('./sessionStore');

function socket(server) {
    const io = socketIO.listen(server);

    let users = {}; // массив для хранения юзеров
    let sockets = {}; // массив для хранения сокетов ююзеров

    // вытягиваем всех юзеров для данных в привествии
    function getUsers(obj) {
        let tmp = [];
        for (let i in obj) tmp.push(obj[i]);
        return tmp.join(', ');
    }

    io.use(function (socket, next) {
        let handshakeData = socket.request;

        let cookies = new Cookies(handshakeData, {}, config.keys);

        let sid = 'koa:sess:' + cookies.get('sid');

        // используем со для работы с генераторами так как sessionStore не поддерживает async/await и промисы
        co(function* () {
            let session = yield* sessionStore.get(sid, true);

            if (!session) {
                throw new Error("No session");
            }

            if (!session.passport && !session.passport.user) {
                throw new Error("Anonymous session not allowed");
            }

            // проверям достоин ли юзер
            socket.user = yield User.findOne({email: session.passport.user});

            // если понадобиться реюзать
            socket.session = session;

            // при каждом подключении мержим сокет айди
            session.socketIds = session.socketIds ? session.socketIds.concat(socket.id) : [socket.id];

            sockets[socket.user.nickname] = session.socketIds;

            console.log(socket.user.nickname);
            console.log(sockets[socket.user.nickname]);

            // сохраняем сессию с новыми сокетами
            yield sessionStore.save(sid, session);

            socket.on('disconnect', function () {
                co(function* clearSocketId() {
                    let session = yield* sessionStore.get(sid, true);

                    // если сессия существует удаляем откл. сокет
                    if (session) {
                        session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);

                        yield* sessionStore.save(sid, session);

                        sockets[socket.user.nickname] = session.socketIds;
                        console.log(socket.user.nickname);
                        console.log(sockets[socket.user.nickname]);

                        if (session.socketIds.length === 0) {
                            socket.broadcast.emit('message', {message: socket.user.nickname + ' покинул чат'});
                            delete users[socket.user.nickname];
                        }
                    } else {
                        //если сесси нет, значит что пользователь сделал logout и
                        // нужно отключить все записанные на его профайл сокеты (эмитим logout на все остальные)
                        if (sockets[socket.user.nickname]) {
                            for (let i = 0; i < sockets[socket.user.nickname].length; i++) {
                                let id = sockets[socket.user.nickname][i];

                                if (socket.nsp.sockets[id]) {
                                    socket.nsp.sockets[id].emit('logout');
                                }

                                delete sockets[socket.user.nickname][i];
                            }

                            // удаляем ключи в сокетах и удаляем юзера тем самым (он выйдет из чата окончательно)
                            delete sockets[socket.user.nickname];
                            delete users[socket.user.nickname];
                            socket.broadcast.emit('message', {message: socket.user.nickname + ' покинул чат'});
                        }
                    }

                }).catch(function (err) {
                    console.error("session clear error", err);
                });
            });

        }).then(function () {
            next();
        }).catch(function (err) {
            console.error(err);
            next(new Error("Error sessionStore and socket"));
        });
    });

    io.sockets.on('connection', function (client) {
        // подписываемся на send для отправки сообщения
        client.on('send', function (data) {
            io.sockets.emit('message', {message: client.nickname + ': ' + data.message});
        });

        client.on('hello', function (data) {
            client.nickname = data.nickname;

            if (!users[client.nickname]) {
                client.broadcast.emit('message', {message: client.nickname + ' присоединился к чату'});

                if (Object.keys(users).length > 0) {
                    let userList = getUsers(users);
                    client.emit('message', {message: 'Уже в чате: ' + userList + '!'});
                } else {
                    client.emit('message', {message: 'Кроме вас в чате никого :('});
                }

                users[client.nickname] = client.nickname;
            }
        });
    });
}

module.exports = socket;
