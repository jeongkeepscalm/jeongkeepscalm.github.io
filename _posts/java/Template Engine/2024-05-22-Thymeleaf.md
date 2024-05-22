---
title: "Thymeleaf"
description: "Thymeleaf"
date: 2024-05-22
categories: [ Java, Java Template Engine ]
tags: [ Java, Java Template Engine ]
---

## Thymeleaf Basic

**타임리프 핵심**
- th:xxx 가 붙은 부분은 서버사이드에서 렌더링 되고, 기존 것을 대체한다. th:xxx 이 없으면 기존 html의 xxx 속성이 그대로 사용된다.  
- HTML을 파일로 직접 열었을 때, th:xxx 가 있어도 웹 브라우저는 th: 속성을 알지 못하므로 무시한다.  
- 따라서 HTML을 파일 보기를 유지하면서 템플릿 기능도 할 수 있다.  
- **타임리프는 순수 HTML 파일을 웹 브라우저에서 열어도 내용을 확인할 수 있고, 서버를 통해 뷰 템플릿을 거치면 동적으로 변경된 결과를 확인할 수 있다.**  
- ```네츄럴 템플릿(Natural Templates)```: 순수 HTML을 그대로 유지하면서 뷰 템플릿으로도 사용 할 수 있는 특징  

<br/>

```html
<!DOCTYPE HTML>
<!-- 타임리프 사용 선언 -->
<html xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="utf-8">
  <!-- th:href -->
  <link href="../css/bootstrap.min.css" th:href="@{/css/bootstrap.min.css}" rel="stylesheet">
</head>
<body>
<div class="container" style="max-width: 600px">
  <div class="py-5 text-center">
    <h2>상품 목록</h2>
  </div>
  <div class="row">
    <div class="col">
      <!-- 
        th:onclick
        |...|        리터럴 대체 문법 
        @{...}       URL 링크 표현식
      -->
      <button class="btn btn-primary float-end"
        onclick="location.href='addForm.html'"
        th:onclick="|location.href='@{/basic/items/add}'|"
        type="button">상품 등록
      </button>
    </div>
  </div>
  <hr class="my-4">
  <div>
    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>상품명</th>
        <th>가격</th>
        <th>수량</th>
      </tr>
      </thead>
      <tbody>
      <!-- 
        th:each      반복 출력 
        ${...}       변수 표현식
        @{...}       URL 링크 표현식
      -->
      <tr th:each="item : ${items}">
        <td><a href="item.html" th:href="@{/basic/items/{itemId}(itemId=${item.id})}" th:text="${item.id}">회원id</a></td>
        <td><a href="item.html" th:href="@{|/basic/items/${item.id}|}" th:text="${item.itemName}">상품명</a></td>
        <td th:text="${item.price}">10000</td>
        <td th:text="${item.quantity}">10</td>
      </tr>
      </tbody>
    </table>
  </div>
</div> <!-- /container -->
</body>
</html>

<div>
  <label for="itemId">상품 ID</label>
  <!-- th:value -->
  <input type="text" id="itemId" name="itemId" class="form-control" value="1" th:value="${item.id}" readonly>
</div>


<!-- th:action -->
<form action="item.html" th:action method="post">
  <div></div>
</form>
```
> ```th:href```  
> href 속성의 값을 변경한다. 만약 값이 없다면 새로 생성한다.  
> HTML을 그대로 볼 때는 href 속성이 사용되고, 뷰 템플릿을 거치면 th:href 의 값이 href 로 대체되면서 동적으로 변경할 수 있다.  
>   
> ```URL 링크 표현식 - @{...}```  
> URL 링크를 사용하는 경우 사용한다.  
> URL 링크 표현식을 사용하면 서블릿 컨텍스트를 자동으로 포함한다.  
> 예: th:href="@{/basic/items/{itemId}(itemId=${item.id}, query='test')}"  
> 생성 링크: http://localhost:8080/basic/items/1?query=test
>   
> ```th:onclick```  
> 리터럴 대체(|...|) 문법이 사용  
> 
> ```th:value="${item.id}"```   
> 모델에 있는 item 정보를 획득하고 프로퍼티 접근법으로 출력한다. ( item.getId() )  
> value 속성을 th:value 속성으로 변경한다.  