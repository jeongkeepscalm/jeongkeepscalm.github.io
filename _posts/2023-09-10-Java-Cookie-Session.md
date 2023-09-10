---
layout: post
title: Java-Cookie-Session
date: 2023-09-10 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: cookie.jpg # Add image post (optional)
tags: [Cookie, Session] # add tag
---

## 쿠키 (Cookie)
<br/>
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
<hr>
<br/>


