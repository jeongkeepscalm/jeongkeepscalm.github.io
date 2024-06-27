---
title: "Spring Application Properties"
description: "Spring Application Properties"
date: 2024-05-02
categories: [ Spring, Spring Settings ]
tags: [ Spring, Spring Settings ]
---

## Logging

- 전체 로그 레벨 설정(기본 info)  
  - logging.level.root=trace  
- 특정 패키지 하위 로그 레벨 설정  
  - logging.level.hello.test=trace(hello.test 패키지와 그 하위 로그 레벨 설정) 
  
- Tomcat의 HTTP/1.1 커넥터 구현과 관련된 로그에만 적용(요청메시지, 응답메시지 관련 정보)
  - logging.level.org.apache.coyote.http11=trace

<br/>
<hr>

## View

- JSP
  - 스프링 부트는 InternalResourceViewResolver 라는 뷰리졸버를 자동으로 등록하는데, 이 때 application.properties 에 등록한 spring.mvc.view.prefix, spring.mvc.view.suffix 설정 정보를 사용해서 등록한다.  
  - spring.mvc.view.prefix=/WEB-INF/views/  
  - spring.mvc.view.suffix=.jsp  

- Thymeleaf
  - 스프링 부트의 prefix 기본값: classpath:/templates/
  - 스프링 부트의 suffix 기본값: .html
  - **Thymeleaf는 classpth가 기본으로 설정되어 있기에 따로 설정이 필요없다.** 

<br/>
<hr>

## 타임리프 실시간 반영

- spring.thymeleaf.cache=false
- spring.thymeleaf.prefix=file:src/main/resources/templates/

<br/>
<hr>

## 메시지 소스 설정

- spring.messages.basename=messages,errors

<br/>
<hr>

## 쿠키를 통한 세션 유지 or Not

- server.servlet.session.tracking-modes=cookie
  - Session 유지하기 위한 URL 전달 방식을 끄고 쿠키를 통해서만 세션을 유지한다.
  - URL에 jsessionid 포함을 막는다. 
- spring.mvc.pathmatch.matching-strategy=ant_path_matcher
  - URL에 jsessionid 포함해야할 경우 옵션

<br/>
<hr>

## 세션 타임아웃 설정

- server.servlet.session.timeout=1800
  - 분 단위로 설정해야한다. 
  - JSESSIONID를 전달하는 HTTP 요청이 있으면 현재 시간으로 다시 초기화 된다. 
  - 즉, 해당 설정으로 최근에 요청한 시간을 기준으로 설정한 시간 정도를 유지할 수 있다.  

<br/>
<hr>

## off whitelabel page

- server.error.whitelabel.enabled=false

<br/>
<hr>

## BasicErrorController 오류 컨트롤러에서 오류 정보 포함 여부

- 기본값
  - server.error.include-exception=false : exception 포함 여부( true , false )
  - server.error.include-message=never : message 포함 여부
  - server.error.include-stacktrace=never : trace 포함 여부
  - server.error.include-binding-errors=never : errors 포함 여부
  > never: 사용하지 않음  
  > always:항상 사용  
  > on_param: 파라미터가 있을 때 사용  

<br/>

***/error/500.html***

```html
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="utf-8">
</head>
<body>
<div class="container" style="max-width: 600px">
  <div class="py-5 text-center">
    <h2>500 오류 화면 스프링 부트 제공</h2>
  </div>
  <div>
    <p>오류 화면 입니다.</p>
  </div>
  <ul>
    <li>오류 정보</li>
    <ul>
      <li th:text="|timestamp: ${timestamp}|"></li>
      <li th:text="|path: ${path}|"></li>
      <li th:text="|status: ${status}|"></li>
      <li th:text="|message: ${message}|"></li>
      <li th:text="|error: ${error}|"></li>
      <li th:text="|exception: ${exception}|"></li>
      <li th:text="|errors: ${errors}|"></li>
      <li th:text="|trace: ${trace}|"></li>
    </ul>
    </li>
  </ul>
  <hr class="my-4">
</div> 
</body>
</html>
```
> application.properties 파일 내 속성을 on_param으로 변경해주고  
> http://localhost:8080/error-ex?message=&errors=&trace 호출 시 해당되는 정보를 볼 수 있다.  
> **실무에서는 이것들을 노출하면 안된다! 사용자에게는 이쁜 오류 화면과 고객이 이해할 수 있는 간단한 오류 메시지를 보여주고 오류는 서버에 로그로 남겨서 로그로 확인해야 한다.**

<br/>
<hr>

## 에러 공통 처리 컨트롤러 기능 변경 시

- ErrorController 인터페이스 구현 / BasicErrorController 상속 받아 기능 추가하면 된다.  




