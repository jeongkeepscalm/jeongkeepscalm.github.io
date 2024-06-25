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

<br/>
<hr>

***session manager code***

```java
@Component
public class SessionManager {

  public static final String SESSION_COOKIE_NAME = "mySessionId";
  private Map<String, Object> sessionStore = new ConcurrentHashMap<>();

  /**
   * 세션 생성
   */
  public void createSession(Object value, HttpServletResponse response) {
    String sessionId = UUID.randomUUID().toString();
    sessionStore.put(sessionId, value);

    Cookie cookie = new Cookie(SESSION_COOKIE_NAME, sessionId);
    response.addCookie(cookie);
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

  public Cookie findCookie(HttpServletRequest request, String cookieName) {
    Cookie[] cookies = request.getCookies();
    if (cookies == null) {
      return null;
    }
    return Arrays.stream(cookies)
            .filter(v -> v.getName().equals(cookieName))
            .findAny()
            .orElse(null);
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

}
```

<br/?

***session manager test***

```java
public class SessionManagerTest {

  SessionManager sessionManager = new SessionManager();

  @Test
  void sessionTest() {

    // 세션 생성
    MockHttpServletResponse response = new MockHttpServletResponse();
    Member member = new Member();
    sessionManager.createSession(member, response);

    // 요청에 응답 쿠키 저장
    MockHttpServletRequest request = new MockHttpServletRequest();
    request.setCookies(response.getCookies());

    // 세션 조회
    Object result = sessionManager.getSession(request);
    Assertions.assertThat(result).isEqualTo(member);

    // 세션 만료
    sessionManager.expire(request);
    Object expiredSession = sessionManager.getSession(request);
    Assertions.assertThat(expiredSession).isNull();
  }

}
```

<br/>

***LoginController code changed***

```java
@PostMapping("/login")
public String loginV2(@Validated @ModelAttribute LoginRequest request
        , BindingResult bindingResult
        , HttpServletResponse response) {

  // 오류 확인
  if (bindingResult.hasErrors()) {
    return "login/loginForm";
  }

  // 유저 조회
  Member loginMember = loginService.login(request.getLoginId(), request.getPassword());
  log.info("login member = {}", loginMember);

  // 실제 유저 검증
  if (loginMember == null) {
    bindingResult.reject("loginFail", "아이디 또는 비밀번호가 맞지 않습니다.");
    return "login/loginForm";
  }

  // 세션저장소에 유저 추가 및 쿠키 추가
  sessionManager.createSession(loginMember, response);
  return "redirect:/";

}

@PostMapping("/logout")
public String logoutV2(HttpServletRequest request) {
  sessionManager.expire(request);
  return "redirect:/";
}
```

<br/>

***HomeController code changed***

```java
// "/" url 접근시 세션 체크
@GetMapping("/")
public String homeLoginV2(HttpServletRequest request, Model model) {
  Member loginMember = (Member) sessionManager.getSession(request);
  if (loginMember == null) {
    return "home";
  }
  model.addAttribute("member", loginMember);
  return "loginHome";
}
```

<br/>
<hr>

# HttpSession

- HttpSession 생성 시 JSESSIONID 쿠키 생성
- e.g. Cookie: JSESSIONID=5B78E23B513F50164D6FDD8C97B0AD05


***HttpSession code in LoginController***

```java
@PostMapping("/login")
public String LoginV3(@Validated @ModelAttribute(name = "loginForm") LoginRequest loginRequest
        , BindingResult bindingResult
        , HttpServletRequest request) {

  // 오류 확인
  if (bindingResult.hasErrors()) {
    return "login/loginForm";
  }

  // 유저 조회
  Member loginMember = loginService.login(loginRequest.getLoginId(), loginRequest.getPassword());
  log.info("login member = {}", loginMember);

  // 실제 유저 검증
  if (loginMember == null) {
    bindingResult.reject("loginFail", "아이디 또는 비밀번호가 맞지 않습니다.");
    return "login/loginForm";
  }

  // 세션이 있으면 세션 반환, 없으면 세션 생성
  HttpSession session = request.getSession();

  // 세션에 로그인 회원 정보 보관
  session.setAttribute(SessionConst.LOGIN_MEMBER, loginMember);

  return "redirect:/";

}

@PostMapping("/logout")
public String logoutV3(HttpServletRequest request) {
  HttpSession session = request.getSession(false);
  if (session != null) {
    // 세션 제거
    session.invalidate();
  }
  return "redirect:/";
}
```
> request.getSession(true) == request.getSession()  
>     세션이 존재하면 기존 세션 반환  
>     없다면, 새로운 세션 생성 후 반환  
>   
> request.getSession(false)  
>     세션이 존재하면 기존 세션 반환  
>     없다면, 새로운 세션 생성 x. null 반환  

<br/>

***HttpSession code in HomeController***

```java 
@GetMapping("/")
public String homeLoginV3(HttpServletRequest request, Model model) {

  // 세션이 없을 경우
  HttpSession session = request.getSession();
  if (session == null) {
    return "home";
  }

  // 세션에 회원 정보가 없을 경우
  Member loginMember = (Member) session.getAttribute(SessionConst.LOGIN_MEMBER);
  if (loginMember == null) {
    return "home";
  }

  // 세션이 유지되면 로그인으로 이동
  model.addAttribute("member", loginMember);
  return "loginHome";

}
```

<br/>
<hr>

# @SessionAttribute 활용

- @SessionAttribute
  - 세션을 찾고, 세션에 들어있는 데이터를 찾는 번거로움을 한 번에 처리해준다. 

***HomeController code changed***

```java
@GetMapping("/")
public String homeLoginV4(@SessionAttribute(name = SessionConst.LOGIN_MEMBER, required = false) Member loginMember
        , Model model) {

  // 세션에 회원 정보가 없을 경우
  if (loginMember == null) {
    return "home";
  }

  // 세션이 유지되면 로그인 이동
  model.addAttribute("member", loginMember);
  return "loginHome";

}
```

<br/>
<hr>

# 세션 정보와 타임아웃 설정

```java 
@GetMapping("/session-info")
public String sessionInfo(HttpServletRequest request) {

  HttpSession session = request.getSession(false);
  if (session == null) {
    return "세션이 없습니다. ";
  }

  session.getAttributeNames()
          .asIterator()
          .forEachRemaining(name -> log.info("session name = {}, value = {}", name, session.getAttribute(name)));
  // session name = loginMember, value = Member(id=1, loginId=test, name=tester, password=test123)

  log.info("sessionId = {}", session.getId());
  log.info("maxInactiveInterval = {}", session.getMaxInactiveInterval());
  log.info("creation time = {}", new Date(session.getCreationTime()));
  log.info("lastAccessedTime = {}", new Date(session.getLastAccessedTime()));
  log.info("isNew = {}", session.isNew());

  /*
    sessionId = B98D33180535717ACE4525C5756F84A3
    maxInactiveInterval = 1800
    creation time = Tue Jun 25 13:57:51 KST 2024
    lastAccessedTime = Tue Jun 25 13:57:52 KST 2024
    isNew = false
  */

  return "print session";

}
```










