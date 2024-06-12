---
title: "Thymeleaf"
description: "Thymeleaf"
date: 2024-06-12
categories: [ Java, Java Template Engine ]
tags: [ Java, Java Template Engine ]
---

# Thymeleaf 특징

- `SSR(Server Side HTML Rendering)`
  - 백엔드 서버에서 HTML을 동적으로 렌더링 하는 용도
- `네츄럴 템플릿(Natural Templates)`
  - 순수 HTML을 그대로 유지하면서 뷰 템플릿으로도 사용 할 수 있는 특징 
  - th:xxx 가 붙은 부분은 서버 사이드에서 렌더링 되고, 기존 것을 대체한다. th:xxx 이 없으면 기존 html의 xxx 속성이 그대로 사용된다.
  - HTML을 파일로 직접 열었을 때, th:xxx 가 있어도 웹 브라우저는 th: 속성을 알지 못하므로 무시한다.
  - **타임리프는 순수 HTML 파일을 웹 브라우저에서 열어도 내용을 확인할 수 있고, 서버를 통해 뷰 템플릿을 거치면 동적으로 변경된 결과를 확인할 수 있다.**
- `스프링 통합 지원`

</br>
<hr>

# Thymeleaf 기본 기능

- 타임리프 사용 선언: <html xmlns:th="http://www.thymeleaf.org">
  
- 간단한 표현
  - 변수 표현식: ${...}
  - 선택 변수 표현식: *{...}
  - 메시지 표현식: #{...}
  - 링크 URL 표현식: @{...}
  - 조각 표현식: ~{...}
- 문자 연산
  - 문자 합치기: +
  - 리터럴 대체: |The name is ${name}|
- 비교 동등
  - 비교: >, <, >=, <= (gt, lt, ge, le)
  - 동등 연산: ==, != (eq, ne)
- 조건 연산
  - If-then: (if) ? (then)
  - If-then-else: (if) ? (then) : (else)
  - Default: (value) ?: (defaultvalue)  

</br>
<hr>

### 텍스트 - text, utext

```html
<ul>
    <li>th:text 사용 <span th:text="${data}"></span></li>
    <li>컨텐츠 안에서 직접 출력하기 = [[${data}]]</li>
</ul>
```

### escape

- HTML 문서는 < , > 같은 특수 문자를 기반으로 정의
- 템플릿으로 HTML 화면을 생성할 때는 출력하는 데이터에 이러한 특수 문자가 있는 것을 주의해서 사용
  
- escape
  - html에서 사용하는 특수 문자를 html 엔티팉로 변경
  - 타임리프에서 제공하는 th:text, [[...]] 는 기본적으로 이스케이프를 제공
  - < → &lt 변경 
  - > → &gt 변경 

### Unescape

- 이스케이프 기능 사용 x
  - th:text → th:utext
  - [[...]] → [(...)]
  
- 실제 서비스를 개발하다 보면 escape를 사용하지 않아서 HTML이 정상 렌더링 되지 않는 수 많은 문제가 발생
한다. escape를 기본으로 하고, 꼭 필요한 때만 unescape를 사용하자. 

### 변수 - SpringEL

```html
<h1>SpringEL 표현식</h1>
<ul>Object
  <li>${user.username} = <span th:text="${user.username}"></span></li>
  <li>${user['username']} = <span th:text="${user['username']}"></span></li>
  <li>${user.getUsername()} = <span th:text="${user.getUsername()}"></span></li>
</ul>
<ul>List
  <li>${users[0].username} = <span th:text="${users[0].username}"></span></li>
  <li>${users[0]['username']} = <span th:text="${users[0]['username']}"></span></li>
  <li>${users[0].getUsername()} = <span th:text="${users[0].getUsername()}"></span></li>
</ul>
<ul>Map
  <li>${userMap['userA'].username} = <span th:text="${userMap['userA'].username}"></span></li>
  <li>${userMap['userA']['username']} = <span th:text="${userMap['userA']['username']}"></span></li>
  <li>${userMap['userA'].getUsername()} = <span th:text="${userMap['userA'].getUsername()}"></span></li>
</ul>

<h1>지역 변수 - (th:with)</h1>
<div th:with="first=${users[0]}">
    <p>처음 사람의 이름은 <span th:text="${first.username}"></span></p>
</div>
```
> **th:with: 지역 변수 선언**  

</br>
<hr>

# Thymeleaf 기본 객체들

### 편의 객체

- HTTP 요청 파라미터 접근: ${param.paramData}
- HTTP 세션 접근: ${session.sessionData}
- 스프링 빈 접근: ${@helloBean.hello('Spring!')}

### 