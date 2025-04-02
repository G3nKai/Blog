class Author {
    constructor(fullName, birthDate = null, gender, posts = 0, likes = 0, created = null) {
        this.fullName = fullName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.posts = posts;
        this.likes = likes;
        this.created = created;
    }
}