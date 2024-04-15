---
title: Spring Security, Security Context Holder
description: Spring Security
date: 2024-02-26T19:40:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, security context holder ]
---

- ```SecurityContextHolder```
  - 인증된 사용자의 정보를 세션에 저장해놓는 객체
    - ```getContext()``` 메소드를 통해 ```Authentication``` 정보를 가져올 수 있다.

- ```Authentication``` : 사용자 인증 정보를 가지고 있는 객체
  - ```getPrincipal()``` : 접근 요청을 하는 사용자 정보를 가져온다.
  - ```getCredentials()``` : 인증에 사용된 암호 반환.
  - ```getDetails()``` : 요청 세션이름, IP 주소를 가져온다.
  - ```isAuthenticated()``` : 인증 종료 후  true반환 진행중이면 false 반환
  - ```getAuthorities()``` : 허가된 권한 컬렉션 반환

<h2> 저장 시점 </h2>

- ```AuthenticationProvider```에서 인증이 완료되면 ```Authentication``` 객체를 반환함

```java
    @Override
    @Transactional
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String email = authentication.getName();
        String password = authentication.getCredentials().toString();
        UserDetails userDetails = jpaUserDetailsService.loadUserByUsername(email);
        boolean passwordValidate = passwordEncoder.matches(password, userDetails.getPassword());

        if (passwordValidate) {
            return new UsernamePasswordAuthenticationToken(
                    userDetails,    //  principal
                    userDetails.getPassword(),  //  password
                    userDetails.getAuthorities()    //  authority
            );
        } else {
            throw new BadCredentialsException("Something went wrong!");
        }
    }
```

<br>

<h2> UsernamePasswordAuthenticationToken </h2>

- ```UsernamePasswordAuthenticationToken``` 해당 클래스는 어떤 값들을 인자로 받는걸까?


```java
	public UsernamePasswordAuthenticationToken(Object principal, Object credentials,
			Collection<? extends GrantedAuthority> authorities) {
		super(authorities);
		this.principal = principal;
		this.credentials = credentials;
		super.setAuthenticated(true); // must use super, as we override
	}
```

- ```this.principal = principal``` : 사용자 정보를 저장.
- ```this.credentials = credentials``` : 사용자 인증 정보를 저장(해당 프로젝트에서는 password)
- ```super(authorities)``` : 사용자 권한 목록
- ```super.setAuthenticated(true)``` : 인증 여부를 ```true```로 한다

<br>

<h2> 인증 후 Session 확인 </h2>

- 인증이 정상적으로 이루어지고 ```Authentication``` 객체를 올바르게 리턴을 하였을 때 2가지 세션이 설정됨
  - ```SPRING_SECURITY_CONTEXT``` : 주요 컨텍스트 저장.
  - ```SPRING_SECURITY_SAVED_REQUEST``` : 보호된 리소스에 접근하여 요청이 반려 되었을 떄 요청을 저장하고 리다이렉션 할때 사용

<br>

<h2> 컨트롤러에서 확인 </h2>

- 컨트롤러 코드

```java
package org.spring.example.jpa.controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping(path = "/main")
public class MainController {

    @GetMapping
    public String defaultMain(Authentication authentication, Model model) {
        Object details = authentication.getPrincipal();
        if (null != details) {
            if (details instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) details;
                log.info(authentication.getDetails().toString());
                log.info("user name = {}", userDetails.getUsername());
                log.info("user password = {}", userDetails.getPassword());
                for (GrantedAuthority authority : userDetails.getAuthorities()) {
                    log.info("user authority = {}", authority.getAuthority());
                }
            }
        }

        return "/main/form";
    }

}

```

- 로그

```text
WebAuthenticationDetails [RemoteIpAddress=0:0:0:0:0:0:0:1, SessionId=A469EB58A5D624FF68AAC28788F450DB]
user name = admin@gmail.com
user password = $2a$10$NoQLGfkiyQx9hXil85YBvuk92dL9WIzUTzofthDvQdxOUi2nO20XC
user authority = admin_enter
```
