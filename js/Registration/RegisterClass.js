class RegisterUser {
    constructor(fullName, password, email, birthDate = null, gender, phoneNumber = null) {
        let nameVar = fullName.trim();
        let passVar = password.trim();
        let emailVar = email.trim();
        let currentDate = new Date();

        if (!nameVar) {
            throw new Error('Имя не может быть пустым!');
        } else if (!passVar) {
            throw new Error('Пароль не может быть пустым!');
        } else if (!emailVar) {
            throw new Error('Почта не может быть пустой!');
        } else if (!gender) {
            throw new Error('Пол не может быть пустым!');
        } else if (!(nameVar.length >= 1 && nameVar.length <= 1000)) {
            throw new Error('Длина имени неподходящая!');
        } else if (passVar.length < 6) {
            throw new Error('Длина пароля слишком маленькая!');
        } else if (gender !== "Male" && gender !== "Female") {
            throw new Error('Некорректное значение пола!');
        } else if(birthDate > currentDate) {
            throw new Error('Дата рождения не может быть в будущем!');
        } else if(!/\d/.test(password)) {
            throw new Error('В пароле должна быть хотя бы одна цифра!');
        }

        if (phoneNumber === "") {
            phoneNumber = null;
        }

        this.fullName = nameVar;
        this.password = passVar;
        this.email = emailVar;
        this.birthDate = birthDate;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
    }
}