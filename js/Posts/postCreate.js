let titlePost = document.querySelector('#titlePost');
let timeReading = document.querySelector('#timeReading');
let groupChoose = document.querySelector('#groupChoose');
let tagReg = document.querySelector('#tagReg');
let imageReg = document.querySelector('#imageReg');
let textReg = document.querySelector('#textReg');
let addressChoose = document.querySelector('#addressChoose');
let subButtReg = document.querySelector('#subButtReg');

let flagCommunity = false;

function fetchTags() {
    fetch('https://blog.kreosoft.space/api/tag', {
        method: 'GET',
        headers: {
            'accept': 'text/plain',
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        data.forEach(element => {
            let option = document.createElement('option');
            option.value = element.id;
            option.textContent = element.name;
            tagReg.appendChild(option);
        })
    })
}

function fetchGroups() {
    fetch('https://blog.kreosoft.space/api/community/my', {
        method: 'GET',
        headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        data.forEach(element => {
            let nameGroup;

            fetch(`https://blog.kreosoft.space/api/community/${element.communityId}`, {
                method: 'GET',
                headers: {
                    'accept': 'text/plain',
                }
            })
            .then(responseI => {
                return responseI.json();
            })
            .then(dataI => {
                nameGroup = dataI.name;
                console.log(nameGroup);
            })
            .then(() => {
                let option = document.createElement('option');
                option.value = element.communityId;
                option.textContent = nameGroup;
                console.log(nameGroup);

                if (element.role === 'Administrator') {
                    groupChoose.appendChild(option);
                }
            });
        })
    })
}

function fetchPost() {

    const options = Array.from(addressChoose.options);
    
    let postClass = {
        title: titlePost.value,
        description: textReg.value,
        readingTime: timeReading.value,
        image: imageReg.value.length === 0 ? null : imageReg.value,
        addressId: addressChoose.value === "Не выбран" ? null : options.find(option => option.value === addressChoose.value).value,
        tags: [...tagReg.selectedOptions].map(option => option.value),
    };
    console.log(postClass.addressId);
    console.log(postClass, [...tagReg.selectedOptions].map(option => option.value));

    let url = flagCommunity ? `https://blog.kreosoft.space/api/community/${groupChoose.value}/post` : 'https://blog.kreosoft.space/api/post';
    fetch(url, {
        method: 'POST',
        headers: {
            'accept': 'text/plain' ,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(postClass),
    })
    .then((response) => {
        if (response.ok) {
            window.location.pathname = '/index.html';
        }
    })
}


fetchGroups();
fetchTags();
fetchAddress();

subButtReg.addEventListener('click', (event) => {
    event.preventDefault();
    if (groupChoose.value === 'Без группы') {
        flagCommunity = false;
        fetchPost();
    } else {
        console.log(`Выбрана группа ${groupChoose.value}`);
        flagCommunity = true;
        fetchPost();
    }
});


function fetchAddress() {
    fetch(`https://blog.kreosoft.space/api/address/search`, {
        method: 'GET',
        headers: {
            'accept': 'text/plain',
        },
    })
    .then(response => {
        return response.json();
    })
    .then(data => { 
        data.forEach(element => {
            let option = document.createElement('option');
            option.setAttribute('data-guid', element.objectGuid);
            option.setAttribute('data-id', element.objectId);
            option.value = element.objectGuid;
            option.textContent = element.text;
            addressChoose.appendChild(option);
        })
    });
}

addressChoose.addEventListener('change', event => {
    
});