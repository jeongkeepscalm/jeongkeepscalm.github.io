---
layout: post
title: Jquery_Basic
date: 2023-10-24 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: jquery.png # Add image post (optional)
tags: [Jquery] # add tag
---

## How to grant event

```javascript

// Single Event
    $(".btn").click(function(){
        alert();
    })

// Group Event
// 1. has common function
    $(".btn").on("mouseover focus", function(){
        alert();
    })
// 2. has common function
    $(".btn").on({"mouseover focus" : function(){
            alert();
        }
    })
// 3. has each function
    $(".btn").on({
        "mouseover" : function(){
            alert(1);
        }, 
        "focus" : function(){
            alert(2);
        }
    })
```

<br/>
<hr>
<br/>

## delegate, one 

```javascript

$(function () {

    // delegate - 선택한 요소의 하위 요소에 이벤트 등록한다.  
    $(".btn_wrap").delegate(".btn_1.on", "mouseover focus", function () {
        alert("HELLO!");
    });
    $(".btn_1").addClass("on");

    // one - 일회성 이벤트를 준다. 
    $(document).one("mouseover focus", ".btn_2.on", function () {
        alert("WELCOME!");
    });
    $(".btn_2").addClass("on");

});

```

<br/>
<hr>
<br/>

## off

```javascript
$(function () {

    // 해당 노드에 이벤트를 준다.  
    $(".btn_1").on("mouseover", function () {
        alert("HELLO!");
    });
    $(document).on("mouseover", ".btn_2", function () {
        alert("WELCOME!");
    });
    var btn_2 = $("<p><button class=\"btn_2\">버튼2</button></p>");
    $("#wrap").append(btn_2);

    // 해당 노드가 가지고 있는 이벤트를 제거한다. 
    $(".del_1").on("click", function () {
        $(".btn_1").off("mouseover");
    });
    $(".del_2").on("click", function () {
        $(document).off("mouseover", ".btn_2");
    });

});
```

<br/>
<hr>
<br/>

## event execution order

```javascript
$(function () {
    // 이벤트 등록 후, 클래스 추가하여 이벤트가 들지 않음. 
    $(".btn_1.on").on("mouseover focus", function () {
        alert("HELLO!");
    });
    $(".btn_1").addClass("on");

    // 라이브 이벤트 등록 방식으로 이벤트를 등록 후 클래스 값 생성하면 이벤트 정상 작동.
    $(document).on("mouseover focus", ".btn_2.on", function () {
        alert("WELCOME!");
    });
    $(".btn_2").addClass("on");
});
```

<br/>
<hr>
<br/>

## change

```javascript
$(function(){
	$("#rel_site").on("change", function(){
		$(".txt").text($(this).val());
	});
});
```

<br/>
<hr>
<br/>

## dblclick

```javascript
$(function () {
    $(".btn1").on("click", function (e) {
        e.preventDefault();
        $(".btn1").parent().next().css("background-color", "#ff0");
        // === $(".txt1").css({"background-color":"#ff0"});
    });
    $(".btn2").on("click", function (e) {
        $(".txt2").css({ "background-color": "#0ff" });
    });
    // 더블 클릭
    $(".btn3").on("dblclick", function () {
        $(".txt3").css({ "background-color": "#0f0" });
    });
});
```

<br/>
<hr>
<br/>

## 
```javascript

```

<br/>
<hr>
<br/>

## 
```javascript

```

<br/>
<hr>
<br/>

## 
```javascript

```

<br/>
<hr>
<br/>

## 
```javascript

```

<br/>
<hr>
<br/>

## 
```javascript

```

<br/>
<hr>
<br/>

## 
```javascript

```

<br/>
<hr>
<br/>

## 
```javascript

```

<br/>
<hr>
<br/>

## 
```javascript

```




