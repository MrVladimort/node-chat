exports.get = async function(ctx, next) {
    if (ctx.isAuthenticated()) {
        ctx.redirect('/chat');
    } else {
        ctx.redirect('/login');
    }
};