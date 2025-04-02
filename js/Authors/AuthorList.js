fetch('https://blog.kreosoft.space/api/author/list', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
.then(data => data.json())
.then(data => displayAuthors(data));

function displayAuthors(data) {
    const authorsListDiv = document.querySelector('.authors-list');
    let ul = document.createElement('ul');
    data.forEach((element, index) => {
        const author = new Author (
            element.fullName,
            element.birthDate,
            element.gender,
            element.posts,
            element.likes,
            element.created
        );

        let li = document.createElement('li');
        li.id = `${index}`;
        let imgAnchor = document.createElement('a');
        imgAnchor.href = 'index.html';

        let img = document.createElement('img');
        img.width = "60";
        img.height = "60";
        if (author.gender === "Male") {
            img.src = '../../images/man.webp';
        } else {
            img.src = '../../images/woman.webp';
        }
        

        let leftColumn = document.createElement('div');
        leftColumn.classList.add('left-column');
        let authorRow = document.createElement('div');
        authorRow.classList.add('author-row');
        let nameAnchor = document.createElement('a');
        nameAnchor.href = 'index.html';
        let name = document.createElement('span');
        name.classList.add('name');
        name.textContent = author.fullName;
        let createTime = document.createElement('span');
        createTime.classList.add('create-time');
        createTime.textContent = ` Создан: ${author.created.substring(8,10) + '.' + author.created.substring(5,7) + '.' + author.created.substring(0,4)}`;
        let birthDate = document.createElement('span');
        birthDate.classList.add('birth-date');
        birthDate.textContent = author.birthDate ? `Дата рождения: ${author.birthDate.substring(8,10) + '.' + author.birthDate.substring(5,7) + '.' + author.birthDate.substring(0,4)}` : '';
        nameAnchor.appendChild(name);
        authorRow.appendChild(nameAnchor);
        authorRow.appendChild(createTime);
        leftColumn.appendChild(authorRow);
        leftColumn.appendChild(birthDate);

        let leftHalf = document.createElement('div');
        imgAnchor.appendChild(img);
        leftHalf.classList.add('left-half');
        leftHalf.appendChild(imgAnchor);
        leftHalf.appendChild(leftColumn);


        let rightColumn = document.createElement('div');
        rightColumn.classList.add('right-column');
        let postsAmount = document.createElement('span');
        postsAmount.classList.add('posts-amount');
        postsAmount.textContent = `Постов: ${author.posts}`;
        let likesAmount = document.createElement('span');
        likesAmount.classList.add('likes-amount');
        likesAmount.textContent = `Лайков: ${author.likes}`;
        rightColumn.appendChild(postsAmount);
        rightColumn.appendChild(likesAmount);

        li.appendChild(leftHalf);
        li.appendChild(rightColumn);
        ul.appendChild(li);
    });

    authorsListDiv.appendChild(ul);

    let imgArray = ['gold3.png', 'silver3.png', 'bronze3.png'];
    let sortedData = data.slice(0);
    sortedData = sortedData.sort((a, b) => {
        if (a.posts !== b.posts) {
            return b.posts - a.posts;
        }
        return b.likes - a.likes;
    })
    .slice(0, 3);

    const authorsListWinners = document.querySelectorAll('.authors-list ul li');
    console.log(sortedData);

    sortedData.forEach((element, index) => {
        
        console.log(data.indexOf(data.find(item => item.posts === element.posts && item.likes === element.likes)));
        console.log(authorsListWinners[data.indexOf(data.find(item => item.posts === element.posts && item.likes === element.likes))]);
        const currentLi = authorsListWinners[data.indexOf(data.find(item => item.posts === element.posts && item.likes === element.likes))];
        const currentImg = document.createElement('img');
        currentImg.src = `../../images/${imgArray[index]}`;
        currentImg.style.width = '40px';
        currentImg.style.height = '40px';
        currentImg.style.position = 'absolute';
        currentImg.style.top = '-5px';
        currentImg.style.left = '35px';
        currentImg.style.transform = 'rotate(35deg)';

        currentLi.appendChild(currentImg);
        currentLi.style.position = 'relative';
    });    
}