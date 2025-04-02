let subButtPost = document.querySelector('#subButtPost');
let pageList = document.querySelectorAll('.select-nav li'); 
let tagSelect = document.querySelector('#tagSearcher');
let count;
let page = parseInt(localStorage.getItem('pageNumber')) ? parseInt(localStorage.getItem('pageNumber')) : 1;

if (parseInt(localStorage.getItem('page'))) {
    page = parseInt(localStorage.getItem('page'));
} else {
    
    switch (localStorage.getItem('page')) {
        case '<': 
            page--;
            break;
        case '>':
            page++
            break;
        default:
            page = 1;
            break;
    };
}
localStorage.setItem('pageNumber', page);

let pageSize = document.querySelector('#sizePage');
let size;
if (parseInt(localStorage.getItem('pageSize'))) {
    pageSize.value = localStorage.getItem('pageSize');
    size = parseInt(pageSize.value);
} else {
    size = 5;
}
localStorage.setItem('pageSize', size);
console.log(size);

pageSize.addEventListener('change', () => {
    size = parseInt(pageSize.value);
    localStorage.setItem('pageSize', size);
    location.reload();
})

subButtPost.addEventListener('click', () => {
    window.location.href = '../post/create';
});

let onlyMyCommunities = false;
let siteFooter = document.querySelector('.select-navigate');

document.querySelector(".select-nav").addEventListener('click', (event) => {
    localStorage.setItem('page', event.target.textContent);
    
    location.reload();
});

function fetchPosts(page = 1, size = 5, onlyMyCommunities = false) {
    console.log('1 step');
    const baseUrl = "https://blog.kreosoft.space/api/post";
    const params = new URLSearchParams({
        onlyMyCommunities: onlyMyCommunities.toString(),
        page: page,
        size: size,
    });
    const url = `${baseUrl}?${params.toString()}`;

    console.log('2 step', url);
    fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then(response => {
        
        return response.json();
    })
    .then(data => {
        localStorage.setItem('count', data.pagination.count);
        count = data.pagination.count;

        

        const limit = page + 4;
        
        const greaterThan = document.querySelector('.greater-than');
        const lowerThan = document.querySelector('.lower-than');

        
        if (page !== 1) {
            
            let li = document.createElement('li');
            li.textContent = 1;
            lowerThan.parentNode.insertBefore(li, lowerThan.nextSibling);

            if (page - 1 !== 1) {
                let etc = document.createElement('li');
                etc.textContent = '...';
                lowerThan.parentNode.insertBefore(etc, li.nextSibling);
            }
        } 

        let pageI;
        for (pageI = page; pageI < limit && pageI <= count; pageI++) {
            let li = document.createElement('li');
            li.textContent = pageI;
            greaterThan.parentNode.insertBefore(li, greaterThan);
        }
        

        pageI = pageI > count ? count : pageI;

        
        if (pageI !== count) {
            
            let li = document.createElement('li');
            li.textContent = count;
            lowerThan.parentNode.insertBefore(li, greaterThan);

            if (count > pageI) {
                
                let etc = document.createElement('li');
                etc.textContent = '...';
                lowerThan.parentNode.insertBefore(etc, greaterThan.previousSibling);
            }
        } 
        /////////////////////////////////////////////////////////////////////////////////////
        data.posts.forEach(element => {
            let post = {
                id: element.id,
                createTime: element.createTime.substring(8,10) + '.' + element.createTime.substring(5,7) + '.' + element.createTime.substring(0,4) + ' ' + element.createTime.substring(11, 16),
                title: element.title,
                description: element.description,
                readingTime: element.readingTime,
                image: element.image,
                authorId: element.authorId,
                author: element.author,
                cummunityId: element.communityId,
                communityName: element.communityName,
                addressId: element.addressId,
                likes: element.likes,
                hasLike: element.hasLike,
                commentsCount: element.commentsCount,
                tags: element.tags
            }

            let section = document.createElement('section');
            section.classList.add('post');
            siteFooter.parentNode.insertBefore(section, siteFooter);

            let firstRow = document.createElement('div');
            firstRow.classList.add('first-row');
            section.appendChild(firstRow);

            let author = document.createElement('span');
            author.textContent = post.author + ' - ';
            let createTime = document.createElement('span');
            createTime.textContent = post.createTime;
            let communityName;
            if (post.communityName !== null) {
                console.log(post.communityName);
                communityName = document.createElement('span');
                communityName.textContent = ' в сообществе "' + post.communityName + '"';
            }

            firstRow.appendChild(author);
            firstRow.appendChild(createTime);

            if (post.communityName !== null)
                firstRow.appendChild(communityName);

            let title = document.createElement('h1');
            title.classList.add('title');
            title.textContent = post.title;
            section.appendChild(title);


            if (post.image !== null) {
                let image = document.createElement('img');
                image.src = post.image;
                image.classList.add('img-post');
                
                section.appendChild(image);
            }


            let description = document.createElement('p');
            description.innerHTML = post.description.replace(/\n/g, '<br>');
            section.appendChild(description);

            let tags = document.createElement('span');
            tags.classList.add('tags');
            post.tags.forEach(element => {
                tags.textContent += `#${element.name} `;
            });
            section.appendChild(tags);

            let readingTime = document.createElement('span');
            readingTime.textContent = 'Время чтения: ' + post.readingTime + ' мин';
            section.appendChild(readingTime);


            let lastRow = document.createElement('div');
            lastRow.classList.add('last-row');


            let commentsContainer = document.createElement('div');
            commentsContainer.classList.add('comments');

            let commentsCount = document.createElement('span');
            commentsCount.textContent = post.commentsCount;

            let commentImage = document.createElement('img');
            commentImage.src = "../../images/comment.png"
            commentImage.width = 20;
            commentImage.height = 20;
            

            let likesContainer = document.createElement('div');
            likesContainer.classList.add('likes');

            let likes = document.createElement('span');
            likes.textContent = post.likes;

            let likesImage = document.createElement('img');
            if (post.hasLike) {
                likesImage.src = "../../images/heart.png";    
            } else {
                likesImage.src = "../../images/like.png";
            }
            likesImage.width = 20;
            likesImage.width = 20;


            section.appendChild(lastRow);
            lastRow.appendChild(commentsContainer);
            commentsContainer.appendChild(commentsCount);
            commentsContainer.appendChild(commentImage);
            lastRow.appendChild(likesContainer);
            likesContainer.appendChild(likes);
            likesContainer.appendChild(likesImage);

            let isProcessing = false;

            likesImage.addEventListener('click', () => {
                if (isProcessing) return;
                isProcessing = true;

                console.log(post.hasLike);
                let postUrl = baseUrl + '/' + post.id;
                if (!post.hasLike) {
                    postUrl = baseUrl + '/' + post.id + '/like';
                    fetch(postUrl, {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    })
                    .then((response) => {
                        if (response.status === 401) {
                            location.href = '/login.html';
                            localStorage.clear();
                        }
                        return response.json();
                    })
                    .then(() => {
                        likesImage.src = "../../images/heart.png";
                        post.hasLike = !post.hasLike;
                        likes.textContent = ++post.likes;
                    })
                    .finally(() => {
                        isProcessing = false;
                    });
                } else {
                    postUrl = baseUrl + '/' + post.id + '/like';
                    fetch(postUrl, {
                        method: 'DELETE',
                        headers: {
                            'accept': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    })
                    .then((response) => {
                        if (response.status === 401) {
                            location.href = '/login.html';
                            localStorage.clear();
                        }
                        return response.json();
                    })
                    .then(() => {
                        likesImage.src = "../../images/like.png";
                        post.hasLike = !post.hasLike;
                        likes.textContent = --post.likes;
                    })
                    .finally(() => {
                        isProcessing = false;
                    });
                }
            });
        });
    })
    .catch(error => {
        alert('Что-то пошло не так', error);
        localStorage.removeItem('pageNumber');
        localStorage.removeItem('page');
        location.reload();
    });
}

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
            tagSelect.appendChild(option);
        })
    })
}

fetchTags();

function fetchPostsCommunity(page = 1, size = 5) {
    console.log('1 step');
    const baseUrl = `https://blog.kreosoft.space/api/community/${localStorage.getItem('communityId')}/post`;
    const params = new URLSearchParams({
        page: page,
        size: size,
    });
    const url = `${baseUrl}?${params.toString()}`;

    console.log('2 step', url);
    fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        localStorage.setItem('count', data.pagination.count);
        count = data.pagination.count;

        const limit = page + 4;
        
        const greaterThan = document.querySelector('.greater-than');
        const lowerThan = document.querySelector('.lower-than');

        
        if (page !== 1) {
            
            let li = document.createElement('li');
            li.textContent = 1;
            lowerThan.parentNode.insertBefore(li, lowerThan.nextSibling);

            if (page - 1 !== 1) {
                let etc = document.createElement('li');
                etc.textContent = '...';
                lowerThan.parentNode.insertBefore(etc, li.nextSibling);
            }
        } 

        let pageI;
        for (pageI = page; pageI < limit && pageI <= count; pageI++) {
            let li = document.createElement('li');
            li.textContent = pageI;
            greaterThan.parentNode.insertBefore(li, greaterThan);
        }
        

        pageI = pageI > count ? count : pageI;

        
        if (pageI !== count) {
            
            let li = document.createElement('li');
            li.textContent = count;
            lowerThan.parentNode.insertBefore(li, greaterThan);

            if (count > pageI) {
                
                let etc = document.createElement('li');
                etc.textContent = '...';
                lowerThan.parentNode.insertBefore(etc, greaterThan.previousSibling);
            }
        } 
        /////////////////////////////////////////////////////////////////////////////////////
        data.posts.forEach(element => {
            let post = {
                id: element.id,
                createTime: element.createTime.substring(8,10) + '.' + element.createTime.substring(5,7) + '.' + element.createTime.substring(0,4) + ' ' + element.createTime.substring(11, 16),
                title: element.title,
                description: element.description,
                readingTime: element.readingTime,
                image: element.image,
                authorId: element.authorId,
                author: element.author,
                cummunityId: element.communityId,
                communityName: element.communityName,
                addressId: element.addressId,
                likes: element.likes,
                hasLike: element.hasLike,
                commentsCount: element.commentsCount,
                tags: element.tags
            }

            let section = document.createElement('section');
            section.classList.add('post');
            siteFooter.parentNode.insertBefore(section, siteFooter);

            let firstRow = document.createElement('div');
            firstRow.classList.add('first-row');
            section.appendChild(firstRow);

            let author = document.createElement('span');
            author.textContent = post.author + ' - ';
            let createTime = document.createElement('span');
            createTime.textContent = post.createTime;
            let communityName;
            if (post.communityName !== null) {
                console.log(post.communityName);
                communityName = document.createElement('span');
                communityName.textContent = ' в сообществе "' + post.communityName + '"';
            }

            firstRow.appendChild(author);
            firstRow.appendChild(createTime);

            if (post.communityName !== null)
                firstRow.appendChild(communityName);

            let title = document.createElement('h1');
            title.classList.add('title');
            title.textContent = post.title;
            section.appendChild(title);


            if (post.image !== null) {
                let image = document.createElement('img');
                image.src = post.image;
                image.classList.add('img-post');
                
                section.appendChild(image);
            }


            let description = document.createElement('p');
            description.innerHTML = post.description.replace(/\n/g, '<br>');
            section.appendChild(description);

            let tags = document.createElement('span');
            tags.classList.add('tags');
            post.tags.forEach(element => {
                tags.textContent += `#${element.name} `;
            });
            section.appendChild(tags);

            let readingTime = document.createElement('span');
            readingTime.textContent = 'Время чтения: ' + post.readingTime + ' мин';
            section.appendChild(readingTime);


            let lastRow = document.createElement('div');
            lastRow.classList.add('last-row');


            let commentsContainer = document.createElement('div');
            commentsContainer.classList.add('comments');

            let commentsCount = document.createElement('span');
            commentsCount.textContent = post.commentsCount;

            let commentImage = document.createElement('img');
            commentImage.src = "../../images/comment.png"
            commentImage.width = 20;
            commentImage.height = 20;
            

            let likesContainer = document.createElement('div');
            likesContainer.classList.add('likes');

            let likes = document.createElement('span');
            likes.textContent = post.likes;

            let likesImage = document.createElement('img');
            if (post.hasLike) {
                likesImage.src = "../../images/heart.png";    
            } else {
                likesImage.src = "../../images/like.png";
            }
            likesImage.width = 20;
            likesImage.width = 20;


            section.appendChild(lastRow);
            lastRow.appendChild(commentsContainer);
            commentsContainer.appendChild(commentsCount);
            commentsContainer.appendChild(commentImage);
            lastRow.appendChild(likesContainer);
            likesContainer.appendChild(likes);
            likesContainer.appendChild(likesImage);

            let isProcessing = false;

            likesImage.addEventListener('click', () => {
                if (isProcessing) return;
                isProcessing = true;

                console.log(post.hasLike);
                let postUrl = `https://blog.kreosoft.space/api/post/${localStorage.getItem('communityId')}`
                if (!post.hasLike) {
                    postUrl += '/like';
                    fetch(postUrl, {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    })
                    .then((response) => {
                        if (response.status === 401) {
                            location.href = '/login.html';
                            localStorage.clear();
                        }
                        return response.json();
                    })
                    .then(() => {
                        likesImage.src = "../../images/heart.png";
                        post.hasLike = !post.hasLike;
                        likes.textContent = ++post.likes;
                    })
                    .finally(() => {
                        isProcessing = false;
                    });
                } else {
                    postUrl += '/like';
                    fetch(postUrl, {
                        method: 'DELETE',
                        headers: {
                            'accept': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    })
                    .then((response) => {
                        if (response.status === 401) {
                            location.href = '/login.html';
                            localStorage.clear();
                        }
                        return response.json();
                    })
                    .then(() => {
                        likesImage.src = "../../images/like.png";
                        post.hasLike = !post.hasLike;
                        likes.textContent = --post.likes;
                    })
                    .finally(() => {
                        isProcessing = false;
                    });
                }
            });
        });
    })
    .catch(error => {
        alert('Что-то пошло не так с сообществом', error);
        localStorage.removeItem('pageNumber');
        localStorage.removeItem('page');
        window.location.href = '../communities.html';
    });
}

if (window.location.pathname === '/index.html') {
    fetchPosts(page, size, onlyMyCommunities);
} else if (window.location.pathname === '/communityCurrent.html') {
    fetchPostsCommunity(page, size);
}