---
title: "Spring Application Properties"
description: "Spring Application Properties"
date: 2024-05-02
categories: [ Spring, Spring Settings ]
tags: [ Spring, Spring Settings ]
---

# Logging

- 전체 로그 레벨 설정(기본 info)  
  - logging.level.root=trace  
- 특정 패키지 하위 로그 레벨 설정  
  - logging.level.hello.test=trace(hello.test 패키지와 그 하위 로그 레벨 설정) 
  
- Tomcat의 HTTP/1.1 커넥터 구현과 관련된 로그에만 적용(요청메시지, 응답메시지 관련 정보)
  - logging.level.org.apache.coyote.http11=trace

<br/>
<hr>

# View

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

# 타임리프 실시간 반영

- spring.thymeleaf.cache=false
- spring.thymeleaf.prefix=file:src/main/resources/templates/

<br/>
<hr>

# 메시지 소스 설정

- spring.messages.basename=messages,errors

<br/>
<hr>

# 쿠키를 통한 세션 유지 or Not

- server.servlet.session.tracking-modes=cookie
  - Session 유지하기 위한 URL 전달 방식을 끄고 쿠키를 통해서만 세션을 유지한다.
  - URL에 jsessionid 포함을 막는다. 
- spring.mvc.pathmatch.matching-strategy=ant_path_matcher
  - URL에 jsessionid 포함해야할 경우 옵션


