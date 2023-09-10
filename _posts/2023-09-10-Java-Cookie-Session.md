---
layout: post
title: Java-Cookie-Session
date: 2023-09-10 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: cookie.jpg # Add image post (optional)
tags: [Cookie, Session] # add tag
---

## 쿠키 (Cookie)  

- http는 stateless 프로토콜 이므로 상태를 유지하지 않는다. 쿠키를 이용해서 사용자 정보를 유지할 수 있다. 
- 영속 쿠키 : 만료 날짜를 입력하면 해당 날짜까지 유지된다.
- 세션 쿠키 : 만료 날짜를 생략하면 브라우저 종료시 까지만 유지된다.  

<br/>

```java
// 로그인 성공 시, 
// 쿠키에 시간 정보를 주지 않으면 세션 쿠키(브라우저 종료시 모두 종료)  
Cookie idCookie 
  = new Cookie("memberId", String.valueOf(loginMember.getId()));
response.addCookie(idCookie);
```
> 로그인에 성공하면 쿠키를 생성하고, HttpServletResponse에 담는다. 웹 브라우저는 종료 전까지 회원의 id를 서버에서 계속 보내준다. HTTP 응답 헤더에 쿠키가 추가된 것을 확인할 수 있다.  

<br/>

```java
@GetMapping("/")
public String homeLogin(
@CookieValue(name = "memberId", required = false) Long memberId, Model model) {
  ...
  model.addAttribute("member", loginMember);
}
```
> 쿠키에 저장된 정보를 @CookieValue 어노테이션을 사용하여 편리하게 조회할 수 있다.  

<br/>

```java
// 로그아웃
@PostMapping("/logout")
public String logout(HttpServletResponse response) {
 expireCookie(response, "memberId");
 return "redirect:/";
}
private void expireCookie(HttpServletResponse response, String cookieName) {
 Cookie cookie = new Cookie(cookieName, null);
 cookie.setMaxAge(0);
 response.addCookie(cookie);
}
```
> 새 쿠키 생성해서 종료할 쿠키를 null로 설정 후 Max-Age=0 으로 set 해준다. 

<br/>

- 쿠키와 보안 문제
  1. 쿠키 값은 임의로 변경할 수 있다.
    - 실제 웹브라우저 개발자모드 Application Cookie 변경으로 확인 가능.
    - 클라이언트가 쿠키를 강제로 변경하면 다른 사용자가 된다.
    - Cookie : memberId=1 Cookie: memberId=2 (다른 사용자의 이름이 보임)
  2. 쿠키에 보관된 정보는 훔쳐갈 수 있다
    - 만약 쿠키에 개인정보나, 신용카드 정보가 있다면?
    - 이 정보가 웹 브라우저에도 보관되고, 네트워크 요청마다 계속 클라이언트에서 서버로 전달된다.
    - 쿠키의 정보가 나의 로컬 PC에서 털릴 수도 있고, 네트워크 전송 구간에서 털릴 수도 있다.

<br/>

- 대안
  1. 쿠키에 중요한 값을 노출하지 않고, 사용자 별로 예측 불가능한 임의의 토큰을 노출한다. 서버에서는 토큰과 사용자 id를 매핑해서 인식하고 서버에서 토큰을 관리한다. 
  2. 토큰이 노출 되더라도 시갖이 지나면 사용할 수 없도록 서버에서 해당 토큰의 만료시간을 짧게 30분 정도로 유지한다. 해킹이 의심되는 경우 서버에서 해당 토큰을 강제로 제거한다. 

- 목표
  - 쿠키에 중요한 정보를 보관하는 방법은 여러 보안 이슈가 있으므로, 중요한 정보는 모두 서버에 저장해야 한다. 
  - 클라이언트와 서버는 추정 불가능한 임의의 식별자 값으로 연결해야 한다.
  - **이렇게 서버에 중요한 정보를 보관하고 연결을 유지하는 방법을 세션이라고 한다.**

<br/>
<hr>
<br/>

## 세션 ( Session )

- 세션 동작 방식
  1. 로그인 정보를 받은 서버는 DB에 조회를 한다.
  2. 로그인 정보가 맞다면, UUID로 sessionId 를 생성해 key 값으로, 사용자 정보를 value 값으로 서버의 세션 저장소에 저장한다. 
  3. 서버는 클라이언트에 mySessionId라는 이름으로 sessionId 만 쿠키에 담아 전달한다.
  4. 클라이언트는 쿠키 저장소에 mySessionId 쿠키를 보관한다. 
  - **회원과 관련된 정보는 전혀 클라이언트에 전달하지 않는다.**

<br/>

<img src="/assets/img/sss.jpg" width="500px"  border="3px"/>

<br/>

  5. 클라이언트는 요청시 항상 mySessionId 쿠키를 전달한다.
  6. 서버에서는 클라이언트가 전달한 mySessionId 쿠키 정보로 세션 저장소를 조회해서 로그인시 보관한 세션 정보를 사용한다.

<img src="/assets/img/sss2.jpg" width="500px"  border="3px"/>

<br/>









