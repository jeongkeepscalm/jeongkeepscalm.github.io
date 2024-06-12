---
title: "Spring Application Properties"
description: "Spring Application Properties"
date: 2024-05-02
categories: [ Spring, Spring Settings ]
tags: [ Spring, Spring Settings ]
---

## Log

- 전체 로그 레벨 설정(기본 info)  
  logging.level.root=info  
- hello.test 패키지와 그 하위 로그 레벨 설정  
  logging.level.hello.test=debug  

## View

- 스프링 부트는 InternalResourceViewResolver 라는 뷰리졸버를 자동으로 등록하는데, 이 때 application.properties 에 등록한 spring.mvc.view.prefix, spring.mvc.view.suffix 설정 정보를 사용해서 등록한다.  
  spring.mvc.view.prefix=/WEB-INF/views/  
  spring.mvc.view.suffix=.jsp  

## 타임리프 실시간 반영

spring.thymeleaf.cache=false
spring.thymeleaf.prefix=file:src/main/resources/templates/

