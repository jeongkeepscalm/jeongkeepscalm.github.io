(function() {
    var searchTerm = decodeURIComponent(window.location.search.split('?q=')[1]);

    if (searchTerm === 'undefined') {
        searchTerm = '';
    }

    console.log("searchTerm : ", searchTerm)

    if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        var posts = document.querySelectorAll('.post-title');

        console.log("posts : ", posts);
        posts.forEach(function(post) {
            var title = post.innerText.toLowerCase();
            var postContainer = post.closest('.post');
            var thumbnail = postContainer.querySelector('.post-thumbnail');

            if (title.includes(searchTerm)) {
                postContainer.style.display = 'block';
                if (thumbnail) {
                    thumbnail.style.display = 'block';
                }
                console.log("closest post : ", postContainer);
            } else {
                postContainer.style.display = 'none';
                if (thumbnail) {
                    thumbnail.style.display = 'none';
                }
            }
        });
    }
})();
