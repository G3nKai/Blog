let subButtReg = document.querySelector('#subButtReg'),
    phoneNumberReg = document.querySelector('#phoneReg'),
    emailReg = document.querySelector('#emailReg'),
    nameReg = document.querySelector('#nameReg'),
    genderReg = document.querySelector('#genderReg'),
    birthDayReg = document.querySelector('#birthdayReg');

$(document).ready(function() {
    $('#phoneReg').mask("+7 (999) 999-99-99");
});

fetch('https://blog.kreosoft.space/api/account/profile', {
        method: 'GET',
        headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error('Вы не авторизованы: токен недействителен.');
        }
        return response.json(); 
    })
    .then(data => {
    
    let profile = new ProfileClass (
        data.fullName.trim(),
        data.birthDate,
        data.gender,
        data.email.trim(),
        data.phoneNumber,
        data.id,
        data.createTime
    );
    console.log(profile);

    emailReg.value = profile.email;
    nameReg.value = profile.fullName;
    phoneNumberReg.value = profile.phoneNumber;
    genderReg.value = profile.gender;
    birthDayReg.value = profile.birthDate ? profile.birthDate.substring(0, 10) : null;

    validate(subButtReg, phoneNumberReg, emailReg);
    putProfile(subButtReg);
    })
    .catch(error => {
        if (error.message === 'Вы не авторизованы: токен недействителен.') {
            alert(error.message);
            location.href = '/login.html';
            localStorage.clear();
        }
    });

function validate(subButtReg, phoneNumberReg, emailReg) {
    console.log('валидейшин');
    phoneNumberReg.addEventListener('input', (event) => {
        if (/\+7\s\(\d{3}\)\s\d{3}\-\d{2}\-\d{2}/.test(event.target.value) || event.target.value === "") {
            subButtReg.style.backgroundColor = '#06f';
            subButtReg.disabled = false;
        } else {
            subButtReg.style.backgroundColor = 'rgb(100, 160, 249)';
            subButtReg.disabled = true;
        }
    });

    emailReg.addEventListener('input', (event) => {
        if (/.{1,}@.{1,}\..{1,}/.test(event.target.value)) {
            subButtReg.style.backgroundColor = '#06f';
            subButtReg.disabled = false;
        } else {
            subButtReg.style.backgroundColor = 'rgb(100, 160, 249)';
            subButtReg.disabled = true;
        }
    });
}

function putProfile(subButtReg) {
    console.log('шаг 1');

    subButtReg.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('шаг 2');

        let putProfile = {
            email: emailReg.value,
            fullName: nameReg.value,
            birthDate: birthDayReg.value === '' ? null : birthDayReg.value,
            gender: genderReg.value,
            phoneNumber: phoneNumberReg.value === '' ?  null : phoneNumberReg.value
        };

        console.log('шаг 3', putProfile);

        fetch('https://blog.kreosoft.space/api/account/profile', {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(putProfile),
        })
        .then(() => {
            console.log('шаг 4');
            console.log('шаг 5');
            localStorage.setItem('login-profile', putProfile.email);
            location.reload();
        })
        .catch((error) => {
            alert('При Put запросе кое-что пошло не так:', error);
        });
    });
}