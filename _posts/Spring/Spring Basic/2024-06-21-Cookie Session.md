---
title: "Cookie & Session"
description: "Cookie & Session"
date: 2024-06-21
categories: [Spring, Spring Basic]
tags: [Spring, Spring Basic]
---

# 패키지 구조 설계

- package 구조
  - hello.login
    - domain
      - item
      - member
      - login
    - web
      - item
      - member
      - login
  
- `도메인`: UI, 기술 인프라 등의 영역은 제외한 시스템이 구현해야 하는 `핵심 비지니스 업무 영역`
- 향후 web을 다른 기술로 바꾸어도 도메인은 그대로 유지할 수 있어야 한다.(domain이 web에 의존하지 않게 설계) 

<br/>
<hr>

# 쿠키(Cookie)

- 로그인 성공 시 HTTP 응답에 쿠키를 담아 브라우저에 전달하면 브라우저는 앞으로 쿠키를 지속해서 보내준다.
- <img src="/assets/img/spring/cookie.png" width="600px" />
- <img src="/assets/img/spring/cookie2.png" width="600px" />
- **모든 요청에 쿠키 정보 자동 포함**
- <img src="/assets/img/spring/cookie3.png" width="600px" />

<br/>
<hr>

### 쿠키 종류

- 영속 쿠키: 만료 날짜를 입력하면 해당 날짜까지 유지
- 세션 쿠키: 만료 날짜를 생략하면 브라우저 종료시 까지만 유지

<br/>
<hr>

***로그인 성공 시 쿠키 추가***

```java
// add Cookie
Cookie loginIdCookie = new Cookie("memberId", String.valueOf(loginMember.getId()));
response.addCookie(loginIdCookie);
```

<br/>

***이미 로그인 된 사용자일 경우***

```java
@Slf4j
@Controller
@RequiredArgsConstructor
public class HomeController {

  private final MemberRepository memberRepository;

  // 로그인이 이미 된 사용자는 재로그인할 필요 없으므로 LoginHome.html 으로 보낸다.
  @GetMapping("/")
  public String homeLogin(@CookieValue(name = "memberId", required = false) Long memberId, Model model) {

    // 쿠키가 없다면 로그인 해야되는 페이지로 보낸다.
    if (memberId == null) {
      return "home";
    }

    // 멤버가 아니라면 로그인 해야되는 페이지로 보낸다.
    Member loginMember = memberRepository.findById(memberId);
    if (loginMember == null) {
      return "home";
    }

    model.addAttribute("member", loginMember);
    return "loginHome";

  }

}
```

<br/>

***로그아웃***

```java
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

<br/>
<hr>

# 쿠키 보안 문제

- 보안 문제
  - 쿠키 값은 임의로 변경 가능
  - 쿠키에 보관된 정보는 훔쳐갈 수 있다.
  
- 대안
  - 쿠키에 중요한 값을 노출하지 않고, 예측 불가능한 임의의 토큰을 노출하여, 서버에서 토큰과 사용자 ID를 매핑해서 인식한다. 해당 토큰은 서버에서 관리한다. 
  - 토큰은 임의의 값을 넣어도 찾을 수 없도록 예상 불가능 해야 한다. 
  - 토큰 정보가 탈취될 경우를 대비하여 토큰의 만료시간을 짧게 유지한다.

<br/>
<hr>

# 세션

1. 로그인 성공
2. 세션 저장소
  - sessionId: UUID
  - value: user = {id: test, password: test1234}
3. sessionId를 쿠키로 전달










