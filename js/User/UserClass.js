class User {
    constructor(email, password) {
        if (!email || !password) {
            throw new Error('Email и пароль обязательны!');
        } else if (!email.trim() || !password.trim()) {
            throw new Error('Email или пароль не могут состоять из одних пробелов!');
        }

        this.email = email.trim();
        this.password = password.trim();
    }
}