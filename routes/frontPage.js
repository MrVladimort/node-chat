exports.get = async function(ctx, next) {
    console.log(ctx.isAuthenticated());
    if (ctx.isAuthenticated()) {
        ctx.body = ctx.render('chat');
    } else {
        ctx.body = ctx.render('login');
    }
};