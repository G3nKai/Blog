let login = document.querySelector('#login');
let password = document.querySelector('#password');
const regButt = document.querySelector('#register');

document.querySelector('#loginForm').addEventListener('submit', (event) => {
    event.preventDefault();

    UserLogin();
});

function UserLogin() {
    const email = login.value;
    const pass = password.value;

    try {
        const user = new User (
            email,
            pass 
        );

        fetch('https://blog.kreosoft.space/api/account/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then(data => data.json())
        .then(data => {
            if (data.token && data.token !== "undefined") {
                localStorage.setItem('login-profile', email);
                localStorage.setItem('token', data.token);   
            }
    
            location.reload();
        });
    }
    catch (error) {
        alert(error.message);
        return;
    }
}