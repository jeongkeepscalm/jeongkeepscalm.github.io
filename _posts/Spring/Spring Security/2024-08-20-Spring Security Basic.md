---
title: "Spring Security Basic"
description: Spring Security Basic
date: 2024-08-20
categories: [ Spring, Spring Security ]
tags: [ Spring, Spring Security ]
---

## 기본 개념

- `UsernamePasswordAuthenticationToken`: Authentication 구현체
  
- `InMemoryUserDetailManager`
  - UserDetailsManager 구현체
  - 설정한 유저 정보가 담김
    - e.g. spring.security.user.name = admin
    - e.g. spring.security.user.password = 1234
    - admin, 1234를 자격증명이라 한다. 
  - loadUserByUsername() 호출
  
- `AuthenticationProvider`
  - 유저 인증 방식을 정의하기 위해 Spring Security 프레임워크 내에서 구현해야 할 인터페이스
  
- `UsernamePasswordAuthenticationFilter`
  - 엔드 유저의 유저 이름과 비밀번호를 추출하여 인증을 시도한다.
  
- `SpringBootWebSecurityConfiguration`
  - 기본 시큐리티 방식을 보기 위해 해당 클래스를 살펴봄
  - defaultSecurityFilterChain(HttpSecurity http)
  
- `SecurityFilterChain`
  - 커스텀 보안 요구 사항을 정의하기 위해 웹 애플리케이션 내에서 생성해야 하는 Bean
  
- `UserDetails` 구현체
  - 유저의 세부 정보가 저장된다. 
  
- `CSRF`
  - 스프링 시큐리티 프레임워크에서 기본으로 제공하는 CSRF 보안
  - 어떤 POST 요청이든 간에 데이터베이스나 백엔드 내부의 데이터를 수정하는 것을 막는다. 
  - 

<br/>
<hr/>

## 기본 설정된 로직

- loadUserByUsername 으로 저장한 유저 정보를 DaoAuthenticationProvider.additionalAuthenticationChecks() 에서 검증한다. 
- `DaoAuthenticationProvider`: AuthenticationProvider 구현체
  - 보통 엔드 유저에 대한 복잡한 인증 요구사항이 있으므로 커스텀(AuthenticationProvider 직접 구현)하여 사용한다. 
- AuthenticationProvider.authenticate(): 엔드유저에 대해 검증한다. 
- AuthenticationProvider.supports(): 어떤 식으로 인증하겠다고 지정한다. 


