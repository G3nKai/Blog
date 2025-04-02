async function fetchCurrentRole() {
    console.log('старт фетча');
    const response = await fetch(`https://blog.kreosoft.space/api/community/${localStorage.getItem('communityId')}/role`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    });

    const data = await response.json();

    localStorage.setItem('roleCommunity', data);

    console.log('Роль:', data);
}


async function fetchCurrentCommunity() {
    let response = await fetch(`https://blog.kreosoft.space/api/community/${localStorage.getItem('communityId')}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        },
    });
    
    let data = await response.json();
    let community = {
        name: data.name,
        description: data.description,
        isClosed: data.isClosed,
        subscribersCount: data.subscribersCount,
        id: data.id,
        createTime: data.createTime
    };
    let administrators = [];

    data.administrators.forEach(element => {
        let administrator = {
            fullName: element.fullName,
            birthDate: element.birthDate,
            gender: element.gender,
            email: element.email,
            phoneNumber: element.phoneNumber,
            id: element.id,
            createTime: element.createTime
        };
        administrators.push(administrator);
    });
    console.log(community, administrators);

    let communityTitle = document.querySelector('.cummunity-title');

    let firstTitleRow = document.createElement('div');
    firstTitleRow.classList.add('first-title-row');

    let leftSpan = document.createElement('span');
    leftSpan.classList.add('left-span');
    leftSpan.textContent = `Группа "${community.name}"`; 

    let rightSpan = document.createElement('span');
    rightSpan.classList.add('right-span');
    let createPostButt = document.createElement('span');
    createPostButt.classList.add('create-post-butt');
    createPostButt.textContent = 'Написать пост';

    let subButt = document.createElement('span');
    subButt.classList.add('sub-butt');
    if (localStorage.getItem('roleCommunity') === 'null') {
        subButt.textContent = 'Подписаться';
        subButt.style.backgroundColor = '#06f';
        createPostButt.style.display = 'none'; 
        console.log('первое');
    } else if (localStorage.getItem('roleCommunity') === 'Subscriber') {
        subButt.textContent = 'Отписаться';
        createPostButt.style.display = 'none'; 
        console.log('второе');
    } else if (localStorage.getItem('roleCommunity') === 'Administrator') {
        subButt.style.display = 'none';
    }
    rightSpan.appendChild(createPostButt);
    rightSpan.appendChild(subButt);

    firstTitleRow.appendChild(leftSpan);
    firstTitleRow.appendChild(rightSpan);

    let subCount = document.createElement('p');
    subCount.classList.add('subscribers');
    subCount.textContent = `${community.subscribersCount} подписчиков`;

    let communityType = document.createElement('p');
    communityType.classList.add('community-type');
    communityType.textContent = `Тип сообщества: ${community.isClosed ? 'закрытое' : 'открытое'}`;

    let administratorDiv = document.createElement('div');
    administratorDiv.classList.add('administrator-div');
    let administratorTitle = document.createElement('p');
    administratorTitle.textContent = 'Администраторы';

    let ul = document.createElement('ul');
    administrators.forEach(element => {
        let li = document.createElement('li');
        li.id = `${element.id}`;

        let img = document.createElement('img');
        img.width = "60";
        img.height = "60";
        if (element.gender === "Male") {
            img.src = '../../images/man.webp';
        } else {
            img.src = '../../images/woman.webp';
        }

        let name = document.createElement('span');
        name.classList.add('name');
        name.textContent = element.fullName;


        li.appendChild(img);
        li.appendChild(name);
        ul.appendChild(li);
    });
    administratorDiv.appendChild(administratorTitle);
    administratorDiv.appendChild(ul);

    communityTitle.appendChild(firstTitleRow);
    communityTitle.appendChild(subCount);
    communityTitle.appendChild(communityType);
    communityTitle.appendChild(administratorDiv);
}

async function init() {
    localStorage.removeItem('roleCommunity');

    await fetchCurrentRole();

    await fetchCurrentCommunity();

    document.querySelector('.sub-butt').addEventListener('click', async () => {
        let subElement = document.querySelector('.sub-butt');
        console.log('test', subElement);
    
        if (subElement.textContent === 'Подписаться') {
            const response = await fetch(`https://blog.kreosoft.space/api/community/${localStorage.getItem('communityId')}/subscribe`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
        } else if (subElement.textContent === 'Отписаться') {
            const response = await fetch(`https://blog.kreosoft.space/api/community/${localStorage.getItem('communityId')}/unsubscribe`, {
                method: 'DELETE',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            })
        }
        location.reload();
    });
    document.querySelector('.create-post-butt').addEventListener('click', () => {
        window.location.href = '../../post/create';
    });
}

init();