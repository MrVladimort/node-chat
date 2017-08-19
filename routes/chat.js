exports.get = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        ctx.body = ctx.render('chat');
    }else{
        ctx.status = 400;
        ctx.flash('error', 'Need to authorize');
        ctx.redirect('/');
    }
};
