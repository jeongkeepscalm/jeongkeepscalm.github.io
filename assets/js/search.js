(function() {
    var searchTerm = decodeURIComponent(window.location.search.split('?q=')[1]);

    if (searchTerm === 'undefined') {
        searchTerm = '';
    }

    if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        var posts = document.querySelectorAll('.post-title');

        posts.forEach(function(post) {
            var title = post.innerText.toLowerCase();
            var postContainer = post.closest('.post');
            var postContent = post.closest('.post-content');
            var thumbnail = postContainer.querySelector('.post-thumbnail');

            if (title.includes(searchTerm)) {
                postContent.style.display = 'block';
                if (thumbnail) {
                    thumbnail.style.display = 'block';
                }
            } else {
                postContainer.style.display = 'none';
                postContent.style.display = 'none';
                if (thumbnail) {
                    thumbnail.style.display = 'none';
                }
            }
        });
    }

})();
