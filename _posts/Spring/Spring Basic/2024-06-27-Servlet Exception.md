---
title: "Servlet Exception"
description: "Servlet Exception"
date: 2024-06-27
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

# 서블릿 예외 처리

- 스프링이 아닌 순수 서블릿 컨테이너는 다음 2가지 방식으로 예외처리를 한다.
1. `Exception(예외)`
2. `response.sendError(HTTP 상태 코드, 오류 메시지)`

<br/>
<hr>

## 1. Exception(예외)

- 자바 직접 실행
  - 자바 main() 메소드 실행 → 이름이 main 인 쓰레드 실행
  - 실행 도중 예외를 잡지 못하고 처음 실행한 main() 메소드를 넘어서 예외가 던져지면 예외 정보를 남기고 해당 쓰레드는 종료
  
- 웹 애플리케이션
  - 사용자 요청 별로 쓰레드가 할당되고, 서블릿 컨테이너 안에서 실행된다. 
  - 애플리케이션에서 예외 발생 시, try ~ catch로 예외를 잡아 처리하면 아무 문제가 없지만, 예외를 잡지 못하고 서블릿 밖으로 예외가 전달되면 WAS까지 예외가 전달된다. 
  - WAS ← 필터 ← 서블릿 ← 인터셉터 ← 컨트롤러(예외 발생)

<br/>

# 2. response.sendError(HTTP 상태코드, 오류 메시지)

- sendError()를 호출한다고 하여 당장 예외가 발생하는 것은 아니지만, 서블릿 컨테이너에게 오류가 발생했다는 점을 전달할 수 있다.  
- WAS(sendError 호출 기록 확인) ← 필터 ← 서블릿 ← 인터셉터 ← 컨트롤러
(response.sendError())
- response.sendError() 호출 → response 내부에 오류 발생했다는 상태 저장
→ 서블릿 컨테이너가 클라이언트 응답 전 resposne에 sendError() 호출 확인 → 호출 되었다면 설정한 오류 코드에 맞게 오류 페이지 보여줌

<br/>

***Servlet Exception Code***

```java
@Controller
public class ServletExController {

  // 1. Exception 객체
  @GetMapping("/error-ex")
  public void error() {
    throw new RuntimeException("예외 발생");
  }

  // 2. response.sendError(): 설정한 오류 메시지가 콘솔에 별도로 출려되지 않는다.
  @GetMapping("/error-404")
  public void error404(HttpServletResponse response) throws IOException {
    response.sendError(404, "404 error occurred");
  }
  @GetMapping("/error-500")
  public void error500(HttpServletResponse response) throws IOException {
    response.sendError(500, "500 error occurred");
  }

}
```

- 서블릿 컨테이너가 제공하는 기본 예외 처리 화면
  - <img src="/assets/img/spring/basicExceptionPage.png" width="600px" />
  - 고객 친화적이지 않다. 

<br/>

***과거 오류 화면 등록 방식***

```xml
<web-app>
  <error-page>
  <error-code>404</error-code>
  <location>/error-page/404.html</location>
  </error-page>
  <error-page>
  <error-code>500</error-code>
  <location>/error-page/500.html</location>
  </error-page>
  <error-page>
  <exception-type>java.lang.RuntimeException</exception-type>
  <location>/error-page/500.html</location>
  </error-page>
</web-app>
```

<br/>

***스프링 부트가 제공하는 기능을 사용하여 서블릿 오류 페이지 등록***

```java
@Component
public class WebServerCustomizer implements WebServerFactoryCustomizer<ConfigurableWebServerFactory> {

  @Override
  public void customize(ConfigurableWebServerFactory factory) {
    ErrorPage errorPage404 = new ErrorPage(HttpStatus.NOT_FOUND, "/error-page/404");
    ErrorPage errorPage500 = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/error-page/500");
    ErrorPage errorPageEx = new ErrorPage(RuntimeException.class, "/error-page/500");
    factory.addErrorPages(errorPage404, errorPage500, errorPageEx);
  }
  
}
```

<br/>

***오류 페이지 등록 url을 컨트롤러와 매핑시킨다.***

```java
@Slf4j
@Controller
public class ErrorPageController {

  @GetMapping("/error-page/404")
  public String errorPage404(HttpServletRequest request, HttpServletResponse response) {
    log.info("error page 404");
    return "error-page/404";
  }

  @GetMapping("/error-page/500")
  public String errorPage500(HttpServletRequest request, HttpServletResponse response) {
    log.info("error page 500");
    return "error-page/500";
  }

}
```

<br/>
<hr>

# 서블릿 예외 처리 - 오류 페이지 작동 원리

- 에러가 WAS 도달 → 해당 예외를 처리하는 오류 페이지 정보 확인 → 오류 페이지가 설정되어 있다면 다시 요청
  - e.g. new ErrorPage(RuntimeException.class, "/error-page/500")
  - WAS `/error-page/500` 다시 요청 → 필터 → 서블릿 → 인터셉터 → 컨트롤러(/error-page/500) → View

<br/>
<hr>

# 오류 정보 추가

- WAS: 오류 페이지 재요청 + 오류 정보 추가(request 활용)

<br/>

***reqeust 속성 확인***

```java
@Slf4j
@Controller
public class ErrorPageController {

  // RequestDispatcher 상수로 정의되어 있음
  public static final String ERROR_EXCEPTION = "jakarta.servlet.error.exception";
  public static final String ERROR_EXCEPTION_TYPE = "jakarta.servlet.error.exception_type";
  public static final String ERROR_MESSAGE = "jakarta.servlet.error.message";
  public static final String ERROR_REQUEST_URI = "jakarta.servlet.error.request_uri";
  public static final String ERROR_SERVLET_NAME = "jakarta.servlet.error.servlet_name";
  public static final String ERROR_STATUS_CODE = "jakarta.servlet.error.status_code";

  @GetMapping("/error-page/404")
  public String errorPage404(HttpServletRequest request, HttpServletResponse response) {
    log.info(":: error page 404");
    printErrorInfo(request);
    return "error-page/404";
  }

  @GetMapping("/error-page/500")
  public String errorPage500(HttpServletRequest request, HttpServletResponse response) {
    log.info(":: error page 500");
    printErrorInfo(request);
    return "error-page/500";
  }

  private void printErrorInfo(HttpServletRequest request) {
    Object errorException = request.getAttribute(ERROR_EXCEPTION);
    Object errorException_type = request.getAttribute(ERROR_EXCEPTION_TYPE);
    Object error_message = request.getAttribute(ERROR_MESSAGE);
    Object error_request_uri = request.getAttribute(ERROR_REQUEST_URI);
    Object error_servlet_name = request.getAttribute(ERROR_SERVLET_NAME);
    Object error_status_code = request.getAttribute(ERROR_STATUS_CODE);

    DispatcherType dispatcherType = request.getDispatcherType();

    log.info("errorException: {}", errorException);
    log.info("errorException_type: {}", errorException_type);
    log.info("error_message: {}", error_message);
    log.info("error_request_uri: {}", error_request_uri);
    log.info("error_servlet_name: {}", error_servlet_name);
    log.info("error_status_code: {}", error_status_code);
    log.info("dispatcherType: {}", dispatcherType);

    // 상수 변경: javax → jakarta
    // request.getAttributeNames().asIterator().forEachRemaining(v -> log.info(v));

  }

}
```
> errorException: null  
> errorException_type: null  
> error_message: 404 error occurred  
> error_request_uri: /error-404  
> error_servlet_name: dispatcherServlet  
> error_status_code: 404  
> dispatcherType: ERROR  
> 
> errorException_type: class java.lang.RuntimeException  
> error_message: Request processing failed: java.lang.RuntimeException: 예외 발생  
> error_request_uri: /error-ex  
> error_servlet_name: dispatcherServlet  
> error_status_code: 500  
> dispatcherType: ERROR  

<br/>

- 예외 발생 후 WAS 가 오류 페이지를 재호출 할 때, 필터 & 인터페이스를 한 번더 호출 되는 과정은 비효율적이다. 
- `DispatcherType`
  - 클라이언트로부터 발생한 요청인지, 오류 페이지 출력을 위한 요청인지 구분해주는 속성.
  - e.g. 클라이언트의 요청 <code>dispatcherType=REQUEST</code>
  - e.g. 오류 페이지 요청 <code>dispatcherType=ERROR</code>

<br/>

***Log Filter Code(+ dispatcherType)***

```java
@Slf4j
public class LogFilter implements Filter {

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
    log.info("log filter init");
  }

  @Override
  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
    HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
    String requestURI = httpServletRequest.getRequestURI();
    String uuid = UUID.randomUUID().toString();

    try {
      log.info("request [{}], [{}], [{}]: ", uuid, httpServletRequest.getDispatcherType(), requestURI);
      filterChain.doFilter(servletRequest, servletResponse);
    } catch (Exception e) {
      throw e;
    } finally {
      log.info("response [{}], [{}], [{}] ", uuid, httpServletRequest.getDispatcherType(), requestURI);
    }
  }

  @Override
  public void destroy() {
    log.info("log filter destroy");
  }
}
```

<br/>

***Dispatcher Type Enum***

```java
public enum DispatcherType { FORWARD, INCLUDE, REQUEST, ASYNC, ERROR }
```

<br/>

***로그 필터 설정***

```java 
@Configuration
public class WebConfiguration {

  @Bean
  public FilterRegistrationBean logFilter() {
    FilterRegistrationBean<Filter> frb = new FilterRegistrationBean<>();
    frb.setFilter(new LogFilter());
    frb.setOrder(1);
    frb.addUrlPatterns("/*");

    /**
     * 기본값: frb.setDispatcherTypes(DispatcherType.REQUEST);
     */
    // 에러 요청에 대한 로그도 남기고 싶을 경우
    frb.setDispatcherTypes(DispatcherType.REQUEST, DispatcherType.ERROR);

    // 에러 요청만 로그로 남기고 싶을 경우
    // frb.setDispatcherTypes(DispatcherType.ERROR);
    return frb;

  }

}
```

<br/>

***Log Interceptor***

```java
@Slf4j
public class LogInterceptor implements HandlerInterceptor {
  public static final String LOG_ID = "logId";

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    String requestURI = request.getRequestURI();
    String uuid = UUID.randomUUID().toString();
    request.setAttribute(LOG_ID, uuid);
    log.info("REQUEST [{}][{}][{}][{}]", uuid, request.getDispatcherType(), requestURI, handler);
    return true;
  }

  @Override
  public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    log.info("postHandle [{}]", modelAndView);
  }

  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    String requestURI = request.getRequestURI();
    String logId = (String) request.getAttribute(LOG_ID);
    log.info("RESPONSE [{}][{}][{}]", logId, request.getDispatcherType(), requestURI);
    if (ex != null) {
      log.error("afterCompletion error!!", ex);
    }
  }
}
```

<br/>

```java
@Configuration
public class WebConfiguration implements WebMvcConfigurer {

  ...

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new LogInterceptor())
            .order(1)
            .addPathPatterns("/**")
            .excludePathPatterns(
                    "/css/**", "/*.ico"
                    , "/error", "/error-page/**"
            );
    // excludePathPatterns 에 속한 주소를 제외한 나머지 주소에 로그가 찍힌다.  
  }
}
```
> <code>"/error", "/error-page/**</code>   
> 인터셉터 제외 경로로 설정했으므로, WAS에서 오류페이지 재요청시 해당 인터셉터를 호출하지 않는다.  

<br/>
<hr>

# 정리

- 스프링 부트 이전 예외 페이지 호출 방식  
  1. WebServerFactoryCustomizer 인터페이스 구현(customize() 메소드 오버라이딩)  
  2. ErrorPage 추가  
  3. ErrorPageController 에 설정된 url 매핑  

<br/>
<hr>

# 스프링 부트 오류 페이지 제공

- `/error`: 기본 오류 페이지 자동 설정
  - new ErrorPage("/error") , 상태코드와 예외를 설정하지 않으면 기본 오류 페이지로 사용
  - 서블릿 밖 예외발생 및 response.sendError() 호출 시 모든 오류는 /error를 호출
- `BasicErrorController`: 자동으로 등록 및 구현된 스프링 컨트롤러
  - ErrorMvcAutoConfiguration 클래스가 오류 페이지를 자동으로 등록한다. 

<br/>

- BasicErrorController View 선택 우선순위
  1. 뷰 템플릿
    - resources/templates/error/500.html
    - resources/templates/error/5xx.html
  2. 정적 리소스( static , public )
    - resources/static/error/400.html
    - resources/static/error/404.html
    - resources/static/error/4xx.html
  3. 적용 대상이 없을 때 뷰 이름( error )
    - resources/templates/error.html
- 해당 경로 위치에 HTTP 상태 코드 이름의 뷰 파일을 넣어두면 된다.

<br/>
<hr>

# BasicErrorController 오류 컨트롤러에서 오류 정보 포함 여부

- 기본값
  - <code>server.error.include-exception=false</cdoe>: exception 포함 여부( true , false )
  - <code>server.error.include-message=never</cdoe>: message 포함 여부
  - <code>server.error.include-stacktrace=never</cdoe>: trace 포함 여부
  - <code>server.error.include-binding-errors=never</cdoe>: errors 포함 여부
  > never: 사용하지 않음  
  > always:항상 사용  
  > on_param: 파라미터가 있을 때 사용  

<br/>

***/error/500.html***

```html
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="utf-8">
</head>
<body>
<div class="container" style="max-width: 600px">
  <div class="py-5 text-center">
    <h2>500 오류 화면 스프링 부트 제공</h2>
  </div>
  <div>
    <p>오류 화면 입니다.</p>
  </div>
  <ul>
    <li>오류 정보</li>
    <ul>
      <li th:text="|timestamp: ${timestamp}|"></li>
      <li th:text="|path: ${path}|"></li>
      <li th:text="|status: ${status}|"></li>
      <li th:text="|message: ${message}|"></li>
      <li th:text="|error: ${error}|"></li>
      <li th:text="|exception: ${exception}|"></li>
      <li th:text="|errors: ${errors}|"></li>
      <li th:text="|trace: ${trace}|"></li>
    </ul>
    </li>
  </ul>
  <hr class="my-4">
</div> 
</body>
</html>
```
> application.properties 파일 내 속성을 on_param으로 변경해주고  
> http://localhost:8080/error-ex?message=&errors=&trace 호출 시 해당되는 정보를 볼 수 있다.  
> **실무에서는 이것들을 노출하면 안된다! 사용자에게는 이쁜 오류 화면과 고객이 이해할 수 있는 간단한 오류 메시지를 보여주고 오류는 서버에 로그로 남겨서 로그로 확인해야 한다.**

<br/>
<hr>

# 에러 공통 처리 컨트롤러 기능 변경 시

- ErrorController 인터페이스 구현 / BasicErrorController 상속 받아 기능 추가하면 된다.  



