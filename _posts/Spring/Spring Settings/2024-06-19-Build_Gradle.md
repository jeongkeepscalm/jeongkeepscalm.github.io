---
title: "Spring Build Gradle"
description: "Spring Build Gradle"
date: 2024-06-19
categories: [ Spring, Spring Settings ]
tags: [ Spring, Spring Settings ]
---

- `Spring Web`
    - 내장 톰캣 서버를 사용하여 스프링 부트 애플리케이션을 실행 ( 톰캣: 웹 요청을 처리하고 응답을 반환하는 서블릿 컨테이너 )
	  - 웹 애플리케이션 개발에 유용한 다양한 기능과 라이브러리를 포함 ( Jackson, Hibernate Validator 등.. )
  - implementation 'org.springframework.boot:spring-boot-starter-web'
  
- `Thymeleaf`
  - implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
  
- `Lombok`(Lombok : @Getter, @Setter, @RequiredArgsConstructor, @ToString ...)
  - compileOnly 'org.projectlombok:lombok'
	- annotationProcessor 'org.projectlombok:lombok'
  
- `Bean Validation` 
  - implementation 'org.springframework.boot:spring-boot-starter-validation'
  
- `MyBatis`
  - 스프링 부트 3.0 이상
    - implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.3'
    - runtimeOnly 'com.mysql:mysql-connector-j'
  
- `Jasper`(JSP 컴파일러)
  - implementation "org.apache.tomcat.embed:tomcat-embed-jasper"
  
- `JSTL`
  - 스프링 부트 3.0 이상
    - implementation group: 'org.glassfish.web', name: 'jakarta.servlet.jsp.jstl', version: '2.0.0'
  - 스프링 부트 3.0 미만
    - implementation 'javax.servlet:jstl'