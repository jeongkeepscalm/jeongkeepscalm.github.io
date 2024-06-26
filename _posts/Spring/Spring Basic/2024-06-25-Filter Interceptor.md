---
title: "Filter & Interceptor"
description: "Filter & Interceptor"
date: 2024-06-25
categories: [Spring, Spring Basic]
tags: [Spring, Spring Basic]
---

# 공통 관심사(cross-cutting concern)

- 애플리케이션 여러 로직에서 공통으로 관심이 있는 것
- 로그인 한 사용자만 아이템 목록을 볼 수 있는 것은 등록, 수정, 삭제, 조회 등 여러 로직에서 공통으로 인증에 대하여 관심을 갖고 있다.  
- 스프링 AOP로도 해결 가능하지만, 웹과 관련된 공통 관심사는 `서블릿 필터` / `스프링 인터셉터`를 사용하는 것이 좋다. 
- HTTP 헤더나 URL 정보들을 바탕으로 공통 관심사 처리
  - 서블릿 필터 / 스프링 인터셉터는 HttpServletRequest를 제공

<br/>
<hr>

# 서블릿 필터

- 모든 고객의 요청 로그를 남기고 싶을 경우 필터를 사용한다. 
  
- 필터 흐름
  - HTTP 요청 → WAS → 필터 → 서블릿(디스패처 서블릿) → 컨트롤러
  - **필터에서 비로그인 사용자라 판단되면 서블릿을 호출하지 않는다.** 
  
- 필터 체인
  - HTTP 요청 → WAS → 필터1 → 필터2 → 필터3 → 서블릿 → 컨트롤러
  - e.g. 
    - 필터1: 로그 남기는 필터
    - 필터2: 로그인 여부 체크하는 필터 

<br/>
<hr>

# 서블릿 필터 인터페이스

***Filter Interface Code***

```java
public interface Filter {

  public default void init(FilterConfig filterConfig) throws ServletException{}

  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException;

  public default void destroy() {}
}
```
> `init()`: 필터 초기화 메서드, 서블릿 컨테이너가 생성될 때 호출  
> `doFilter()`: 고객의 요청이 올 때 마다 해당 메서드가 호출(필터 로직 구현)  
> `destroy()`: 필터 종료 메서드, 서블릿 컨테이너가 종료될 때 호출  

<br/>

***Log Filter***

```java
@Slf4j
public class LogFilter implements Filter {

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
    log.info("log filter init");
  }

  @Override
  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

    // ServletRequest → HttpServletRequest: 다운 캐스팅
    HttpServletRequest hsr = (HttpServletRequest) servletRequest;

    String requestURI = hsr.getRequestURI();
    String uuid = UUID.randomUUID().toString();

    try {
      log.info("request [{}] [{}]", uuid, requestURI);
      filterChain.doFilter(servletRequest, servletResponse);
    } catch (Exception e) {
      throw e;
    } finally {
      log.info("response [{}] [{}]", uuid, requestURI);
    }

  }

  @Override
  public void destroy() {
    log.info("log filter destroy");
  }
  
}
```
> Filter 인터페이스 구현  
> `chain.doFilter(request, response)`: 다음 필터 존재 시 호출. 필터가 없으면 서블릿을 호출한다. 이 로직이 없으면 다음 단계로 진행되지 않는다.  

<br/>

***Login Check Filter***

```java
@Slf4j
public class LoginCheckFilter implements Filter {

  private static final String[] whiteList = {"/", "/members/add", "/login", "/logout", "/css/*"};

  @Override
  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

    // 다운 캐스팅
    HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
    HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;

    String requestURI = httpRequest.getRequestURI();

    try {

      log.info("로그인 인증 체크 필터 시작: {}", requestURI);

      // whiteList 에 포함되어 있지 않다면, 세션에서 사용자 정보를
      if (is_not_contained_in_whiteList(requestURI)) {

        HttpSession session = httpRequest.getSession(false);

        if (session == null) {
          log.info("미인증 사용자 요청: {}", requestURI);

          // 로그인으로 이동(요청 URI 파라미터 값 추가)
          httpResponse.sendRedirect("/login?redirectURL=" + requestURI);
          return;
        }

      }

      filterChain.doFilter(servletRequest, servletResponse);

    } catch (Exception e) {
      throw e; // 예외 로깅 가능하지만, 톰캣까지 예외를 보내주어야 함
    } finally {
      log.info("인증 체크 필터 종료: {}", requestURI);
    }

  }

  /**
   * 화이트 리스트의 경우 인증 체크를 하지 않는다.
   */
  public boolean is_not_contained_in_whiteList(String requestURI) {
    return !PatternMatchUtils.simpleMatch(whiteList, requestURI);
  }

}
```

<br/>


***스프링 설정 정보 추가***

```java
@Configuration
public class WebConfiguration {

  @Bean
  public FilterRegistrationBean logFilter() {

    FilterRegistrationBean<Filter> frb = new FilterRegistrationBean<>();
    frb.setFilter(new LogFilter());
    frb.setOrder(1);
    frb.addUrlPatterns("/*");
    return frb;

    /**
     * frb.addUrlPatterns("/*");
     *    모든 요청에 해당 필터 적용
     */
  }

  @Bean
  public FilterRegistrationBean loginCheckFilter() {

    FilterRegistrationBean<Filter> frb = new FilterRegistrationBean<>();
    frb.setFilter(new LoginCheckFilter());
    frb.setOrder(2);
    frb.addUrlPatterns("/*");
    return frb;
    
  }

}
```
> `addUrlPatterns("/*")`: 모든 요청에 해당 필터 적용    

<br/>

- 참고사항
  - `@ServletComponentScan`, `@WebFilter(filterName = "logFilter" urlPatterns = "/*")`로 필터 등록이 가능하지만 필터 순서 조절이 안된다. 따라서 FilterRegistrationBean 을 사용하자.

<br/>

***Login Service Logic***

```java
@PostMapping("/login")
  public String LoginV4(
          @Validated @ModelAttribute("loginForm") LoginRequest loginRequest
          , BindingResult bindingResult
          , @RequestParam(defaultValue = "/") String redirectURL
          , HttpServletRequest request) {

    if (bindingResult.hasErrors()) {
      return "login/loginForm";
    }

    Member loginMember = loginService.login(loginRequest.getLoginId(), loginRequest.getPassword());
    log.info("login: {}", loginMember);

    if (loginMember == null) {
      bindingResult.reject("loginFail", "아이디 또는 비밀번호가 맞지 않습니다.");
      return "login/loginForm";
    }

    // 세션에 로그인 회원 정보 보관
    request.getSession().setAttribute(SessionConst.LOGIN_MEMBER, loginMember);

    return "redirect:" + redirectURL;
  }
```

<br/>
<hr>

# 스프링 인터셉터



