(function() {
    var searchTerm = decodeURIComponent(window.location.search.split('?q=')[1]);
    if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        var posts = document.querySelectorAll('.post-title');
        posts.forEach(function(post) {
            var title = post.innerText.toLowerCase();
            if (title.includes(searchTerm)) {
                post.closest('.post').style.display = 'block';
            } else {
                post.closest('.post').style.display = 'none';
            }
        });
    }
})();