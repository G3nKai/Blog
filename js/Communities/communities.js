let communities = [];

async function fetchCommunities() {
    const response = await fetch('https://blog.kreosoft.space/api/community', {
        method: 'GET',
        headers: {
            'accept': 'text/plain',
        },
    });


    let data = await response.json();

    const communitiesListDiv = document.querySelector('.communities-list');
    let ul = document.createElement('ul');

    data.forEach(element => {
        let community = {
            name: element.name,
            description: element.description,
            isClosed: element.isClosed,
            subscribersCount: element.subscribersCount,
            id: element.id,
            createTime: element.createTime
        }

        let li = document.createElement('li');
        li.id = `${community.id}`;

        let leftSpan = document.createElement('span');
        leftSpan.textContent = `${community.name}`;
        leftSpan.classList.add('left-column');

        let rightSpan = document.createElement('span');
        rightSpan.textContent = `Подписаться`;
        rightSpan.classList.add('right-column');

        li.appendChild(leftSpan);
        li.appendChild(rightSpan);
        ul.appendChild(li);
    });

    communitiesListDiv.appendChild(ul);

    await fetchMyCommunities(communities);
    console.log(communities);

    if (communities.length > 0) {
        document.querySelectorAll('.communities-list ul li').forEach((element) => {
            console.log(element.id);

            communities.forEach(comm => {
                if (element.id === comm.communityId && comm.role === 'Subscriber') {
                    element.querySelector('.right-column').textContent = 'Отписаться';
                    element.querySelector('.right-column').style.backgroundColor = 'rgb(220,53,69)';
                } else if (element.id === comm.communityId && comm.role === 'Administrator') {
                    element.querySelector('.right-column').classList.add('inactive');
                }
            });
        });
    }

    document.querySelectorAll('.communities-list ul li .right-column').forEach(element => {
        element.addEventListener('click', async () => {
            let elementParent = element.parentElement;
            console.log(elementParent.id);
            console.log('test');

            if (element.textContent === 'Подписаться') {
                const response = await fetch(`https://blog.kreosoft.space/api/community/${elementParent.id}/subscribe`, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (response.status === 200) {
                    element.textContent = 'Отписаться';
                    element.style.backgroundColor = 'rgb(220,53,69)';
                }
            } else if (element.textContent === 'Отписаться') {
                const response = await fetch(`https://blog.kreosoft.space/api/community/${elementParent.id}/unsubscribe`, {
                    method: 'DELETE',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                
                if (response.status === 200) {
                    element.textContent = 'Подписаться';
                    element.style.backgroundColor = '#06f';
                }
            }
        });
    });
    document.querySelectorAll('.communities-list ul li .left-column').forEach(element => {
        element.addEventListener('click', event => {
            localStorage.setItem('communityId', `${event.target.parentElement.id}`);
            window.location.href = '../../communityCurrent.html';
        })
    });
}

async function fetchMyCommunities(communities) {
    console.log('1 step');
    const response = await fetch('https://blog.kreosoft.space/api/community/my', {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (response.status === 200) {
        let data = await response.json();

        console.log('4 step');
        data.forEach(element => {
            let community = {
                userId: element.userId,
                communityId: element.communityId,
                role: element.role
            }
            communities.push(community);
        });
    } else {
        console.log(`вероятнее всего неавторизован`);
    }
}

fetchCommunities();