---
layout: post
title: JavaScript
date: 2023-08-15 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: js-1.png # Add image post (optional)
tags: [Js, Conference] # add tag
---

### Turn ( NodeList or HTMLCollection ) into Array

> javascript
Array.prototype.slice.call( [ NodeList or HTMLCollection ] )
  .forEach( function (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      ...
    }
  })

```javascript
Array.prototype.slice.call( [ NodeList or HTMLCollection ] )
  .forEach( function (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      ...
    }
  })
```
> NodeList 나 HTMLCollection 을 배열로 바꿔서 이벤트를 각 노드를에 이벤트를 줄 수 있다. 

<hr>


