---
layout: post
title: Jquery
date: 2023-10-24 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: jquery.png # Add image post (optional)
tags: [Jquery] # add tag
---

## get all ids

```javascript
$("[id^='depositBtn_']").click(function(){})
```
> 해당 ID를 포함하고 있는 모든 ID를 배열에 담아 이벤트를 준다. 

<br/>
<hr>
<br/>

## checkbox event

```javascript
checkboxEvent : function () {
    $("input[name='checkbox']").change(function() {
        // 화살표 함수 (=>) 는 함수 내부에서 this 가 바인딩되지 않기 때문에, 상위 코드 $(this).prop("checked")에서 this 는 체크된 체크박스를 가리키지 않았다.
        if ($(this).prop("checked")) {
            $cate.data.checkedLv2cds.push($(this).attr("id"));
            $cate.data.checkedCategories.push($(this).closest("tr").find("td:eq(1)").text());
        } else {
            $cate.data.checkedLv2cds = $cate.data.checkedLv2cds.filter(v => v != $(this).attr("id"));
            $cate.data.checkedCategories = $cate.data.checkedCategories.filter(v => v != $(this).closest("tr").find("td:eq(1)").text());
        }
        $cate.draw.categoryButton();
    })
},
```

<br/>

```javascript
let ifAllChecked = 0;

function firstCheck() {
    $("#ch1").is(":checked") ? ifAllChecked++ : ifAllChecked--;
    ifAllChecked === 2 ? $("#ch3").prop("checked", true) : $("#ch3").prop("checked", false);
}

function secondCheck() {
    $("#ch2").is(":checked") ? ifAllChecked++ : ifAllChecked--;
    ifAllChecked === 2 ? $("#ch3").prop("checked", true) : $("#ch3").prop("checked", false);
}

function allCheck(){
    if($("#ch3").is(":checked")){
        $("#ch1").prop("checked", true);
        $("#ch2").prop("checked", true);
        ifAllChecked = 2;
    } else {
        $("#ch1").prop("checked", false);
        $("#ch2").prop("checked", false);
        ifAllChecked = 0;
    }
}
```

<br/>
<hr>
<br/>

## 

```javascript

```















