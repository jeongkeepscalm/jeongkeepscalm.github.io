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
  
* DataCollection Tab - 값을 담아내는 객체  
DataMap : 단건 data 관리  
DataList : 다건 data 관리  
LinkedDataList : 생성된 dataList에서 별도의 조건을 주어 filter된 data를 확인한다(뷰어용으로 제한적으로 사용됨)  
AlliasDataMap : Page Coding에서 자식에서 부모의 dataMap 객체를 참조할 때 사용   
AlliasDataList : Page Coding에서 자식에서 부모의 dataList 객체를 참조할 때 사용    
타켓데이터 내 항목을 드래그하여 컴포넌트에 놓으면 레퍼런스가 걸려서 통신 후 데이터가 자동으로 해당 항목에 바인드된다.  
컴포넌트 클릭 후, 속성 탭 검색창에 ref를 검색하면 해당 컴포넌트에 참조되어있는 데이터를 볼 수 있다.  
  
* Submission Tab - Submission 객체(웹스퀘어의 통신객체) 를 생성하여 통신  
ID : 고유값  
Reference : 서버에 보낼 데이터  
Target : 서버로부터 받은 데이터를 바인딩  
URL Action : 서버 url  
Process Message : 통신을 할 때, 프로세스 바가 제공되고 메세지를 지정할 수 있다.  
Submit : 서버 통신 전 실행될 함수명을 적는다.( validation, init ...)  
Submit-done : 서버 통신 후 실행될 콜백함수를 적는다.  
Submit-error : 통신 실패시 실행될 함수를 적는다.  
  
* Source Tab - 소스 확인 용도로만 사용  

<br/>
<hr>
<br/>

### Script 

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

* 그리드뷰  
각각의 컬럼에도 다양한 타입으로 표현하는 컴포넌트  
  

