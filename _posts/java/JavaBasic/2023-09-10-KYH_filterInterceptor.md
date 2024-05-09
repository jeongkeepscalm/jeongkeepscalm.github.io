---
title: "[KYH] Filter Interceptor"
description: Filter Interceptor
date: 2023-09-10
categories: [ Java, Java Basic ]
tags: [ Java, Java Basic, KYH, Filter, Interceptor ]
---

## 필터 ( filter )

- 필터 흐름  
  - 로그인 사용자  
  - HTTP 요청 -> WAS -> 필터 -> 서블릿(디스패처 서블릿) -> 컨트롤러  
  
- 필터 제한  
  - 비 로그인 사용자  
  - HTTP 요청 -> WAS -> 필터 (적절하지 않은 요청이라 판단되면 서블릿을 호출하지 않는다.)  
  
- 필터체인  
  - HTTP 요청 -> WAS -> 필터1 -> 필터2 -> 필터3 -> 서블릿 -> 컨트롤러  
  - 예) 로그를 남기는 필터, 로그인 여부 체크하는 필터 등..  

<br/>

```java
// 필터 인터페이스
public interface Filter {

  public default void init(FilterConfig filterConfig) throws ServletException {}

  public void doFilter(
    ServletRequest request
    , ServletResponse response
    , FilterChain chain) throws IOException, ServletException;

  public default void destroy() {}
}
```
> init() : 필터 초기화 메서드, 서블릿 컨테이너가 생성될 때 호출된다.  
> doFilter() : 고객의 요청이 올 때 마다 해당 메서드가 호출된다. 필터의 로직을 구현하면 된다.  
> destroy() : 필터 종료 메서드, 서블릿 컨테이너가 종료될 때 호출된다.  

<br/>

```java
@Slf4j
public class LogFilter implements Filter {

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
    log.info("log filter init");
  }

  @Override
  public void doFilter(
      ServletRequest request
      , ServletResponse response
      , FilterChain chain) throws IOException, ServletException {

    HttpServletRequest httpRequest = (HttpServletRequest) request;
    String requestURI = httpRequest.getRequestURI();
    String uuid = UUID.randomUUID().toString();

    try {
      log.info("REQUEST [{}][{}]", uuid, requestURI);
      chain.doFilter(request, response);
    } catch (Exception e) {
      throw e;
    } finally {
      log.info("RESPONSE [{}][{}]", uuid, requestURI);
    }

  }

  @Override
  public void destroy() {
    log.info("log filter destroy");
  }
}
```
> 필터 인터페이스를 구현해서 사용한다.  
> HTTP 요청이 오면 doFilter 가 호출된다. ServletRequest request 는 HTTP 요청이 아닌 경우까지 고려해서 만든 인터페이스이다. HTTP를 사용하면 HttpServletRequest httpRequest = (HttpServletRequest) request; 와 같이 다운 캐스팅 하면 된다.  
> - String uuid = UUID.randomUUID().toString(); : HTTP 요청을 구분하기 위해 요청당 임의의 uuid 를 생성해둔다.  
> - **chain.doFilter(request, response);** : 다음 필터가 있으면 필터를 호출하고, 필터가 없으면 서블릿을 호출한다. 만약 이 로직을 호출하지 않으면 다음 단계로 진행되지 않는다.  

<br/>

```java
@Configuration
public class WebConfig {

  @Bean
  public FilterRegistrationBean logFilter() {
    FilterRegistrationBean<Filter> filterRegistrationBean 
      = new FilterRegistrationBean<>();
    filterRegistrationBean.setFilter(new LogFilter());
    filterRegistrationBean.setOrder(1);
    filterRegistrationBean.addUrlPatterns("/*");
    return filterRegistrationBean;
  }

  @Bean
  public FilterRegistrationBean loginCheckFilter() {
    FilterRegistrationBean<Filter> filterRegistrationBean 
    = new FilterRegistrationBean<>();
    filterRegistrationBean.setFilter(new LoginCheckFilter());
    filterRegistrationBean.setOrder(2);
    filterRegistrationBean.addUrlPatterns("/*");
    return filterRegistrationBean;
  }

}
```
> 필터를 등록하는 방법은 여러가지가 있지만, 스프링 부트를 사용한다면 FilterRegistrationBean 을
사용해서 등록하면 된다.  
> setFilter(new LogFilter()): 등록할 필터를 지정한다. LogFilter 파일은 Filter 를 상속받아 구현한 파일이다.  
> setOrder(1): 필터는 체인으로 동작한다. 따라서 순서가 필요하다. 낮을 수록 먼저 동작한다.  
> addUrlPatterns("/*"): 필터를 적용할 URL 패턴을 지정한다. 한번에 여러 패턴을 지정할 수 있다.  

- @ServletComponentScan, @WebFilter(filterName = "logFilter", urlPatterns = "/*") 로
필터 등록이 가능하지만 필터 순서 조절이 안된다. 따라서 FilterRegistrationBean 을 사용하자.  

<br/>

```java
@Slf4j
public class LoginCheckFilter implements Filter {

  /**
   * 인증 필터를 적용해도 홈, 회원가입, 로그인 화면, css 같은 리소스에는 접근할 수 있어야 한다.
   * 이렇게 화이트 리스트 경로는 인증과 무관하게 항상 허용한다.
   * 화이트 리스트를 제외한 나머지 모든 경로에는 인증 체크 로직을 적용한다.
   **/
  private static final String[] whiteList = {
        "/"
        , "/members/add"
        , "/login"
        , "/logout"
        , "/css/*"
  };

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
    Filter.super.init(filterConfig);
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    String requestURI = httpRequest.getRequestURI();

    HttpServletResponse httpResponse = (HttpServletResponse) response;

    try {
        log.info("인증 체크 필터 시작 {}", requestURI);

        // whiteList 에 등록되어 있지 않은 uri 일 경우 실행되고,
        if (isLoginCheckPath(requestURI)) {
            log.info("인증 체크 로직 실행 {}", requestURI);
            HttpSession session = httpRequest.getSession(false);
            if (session == null || session.getAttribute(SessionConst.LOGIN_MEMBER) == null) {
                log.info("미인증 사용자 요청 {} : ", requestURI);
                // 로그인으로 redirect
                httpResponse.sendRedirect("/login?redirectURL=" + requestURI);
                return; // 미인증 사용자는 다음으로 진행하지 않고 끝.
            }
        }
        chain.doFilter(request, response);
    } catch (Exception e) {
        throw e; // 예외 로깅 가능 하지만, 톰캣까지 예외를 보내주어야 함.
    } finally {
        log.info("인증 체크 필터 종료 {}", requestURI);
    }

    /**
     * httpResponse.sendRedirect("/login?redirectURL=" + requestURI);
     *      미인증 사용자는 로그인 화면으로 리다이렉트 한다.
     *      그런데 로그인 이후에 다시 홈으로 이동해버리면, 원하는 경로를 다시 찾아가야 하는 불편함이 있다.
     *      예를 들어서 상품 관리 화면을 보려고 들어갔다가 로그인 화면으로 이동하면,
     *      로그인 이후에 다시 상품 관리 화면으로 들어가는 것이 좋다.
     **/

  }

  /**
   * 화이트 리스트의 경우 인증 체크 하지않는다.
   **/
  private boolean isLoginCheckPath(String requestURI) {
    return !PatternMatchUtils.simpleMatch(whiteList, requestURI);
  }

  @Override
  public void destroy() {
    Filter.super.destroy();
  }

}
```

<br/>

```java
// 로그인 이후 redirect 처리
@PostMapping("/login")
  public String loginV4(
    @Valid @ModelAttribute LoginForm form, BindingResult bindingResult,
    @RequestParam(defaultValue = "/") String redirectURL,
    HttpServletRequest request) {

    if (bindingResult.hasErrors()) {
      return "login/loginForm";
    }

    Member loginMember = loginService.login(form.getLoginId(), form.getPassword());
    log.info("login? {}", loginMember);

    if (loginMember == null) {
      bindingResult.reject("loginFail", "아이디 또는 비밀번호가 맞지 않습니다.");
      return "login/loginForm";
    }

    //로그인 성공 처리
    //세션이 있으면 있는 세션 반환, 없으면 신규 세션 생성
    HttpSession session = request.getSession();
    //세션에 로그인 회원 정보 보관
    session.setAttribute(SessionConst.LOGIN_MEMBER, loginMember);

    //redirectURL 적용
    return "redirect:" + redirectURL;

  }
```

<br/>

## 인터셉터 ( Interceptor )

- 서블릿 필터는 서블릿에서 제공하는 기술이라면 **스프링 인터셉터는 스프링 mvc가 제공하는 기술이다.**  
- 스프링 인터셉터 흐름  
  - HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 스프링 인터셉터 -> 컨트롤러  
  - 디스패처 서블릿과 컨트롤러 사이에서 컨트롤러 호출 직전에 호출 된다. 스프링 인터셉터는 스프링 MVC가 제공하는 기능이기 때문에 결국 디스패처 서블릿 이후에 등장하게 된다. **스프링 MVC의 시작점이 디스패처 서블릿이다.**  
  
- 스프링 인터셉터 제한  
  - HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 스프링 인터셉터 -> 컨트롤러 // 로그인 사용자  
  - HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 스프링 인터셉터(적절하지 않은 요청이라 판단, 컨트롤러 호출 X) // 비 로그인 사용자  

- 스프링 인터셉터 체인  
  - HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 인터셉터1 -> 인터셉터2 -> 컨트롤러  
  
```java
// 스프링의 인터셉터를 사용하려면 HandlerInterceptor 인터페이스를 구현하면 된다.
public interface HandlerInterceptor {

  default boolean preHandle(
    HttpServletRequest request
    , HttpServletResponse response
    , Object handler) throws Exception {}

  default void postHandle(
    HttpServletRequest request
    , HttpServletResponse response
    , Object handler
    , @Nullable ModelAndView modelAndView)
  throws Exception {}

  default void afterCompletion(
    HttpServletRequest request
    , HttpServletResponse response
    , Object handler
    , @Nullable Exception ex) throws
  Exception {}
}
```
> 서블릿 필터의 경우 단순하게 doFilter() 하나만 제공되지만, 인터셉터는 컨트롤러 호출 전 (preHandle), 호출 후 (postHandle), 요청 완료 이후 (afterCompletion) 와 같이 단계적으로 세분화 되어 있다.  
> 서블릿 필터의 경우 단순히 request , response 만 제공했지만, 인터셉터는 어떤 컨트롤러( handler )가
호출되는지 호출 정보도 받을 수 있다. 그리고 어떤 modelAndView 가 반환되는지 응답 정보도 받을 수
있다.  

<br/>

<img src="/assets/img/interceptor.png" width="600px" />  
- preHandle : 컨트롤러 호출 전에 호출된다. (더 정확히는 핸들러 어댑터 호출 전에 호출된다.)  
  - preHandle 의 응답값이 true 이면 다음으로 진행하고, false 이면 더는 진행하지 않는다. false인 경우 나머지 인터셉터는 물론이고, 핸들러 어댑터도 호출되지 않는다. 그림에서 1번에서 끝이 나버린다.  
- postHandle : 컨트롤러 호출 후에 호출된다. (더 정확히는 핸들러 어댑터 호출 후에 호출된다.)  
- afterCompletion : 뷰가 렌더링 된 이후에 호출된다.  
- 예외 발생 시  
  - postHandle : 컨트롤러에서 예외가 발생하면 postHandle 은 호출되지 않는다.  
  - afterCompletion 은 항상 호출된다. 이 경우 예외( ex )를 파라미터로 받아서 어떤 예외가 발생했는지 로그로 출력할 수 있다.  
  - 예외가 발생하면 postHandle() 는 호출되지 않으므로 예외와 무관하게 공통 처리를 하려면 afterCompletion() 을 사용해야 한다.  

<br/>

- 인터셉터는 스프링 MVC 구조에 특화된 필터 기능을 제공한다고 이해하면 된다. 스프링 MVC를 사용하고,
특별히 필터를 꼭 사용해야 하는 상황이 아니라면 인터셉터를 사용하는 것이 더 편리하다.  

```java
// LogInterceptor
@Slf4j
public class LogInterceptor implements HandlerInterceptor {

  public static final String LOG_ID = "logId";

  @Override
  public boolean preHandle(
    HttpServletRequest request
    , HttpServletResponse response
    , Object handler) throws Exception {

    String requestURI = request.getRequestURI();
    String uuid = UUID.randomUUID().toString();

    request.setAttribute(LOG_ID, uuid);

    // @RequestMapping : HandlerMethod
    // 정적 리소스 : ResourceHttpRequestHandler
    if (handler instanceof HandlerMethod) {
      HandlerMethod hm = (HandlerMethod) handler; // 호출할 컨트롤러 메서드의 모든 정보가 포함되어 있다.
    }
    log.info("REQUEST [{}][{}][{}]", uuid, requestURI, handler);
    return true; // false 일 경우 진행되지 않는다.
  }
  
  @Override
  public void postHandle(
    HttpServletRequest request
    , HttpServletResponse response
    , Object handler
    , ModelAndView modelAndView) throws Exception {

    log.info("postHandle [{}]", modelAndView);

  }

  @Override
  public void afterCompletion(
    HttpServletRequest request
    , HttpServletResponse response
    , Object handler
    , Exception ex) throws Exception {

    String requestURI = request.getRequestURI();
    String logId = (String)request.getAttribute(LOG_ID);

    log.info("RESPONSE [{}][{}]", logId, requestURI);

    if (ex != null) {
      log.error("afterCompletion error!!", ex);
    }

  }
}
```
> request.setAttribute(LOG_ID, uuid) - 서블릿 필터의 경우 지역변수로 해결이 가능하지만, 스프링 인터셉터는 호출 시점이 완전히 분리되어 있다. 따라서 preHandle 에서 지정한 값을 postHandle , afterCompletion 에서 함께 사용하려면 어딘가에 담아두어야 한다. LogInterceptor 도 싱글톤 처럼 사용되기 때문에 맴버변수를 사용하면 위험하다. 따라서 request 에 담아두었다. 이 값은 afterCompletion 에서 request.getAttribute(LOG_ID) 로 찾아서 사용한다.  
> ResourceHttpRequestHandler - @Controller 가 아니라 /resources/static 와 같은 정적 리소스가 호출 되는 경우 ResourceHttpRequestHandler 가 핸들러 정보로 넘어오기 때문에 타입에 따라서 처리가 필요하다.  

<br/>

```java
@Slf4j
public class LoginCheckInterceptor implements HandlerInterceptor {
  @Override
  public boolean preHandle(
    HttpServletRequest request
  , HttpServletResponse response
  , Object handler) throws Exception {

    String requestURI = request.getRequestURI();
    log.info("인증 체크 인터셉터 실행 {}", requestURI);

    HttpSession session = request.getSession(false);

    if (session == null || session.getAttribute(SessionConst.LOGIN_MEMBER) == null) {
      log.info("미인증 사용자 요청");
      //로그인으로 redirect
      response.sendRedirect("/login?redirectURL=" + requestURI);
      return false;
    }
    
    return true;
  }
}
```
> 인증이라는 것은 컨트롤러 호출 전에만 호출되면 되기에 preHandle 만 구현하면 된다.  

```java
// 인터셉터 등록
@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addInterceptors(InterceptorRegistry registry) {

    registry.addInterceptor(new LogInterceptor()) // 인터셉터를 등록한다. 
      .order(1) // 인터셉터 호출 순서를 지정한다. 낮을수록 먼저 호출된다. 
      .addPathPatterns("/**") // 인터셉터를 적용할 url 패턴을 지정한다. 
      .excludePathPatterns("/css/**", "/*.ico", "/error"); // 인터셉터에서 제외할 패턴을 지정한다. 

    registry.addInterceptor(new LoginCheckInterceptor())
      .order(2)
      .addPathPatterns("/**")
      .excludePathPatterns(
        "/", "/members/add", "/login", "/logout"
        , "/css/**", "/*.ico", "/error"
    );
  }
}
```
> WebMvcConfigurer 가 제공하는 addInterceptors() 를 사용해서 인터셉터를 등록할 수 있다.  
