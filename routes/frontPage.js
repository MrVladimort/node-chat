exports.get = async function(ctx, next) {
    if (ctx.isAuthenticated()) {
        ctx.redirect('/chat');
        //ctx.body = ctx.render('chat');
    } else {
        ctx.redirect('/login');
        //ctx.body = ctx.render('login');
    }
};