(function() {
    var searchTermInput = document.getElementById('search-input');
    var posts = document.querySelectorAll('.post-title');

    searchTermInput.addEventListener('input', function() {
        var searchTerm = searchTermInput.value.trim().toLowerCase();
        posts.forEach(function(post) {
            var title = post.innerText.toLowerCase();
            var postElement = post.closest('.post');
            if (title.includes(searchTerm)) {
                postElement.style.display = 'block';
            } else {
                postElement.style.display = 'none';
            }
        });
    });
})();