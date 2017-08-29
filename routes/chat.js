exports.get = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        ctx.body = ctx.render('chat');
    }else{
        ctx.redirect('/login');
    }
};
