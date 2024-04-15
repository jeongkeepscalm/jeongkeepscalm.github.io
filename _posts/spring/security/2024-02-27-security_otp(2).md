---
title: Spring Security, Spring Security Otp(2)
description: Spring Security
date: 2024-02-27T23:00:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, spring security otp, open feign ]
---

[otp_part_1](https://angrypig123.github.io/posts/security_otp(1)/){:target="\_blank"}

<h2> 비지니스 인증 서버 구현 </h2>

- ```OTP```를 받기 위한 **사용자 이름과 암호 인증**
  - ``` 사용자 ⇒ 클라이언트 ⇒ 비지니스 논리 서버 ⇒ 인증서버 ⇒ 사용자```
    - ```사용자 ⇒ 클라이언트``` : /login username:password
    - ```클라이언트 ⇒ 비지니스 논리 서버``` : /login username:password
    - ```비지니스 논리 서버 ⇒ 인증 서버``` : /user/auth username:password
    - ```인증서버 ⇒ 사용자``` : SMS 메세지로 OTP 발송


- ```TOKEN```을 받기 위한 **OTP로 인증**
  - ``` 사용자 ⇒ 클라이언트 ⇒ 비지니스 논리 서버 ⇒ 인증서버 ⇒ 사용자```
    - ```사용자 ⇒ 클라이언트``` : /login username:otp
    - ```클라이언트 ⇒ 비지니스 논리 서버``` : /login username:otp
    - ```비지니스 논리 서버 ⇒ 인증 서버``` : /otp/check username:otp
    - ```인증 서버 ⇒ 비지니스 논리 서버``` : JWT 토큰을 발급
    - ```비지니스 논리 서버 ⇒ 클라이언트``` : 토큰을 헤더에 저장.


- ```end-point```접근을 위한 토큰 인증
  - ```비지니스 논리 서버 ⇒ 클라이언트``` : /test Authentication:TOKEN
  - ```클라이언트 ⇒ 비지니스 논리 서버``` : 검증 결과에 따라 ```response``` 반환


- 구현 아키텍쳐
  - ```요청``` ⇒ ```InitialAuthenticationFilter``` ⇒ ```요청``` ⇒ ```JwtAuthenticationFilter``` ⇒ ```응답``` ⇒ ```InitialAuthenticationFilter``` ⇒ ```AuthenticationProvider``` ⇒ ```InitialAuthenticationFilter``` ⇒ ```응답```


- ```InitialAuthenticationFilter``` : ```/login```에 대한 요청에 대해서만 활성화, 사용자 이름/암호, 사용자 이름/OTP 인증 단계 처리
- ```JwtAuthenticationFilter``` : ```/login```을 제외한 모든 경로에 적용 ```end-point```를 호출할 수 있도록 ```JWT``` 검증
- ```AuthenticationProvider``` : 사용자 이름/암호, 사용자 이름/OTP 에 대한 인증 논리를 구현

<br>

<h2> AuthenticationProvider </h2>

- ```UsernamePasswordAuthenticationProvider```,```OtpAuthenticationProvider``` 두가지 인증 공급자 객체 필요.

<br>

- ```AuthenticationProvider``` 구현을 위한 ```Authentication``` 생성
  - 매개 변수가 2개인 생성자를 호출하면 인증 인스턴스가 인증 안된 상태로 유지
  - 매개 변수가 3개인 생성자를 호출하면 인증 인스턴스가 인증된 상태

<br>

- ```UsernamePasswordAuthentication```

```java
public class UsernamePasswordAuthentication extends UsernamePasswordAuthenticationToken {

  public UsernamePasswordAuthentication(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
    super(principal, credentials, authorities);
  }

  public UsernamePasswordAuthentication(Object principal, Object credentials) {
    super(principal, credentials);
  }
}
```

<br>

- ```OtpAuthentication```

```java
public class OtpAuthentication extends UsernamePasswordAuthenticationToken {

  public OtpAuthentication(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
    super(principal, credentials, authorities);
  }

  public OtpAuthentication(Object principal, Object credentials) {
    super(principal, credentials);
  }

}
```

<br>

- 인증 서버 ```end-point``` 호출

- ```RestTemplate``` 사용, **ToDO** ```openfeign```으로 변경
  - ```인증 서버``` 에 구성된 ```end-point``` 연결

```java

@Component
public class AuthenticationServerProxy {

  private final RestTemplate rest;

  public AuthenticationServerProxy(RestTemplate rest) {
    this.rest = rest;
  }

  @Value("${auth.server.base.url}")
  private String baseUrl;

  public void sendAuth(String username, String password) {
    String url = baseUrl + "/user/auth";

    var body = new User();
    body.setUsername(username);
    body.setPassword(password);

    var request = new HttpEntity<>(body);

    rest.postForEntity(url, request, Void.class);
  }

  public boolean sendOTP(String username, String code) {
    String url = baseUrl + "/otp/check";

    var body = new User();
    body.setUsername(username);
    body.setCode(code);

    var request = new HttpEntity<>(body);

    var response = rest.postForEntity(url, request, Void.class);

    return response.getStatusCode().equals(HttpStatus.OK);
  }
}
```

<br>

<h2> AuthenticationProvider </h2>

- ```UsernamePasswordAuthenticationProvider```

```java

@Component
public class UsernamePasswordAuthenticationProvider implements AuthenticationProvider {

  private final AuthenticationServerProxy proxy;

  public UsernamePasswordAuthenticationProvider(AuthenticationServerProxy proxy) {
    this.proxy = proxy;
  }

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    String username = authentication.getName();
    String password = String.valueOf(authentication.getCredentials());
    proxy.sendAuth(username, password);
    return new UsernamePasswordAuthenticationToken(username, password);
  }

  @Override
  public boolean supports(Class<?> aClass) {
    return UsernamePasswordAuthentication.class.isAssignableFrom(aClass);
  }
}
```

- ```OtpAuthenticationProvider```

```java

@Component
public class OtpAuthenticationProvider implements AuthenticationProvider {

  private final AuthenticationServerProxy proxy;

  public OtpAuthenticationProvider(AuthenticationServerProxy proxy) {
    this.proxy = proxy;
  }

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    String username = authentication.getName();
    String code = String.valueOf(authentication.getCredentials());
    boolean result = proxy.sendOTP(username, code);

    if (result) {
      return new OtpAuthentication(username, code);
    } else {
      throw new BadCredentialsException("Bad credentials.");
    }
  }

  @Override
  public boolean supports(Class<?> aClass) {
    return OtpAuthentication.class.isAssignableFrom(aClass);
  }
}
```

- **TO-DO** ```인증필터```, ```JWT 필터 구현```
