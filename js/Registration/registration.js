let fullNameReg = document.querySelector('#nameReg');
let birthDateReg = document.querySelector('#birthdayReg');
let genderReg = document.querySelector('#genderReg');
let emailReg = document.querySelector('#emailReg');
let passwordReg = document.querySelector('#passwordReg');
const subButtReg = document.querySelector('#subButtReg');
let phoneNumberReg = document.querySelector('#phoneReg');

subButtReg.addEventListener('click', (event) => {
    event.preventDefault();
    RegistrationUser();
});

function RegistrationUser() {
    try {
        const birthDateRegValue = birthDateReg.value ? new Date(birthDateReg.value).toISOString() : null;

        const registerUser = new RegisterUser(
            fullNameReg.value,
            passwordReg.value,
            emailReg.value,
            birthDateRegValue,
            genderReg.value,
            phoneNumberReg.value
        );
        console.log(registerUser);
        
        fetch('https://blog.kreosoft.space/api/account/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(registerUser),
        })
        .then(data => data.json())
        .then(data => {
            if (data.token && data.token !== "undefined") {
                localStorage.setItem('login-profile', emailReg.value);
                localStorage.setItem('token', data.token);   
            } else if(data.DuplicateUserName) {
                alert("Такая почта уже занята!");
                return;
            }
    
            location.reload();
        });
    } catch(error) {
        alert(error.message);
        return;
    }
}

$(document).ready(function() {
    $('#phoneReg').mask("+7 (999) 999-99-99");
});

phoneNumberReg.addEventListener('input', (event) => {
    if (/\+7\s\(\d{3}\)\s\d{3}\-\d{2}\-\d{2}/.test(event.target.value) || event.target.value === "") {
        subButtReg.style.backgroundColor = '#06f';
        subButtReg.disabled = false;
    } else {
        subButtReg.style.backgroundColor = 'rgb(100, 160, 249)';
        subButtReg.disabled = true;
    }
});