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
            
            if (title.includes(searchTerm)) {
                post.closest('.post').style.display = 'block';
                console.log("closest post : ",post.closest('.post'))
            } else {
                post.closest('.post').style.display = 'none';
            }
        });
    }
})();
