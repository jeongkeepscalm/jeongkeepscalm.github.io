---
layout: post
title: WebSquare
date: 2024-02-18 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: webSquare.png # Add image post (optional)
tags: [WebSquare] # add tag
---

<br/>

### Tab

* Design Tab - 바디영역에 그려짐  
속성, 이벤트, api ( 동적 )  
  
* Script Tab - 비지니스로직, 웹스퀘어 api 활용하여 로직 제어  
	onpageload 로드 된 후 실행되는 함수   
  
* DataCollection Tab - data 객체를 생성하고 관리  
DataMap : 단건 data 관리  
DataList : 다건 data 관리  
LinkedDataList : 생성된 dataList에서 별도의 조건을 주어 filter된 data를 확인한다(뷰어용으로 제한적으로 사용됨)  
AlliasDataMap : Page Coding에서 자식에서 부모의 dataMap 객체를 참조할 때 사용  
AlliasDataList : Page Coding에서 자식에서 부모의 dataList 객체를 참조할 때 사용  

* Submission Tab - Submission 객체(웹스퀘어의 통신객체) 를 생성하여 통신  

* Source Tab - 소스 확인 용도로만 사용  

<br/>
<hr>
<br/>

### Script 9

```javascript
swin.onpageload = function() {
  ui_join.setValue($p.getCurrentServerTime());
  ui_gender.setItem("M", "남자");
  ui_gender.setItem("W", "여자");
}
```
> $p : websquare 에서 제공하는 util 객체  
> 목록성 컴포넌트 : 체크박스, 라디오버튼 등.. dataList 타입으로 정해야한다.  
  
* 디버깅  
Ctrl + 마우스 오른쪽 버튼 클릭  



