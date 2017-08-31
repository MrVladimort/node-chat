exports.post = async function(ctx, next) {
    ctx.logout();

    ctx.session = null; // уничтажаем сессию, важно иначе сохранятся ффлеш сообщения

    ctx.redirect('/');
};
