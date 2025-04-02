const profButt = document.querySelector('.profile-button');
const background = document.querySelector('.dropdown-background');
const logoutButt = document.querySelector('.logout');

const token = localStorage.getItem('token');

if (token !== null) {
    const profileLogin = document.querySelector('.profile-login');
    const dropDown = document.querySelector('.dropdown-profile');
    const dropDownEmail = document.querySelector('.profile-button');

    profileLogin.style.display = 'none';

    dropDownEmail.textContent = localStorage.getItem('login-profile');
    dropDown.style.display = 'flex';
}

logoutButt.addEventListener('click', () => {
    fetch('https://blog.kreosoft.space/api/account/logout', {
        method: 'POST',
        headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    .then(() => {
        if (localStorage.getItem('token') && localStorage.getItem('token') !== "undefined") {
            localStorage.clear();
            location.reload();
        }
    });
});

profButt.addEventListener('click', (event) => {
    event.stopPropagation();
    background.classList.toggle('active');
}); 

document.addEventListener('click', () => {
    background.classList.remove('active');
});


function fetchLogged() {
    fetch('https://blog.kreosoft.space/api/account/profile', {
        method: 'GET',
        headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then(response => {
        if (response.status === 401) {
            localStorage.removeItem('token');
        }
        
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            if (response.status === 200) {
                document.querySelector('#subButtPost').style.display = 'block';
            }
            else if (response.status === 401) {
                document.querySelector('.filter').style.marginTop = '50px';
            }
        }

        if (window.location.pathname === '/communityCurrent.html') {
            if (response.status === 401) {
                window.location.href = 'login.html';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchLogged();
})