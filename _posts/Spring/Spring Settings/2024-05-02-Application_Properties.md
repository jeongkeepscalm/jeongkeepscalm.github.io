---
title: "Spring Application Properties"
description: "Spring Application Properties"
date: 2024-05-02
categories: [ Spring, Spring Settings ]
tags: [ Spring, Spring Settings ]
---

# Logging

- 전체 로그 레벨 설정(기본 info)  
  - <code>logging.level.root=trace</code>
- 특정 패키지 하위 로그 레벨 설정  
  - <code>logging.level.hello.test=trace</code>(hello.test 패키지와 그 하위 로그 레벨 설정) 
  
- Tomcat의 HTTP/1.1 커넥터 구현과 관련된 로그에만 적용(요청메시지, 응답메시지 관련 정보)
  - <code>logging.level.org.apache.coyote.http11=trace</code>

<br/>
<hr>

# View

### JSP

- 뷰 리졸버
  - 스프링 부트는 InternalResourceViewResolver 라는 뷰리졸버를 자동으로 등록하는데, 이 때 application.properties 에 등록한 spring.mvc.view.prefix, spring.mvc.view.suffix 설정 정보를 사용해서 등록한다.  
  - <cdoe>spring.mvc.view.prefix=/WEB-INF/views/</code>  
  - <cdoe>spring.mvc.view.suffix=.jsp</code>
- 변경시 실시간 반영
  - <cdoe>server.servlet.jsp.init-parameters.development=true</code>

### Thymeleaf

- 뷰 리졸버
  - 스프링 부트의 prefix 기본값: classpath:/templates/
  - 스프링 부트의 suffix 기본값: .html
  - **Thymeleaf는 classpth가 기본으로 설정되어 있기에 따로 설정이 필요없다.** 
- 변경시 실시간 반영
  - <code>spring.thymeleaf.cache=false</code>
  - <code>spring.thymeleaf.prefix=file:src/main/resources/templates/</code>

<br/>
<hr>

# 메시지 소스 설정

- <code>spring.messages.basename=messages,errors</code>

<br/>
<hr>

# 쿠키를 통한 세션 유지 or Not

- <code>erver.servlet.session.tracking-modes=cookie</code>
  - Session 유지하기 위한 URL 전달 방식을 끄고 쿠키를 통해서만 세션을 유지한다.
  - URL에 jsessionid 포함을 막는다. 
- <code>spring.mvc.pathmatch.matching-strategy=ant_path_matcher</code>
  - URL에 jsessionid 포함해야할 경우 옵션

<br/>
<hr>

# 세션 타임아웃 설정

- <code>server.servlet.session.timeout=1800</code>
  - 분 단위로 설정해야한다. 
  - JSESSIONID를 전달하는 HTTP 요청이 있으면 현재 시간으로 다시 초기화 된다. 
  - 즉, 해당 설정으로 최근에 요청한 시간을 기준으로 설정한 시간 정도를 유지할 수 있다.  

<br/>
<hr>

# off whitelabel page

- <code>server.error.whitelabel.enabled=false</code>

<br/>
<hr>

# DB 설정 정보

- <code>spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver</code>
- <code>spring.datasource.url=jdbc:mysql://___.___.___.___:3306/________</code>
- <code>spring.datasource.username=____</code>
- <code>spring.datasource.password=____</code>

<br/>
<hr>

# 마이바티스 매퍼 경로 설정

- <code>mybatis.mapper-locations=/mapper/**/*.xml</code>




