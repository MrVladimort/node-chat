exports.get = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        ctx.body = ctx.render('chat');
    }else{
        ctx.status = 400;
        ctx.body = 'Need to authorize'
    }
};