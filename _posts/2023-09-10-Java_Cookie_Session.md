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
  5. 클라이언트는 요청시 항상 mySessionId 쿠키를 전달한다.
  6. 서버에서는 클라이언트가 전달한 mySessionId 쿠키 정보로 세션 저장소를 조회해서 로그인시 보관한 세션 정보를 사용한다.

<br/>

<img src="/assets/img/sss.jpg" width="500px"  border="3px"/>

<br/>

<img src="/assets/img/sss2.jpg" width="500px"  border="3px"/>

<br/>

- 세션 생성
  - UUID로 sessionId 생성.
  - 세션 저장소에 sessionId 와 보관할 값 저장.
  - sessionId로 응답 쿠키를 생성해서 클라이언트에 전달.
- 세션 조회
  - 클라이언트가 요청한 sessionId 쿠키의 값으로, 세션 저장소에 보관한 값 조회.
- 세션 만료
  - 클라이언트가 요청한 sessionId 쿠키의 값으로, 세션 저장소에 보관한 sessionId와 값 제거.

```java
/**
 * 세션 관리
 */
@Component
public class SessionManager {

public static final String SESSION_COOKIE_NAME = "mySessionId";
private Map<String, Object> sessionStore = new ConcurrentHashMap<>();

/**
 * 세션 생성
 */
public void createSession(Object value, HttpServletResponse response) {
  //세션 id를 생성하고, 값을 세션에 저장
  String sessionId = UUID.randomUUID().toString();
  sessionStore.put(sessionId, value);
  //쿠키 생성
  Cookie mySessionCookie = new Cookie(SESSION_COOKIE_NAME, sessionId);
  response.addCookie(mySessionCookie);
}
/**
 * 세션 조회
 */
public Object getSession(HttpServletRequest request) {
  Cookie sessionCookie = findCookie(request, SESSION_COOKIE_NAME);
  if (sessionCookie == null) {
    return null;
  }
  return sessionStore.get(sessionCookie.getValue());
}
/**
 * 세션 만료
 */
public void expire(HttpServletRequest request) {
  Cookie sessionCookie = findCookie(request, SESSION_COOKIE_NAME);
  if (sessionCookie != null) {
    sessionStore.remove(sessionCookie.getValue());
  }
}
private Cookie findCookie(HttpServletRequest request, String cookieName) {
  if (request.getCookies() == null) {
    return null;
  }
  return Arrays.stream(request.getCookies())
    .filter(cookie -> cookie.getName().equals(cookieName))
    .findAny()
    .orElse(null);
  }
}
```

<br/>

```java
@PostMapping("/login")
public String loginV2(@Valid @ModelAttribute LoginForm form, 
  BindingResult bindingResult, HttpServletResponse response) {
  ...
  // 로그인 성공 시, 세션 관리자를 통해 세션을 생성하고, 회원 데이터 보관
  sessionManager.createSession(loginMember, response);
  return "redirect:/";
}
```
> 로그인 성공시 세션을 등록한다. 세션에 loginMember 를 저장해두고, 쿠키도 함께 발행한다.

<br/>

```java
@PostMapping("/logout")
public String logoutV2(HttpServletRequest request) {
  sessionManager.expire(request);
  return "redirect:/";
}
```

```java
@GetMapping("/")
public String homeLoginV2(HttpServletRequest request, Model model) {
  //세션 관리자에 저장된 회원 정보 조회
  Member member = (Member)sessionManager.getSession(request);
  if (member == null) {
    return "home";  
  }
  //로그인
  model.addAttribute("member", member);
  return "loginHome";
}
```

<br/>

- 프로젝트마다 이러한 세션 개념을 직접 개발하는 것은 상당이 불편하다. **그래서 서블릿도 세션 개념을 지원한다.**

<br/>

- **HttpSession (서블릿이 공식 지원하는 세션)**
  - SessionManager 와 같은 방식으로 동작한다. 
  - 서블릿을 통해 HttpSession 을 생성하면 쿠키 이름 JSESSIONID, 값은 추정 불가능한 랜덤값의 쿠키가 생성된다. (Cookie: JSESSIONID=5B78E23B513F50164D6FDD8C97B0AD05)

<br/>

```java
// 상수 정의
public class SessionConst {
  public static final String LOGIN_MEMBER = "loginMember";
}

@PostMapping("/login")
public String loginV3(@Valid @ModelAttribute LoginForm form
  , BindingResult bindingResult, HttpServletRequest request) {
  ...
  // 로그인 성공 시, 세션이 있으면 있는 세션 반환, 없으면 신규 세션 생성.
  HttpSession session = request.getSession();
  //세션에 로그인 회원 정보 보관
  session.setAttribute(SessionConst.LOGIN_MEMBER, loginMember);
  return "redirect:/";
}
```
> request.getSession(true) <br/>
  - 세션이 있으면 기존 세션을 반환한다. <br/>
  - 세션이 없으면 새로운 세션을 생성해서 반환한다. <br/>
> request.getSession(false) <br/>
  - 세션이 있으면 기존 세션을 반환한다. <br/>
  - 세션이 없으면 새로운 세션을 생성하지 않는다. null 을 반환. <br/>
> request.getSession() : 신규 세션을 생성하는 request.getSession(true) 와 동일하다.

<br/>

```java
@PostMapping("/logout")
public String logoutV3(HttpServletRequest request) {
  //세션을 삭제한다.
  HttpSession session = request.getSession(false);
  if (session != null) {
    session.invalidate();
  }
  return "redirect:/";
}
```
> session.invalidate() : 세션을 제거한다.















