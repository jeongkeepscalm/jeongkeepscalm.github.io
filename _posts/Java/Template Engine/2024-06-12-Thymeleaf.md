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

<br/>
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

<br/>
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

<br/>
<hr>

# Thymeleaf 기본 객체들

### 편의 객체

- HTTP 요청 파라미터 접근: ${param.paramData}
- HTTP 세션 접근: ${session.sessionData}
- 스프링 빈 접근: ${@helloBean.hello('Spring!')}

```html
<h1>식 기본 객체 (Expression Basic Objects)</h1>
<ul>
  <li>request = <span th:text="${request}"></span></li>
  <li>response = <span th:text="${response}"></span></li>
  <li>session = <span th:text="${session}"></span></li>
  <li>servletContext = <span th:text="${servletContext}"></span></li>
  <li>locale = <span th:text="${#locale}"></span></li>
</ul>
<h1>편의 객체</h1>
<ul>
  <li>Request Parameter = <span th:text="${param.paramData}"></span></li>
  <li>session = <span th:text="${session.sessionData}"></span></li>
  <li>spring bean = <span th:text="${@helloBean.hello('Spring!')}"></span></li>
</ul>
```

<br/>
<hr>

### 유틸리티 객체와 날짜

- #message : 메시지, 국제화 처리
- #uris : URI 이스케이프 지원
- #dates : java.util.Date 서식 지원
- #calendars : java.util.Calendar 서식 지원
- #temporals : 자바8 날짜 서식 지원
- #numbers : 숫자 서식 지원
- #strings : 문자 관련 편의 기능
- #objects : 객체 관련 기능 제공
- #bools : boolean 관련 기능 제공
- #arrays : 배열 관련 기능 제공
- #lists , #sets , #maps : 컬렉션 관련 기능 제공
- #ids : 아이디 처리 관련 기능 제공
  
- 타임리프 유틸리티 객체: <a href='https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#expression-utility-objects'></a>
- 유틸리티 객체 예시: <a href='https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#appendix-b-expression-utility-objects'></a>
  
- temporals
  - ${#temporals.day(localDateTime)} = 13
  - ${#temporals.month(localDateTime)} = 6
  - ${#temporals.monthName(localDateTime)} = 6월
  - ${#temporals.monthNameShort(localDateTime)} = 6월
  - ${#temporals.year(localDateTime)} = 2024
  - ${#temporals.dayOfWeek(localDateTime)} = 4
  - ${#temporals.dayOfWeekName(localDateTime)} = 목요일
  - ${#temporals.dayOfWeekNameShort(localDateTime)} = 목
  - ${#temporals.hour(localDateTime)} = 12
  - ${#temporals.minute(localDateTime)} = 38
  - ${#temporals.second(localDateTime)} = 10
  - ${#temporals.nanosecond(localDateTime)} = 839286100

<br/>
<hr>

# URL 링크: @{...}

```html
<h1>URL 링크</h1>
<ul>
  <li><a th:href="@{/hello}">basic url</a></li>
  <li><a th:href="@{/hello(name = ${user.username}, age = ${user.age})}">query parameter</a></li>
  <li><a th:href="@{/hello/{param1}/{param2}(param1 = ${param1}, param2 = ${param2})}">path variable</a></li>
  <li><a th:href="@{/hello/{param1}(param1 = ${param1}, param2 = ${param2})}">path variable + query parameter</a></li>
  <!--
      /hello
      /hello?name=ojg&age=32
      /hello/data1/data2
      /hello/data1?param2=data2
  -->
</ul>
```

<br/>
<hr>

# 리터럴(Literals): \'...\'

```java
String a = "hello";     // 문자 리터럴 
int a = 10 * 20;        // 숫자 리터럴
boolean a = true;       // 불리언 리터럴
```
  
- 타임리프에서 문자 리터럴은 항상 '(작은 따옴표)로 감싸야한다.
- 오류 구문 
  - th:text="hello world!"
- 정상 구문
  - th:text="\'hello world\'"
  - th:text="helloWorld"
  
```html
<h1>리터럴</h1>
<ul>
  <!-- parsing error -->
  <!-- <li><span th:text="hello world"></span></li> -->
  <li><span th:text="'hello Spring!'"></span></li>
  <li><span th:text="'hello ' + ${data}"></span></li>
  <!-- 리터럴 대체 문법 -->
  <li><span th:text="|hello ${data}|"></span></li>
</ul>
```

<br/>
<hr>

# 연산

```html
<ul>
  <li>산술 연산
    <ul>
        <li>10 + 2 = <span th:text="10 + 2"></span></li>
        <li>10 % 2 == 0 = <span th:text="10 % 2 == 0"></span></li>
    </ul>
  </li>
  <li>비교 연산
    <ul>
        <li>1 > 10 = <span th:text="1 &gt; 10"></span></li>
        <li>1 gt 10 = <span th:text="1 gt 10"></span></li>
        <li>1 >= 10 = <span th:text="1 >= 10"></span></li>
        <li>1 ge 10 = <span th:text="1 ge 10"></span></li>
        <li>1 == 10 = <span th:text="1 == 10"></span></li>
        <li>1 != 10 = <span th:text="1 != 10"></span></li>
    </ul>
  </li>
  <li>조건식
    <ul>
        <li>(10 % 2 == 0)? '짝수':'홀수' = <span th:text="(10 % 2 == 0)?'짝수':'홀수'"></span></li>
    </ul>
  </li>
  <li>Elvis 연산자
    <ul>
        <li>${data}?: '데이터가 없습니다.' = <span th:text="${data}?: '데이터가없습니다.'"></span></li>
        <li>${nullData}?: '데이터가 없습니다.' = <span th:text="${nullData}?:'데이터가 없습니다.'"></span></li>
    </ul>
  </li>
  <li>No-Operation
    <ul>
        <li>${data}?: _ = <span th:text="${data}?: _">데이터가 없습니다.</span></li>
        <li>${nullData}?: _ = <span th:text="${nullData}?: _">데이터가없습니다.</span></li>
    </ul>
  </li>
</ul>
```

<br/>
<hr>

# 속성 값 추가

```html
<h1>속성 설정</h1>
<input type="text" name="mock" th:name="userA"/>
<h1>속성 추가</h1>
- th:attrappend = <input type="text" class="text" th:attrappend="class='large'"/><br/>
- th:attrprepend = <input type="text" class="text" th:attrprepend="class='large'"/><br/>
- th:classappend = <input type="text" class="text" th:classappend="large" /><br/>
<h1>checked 처리</h1>
- checked o <input type="checkbox" name="active" th:checked="true"/><br/>
- checked x <input type="checkbox" name="active" th:checked="false"/><br/>
- checked=false <input type="checkbox" name="active" checked="false"/><br/>
```
> HTML에서는 <input type="checkbox" name="active" checked="false" /> 이 경우에도 checked 속성이 있기 때문에 checked 처리가 되어버린다.  
> 타임리프의 th:checked 는 값이 false 인 경우 checked 속성 자체를 제거한다.  

<br/>
<hr>

# 반복
