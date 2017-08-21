class UserAuthError{
    constructor(property){
        Error.call(this, property);
        this.name = "UserAuthError";

        this.property = property;
        this.message = "Ошибка аутентификации: " + property;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserAuthError);
        } else {
            this.stack = (new Error()).stack;
        }
    }
}

module.exports = UserAuthError;