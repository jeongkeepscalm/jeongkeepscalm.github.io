---
title: "Handling API Exception"
description: "Handling API Exception"
date: 2024-06-27
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

# API 예외 처리는 어떻게 해야할까?

- `HTML 페이지의 경우` 4xx, 5xx와 같은 오류 페이지를 만들어 문제를 해결했다.
- `API의 경우` 각 오류 상황에 맞는 오류 응답 스펙을 정하고 JSON으로 데이터를 내려주어야 한다. 

<br/>
<hr>

***Customized Error Page Setting***

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

***test code***

```java
@Slf4j
@RestController
public class ApiExceptionController {

  @GetMapping("/api/members/{id}")
  public MemberDto getMember(@PathVariable(name = "id") String id) {
    if ("ex".equals(id)) {
      throw new RuntimeException("잘못된 사용자");
    }
    return new MemberDto(id, "hello " + id);
  }

  @Data
  @AllArgsConstructor
  static class MemberDto {
    private String memberId;
    private String name;
  }

}
```
> API 요청 후, 정상처리될 경우 JSON 형식으로 데이터가 정상 반환된다.   
> 그렇지 않을 경우 미리 만들어둔 오류 페이지로 넘어가게 되는데,  
> **정상/오류 요청 모두 JSON이 반환되도록 수정하자.**  

<br/>

***ErrorPageController 코드 추가***

```java
@GetMapping(value = "/error-page/500", produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<Map<String, Object>> errorPage500Api(HttpServletRequest request, HttpServletResponse response) {
  log.info("API error page 500");

  Exception ex = (Exception) request.getAttribute(ERROR_EXCEPTION);       // jakarta.servlet.error.exception
  String exceptionMessage = ex.getMessage();
  Object status = request.getAttribute(ERROR_STATUS_CODE);                // jakarta.servlet.error.status_code

  HashMap<String, Object> result = new HashMap<>();
  result.put("status", status);
  result.put("message", exceptionMessage);

  Integer statusCode = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
  return new ResponseEntity(result, HttpStatus.valueOf(statusCode));
}
```
> produces = MediaType.APPLICATION_JSON_VALUE  
> 클라이언트가 요청하는 http header 의 accept 의 값이 application/json 일 때 해당 메소드 호출  
> 즉, 클라이언트가 받고 싶은 미디어 타입이 json 이면 컨트롤러의 메소드가 호출된다.  

<br/>

```json
{
  "message": "잘못된 사용자",
  "status": 500
}
```
> PostMan에서 HTTP Header에 Accept application/json 설정 후 http://localhost:8080/api/members/ex 호출 한 결과값. 

<br/>
<hr>

# 스프링 부트 기본 오류 처리

***BasicErrorController Code***

```java
@RequestMapping(produces = MediaType.TEXT_HTML_VALUE)
public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {}

@RequestMapping
public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {}
```
> `errorHtml()`:클라이언트 요청의 Accept 해더 값이 text/html 인 경우에는 errorHtml() 을 호출해서 view를 제공  
> `error()`:그외 경우에 호출되고 ResponseEntity 로 HTTP Body에 JSON 데이터를 반환  

<br/>
<hr>

# HTML 페이지 오류 vs API 오류

- HTML 페이지 오류 처리: 스프링 부트에서 자동 등록된 BasicErrorController 사용
- API 오류 처리: @ExceptionHandler가 제공하는 기능을 사용하여 JSON 메시지 변경 가능

<br/>
<hr>

# HandlerExceptionResolver

- 예외가 WAS 까지 전달되면 HTTP 상태코드는 500으로 처리된다. 발생하는 예외에 따라 400, 404 등 다른 상태코드로 처리하려면 어떻게 해야 할까? 

<br/>

### 상태코드 변환

- IllegalArgumentException 을 처리하지 못해 컨트롤러 밖으로 넘어왔을 경우, HTTP 상태코드를 400으로 처리해보자. 

***controller code added***

```java
@Slf4j
@RestController
public class ApiExceptionController {

  @GetMapping("/api/members/{id}")
  public MemberDto getMember(@PathVariable(name = "id") String id) {
    if ("ex".equals(id)) {
      throw new RuntimeException("잘못된 사용자");
    }
    if ("bad".equals(id)) {
      throw new IllegalArgumentException("잘못된 입력 값");
    }
    return new MemberDto(id, "hello " + id);
  }

  @Data
  @AllArgsConstructor
  static class MemberDto {
    private String memberId;
    private String name;
  }

}
```

<br/>

***스프링 부트에서 지원하는 에러 코드 형식***

```json
// http://localhost:8080/api/members/bad 호출 시
{
  "timestamp": "2024-06-27T07:46:14.735+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "exception": "java.lang.IllegalArgumentException",
  "path": "/api/members/bad"
}
```

<br/>

- `HandlerExceptionResolver`
  - 컨트롤러 밖으로 던져진 예외를 해결하고 동작 방식을 변경한다. 
  - 줄여서 `ExceptionResolver`라고 한다. 
  
- ExceptionResolver 적용 전
  - <img src="/assets/img/spring/exceptionHandler1.png" width="600px" />
- ExceptionResolver 적용 후
  - <img src="/assets/img/spring/exceptionHandler2.png" width="600px" />
  - ExceptionResolver 로 예외를 해결해도 postHandle()은 호출되지 않는다. 

<br/>

***HandlerExceptionResolver Interface***

```java
public interface HandlerExceptionResolver {
  ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex);
}
```
> handler: 핸들러(컨트롤러) 정보  
> Exception ex: 핸들러(컨트롤러)에서 발생한 예외

<br/>

***HandlerExceptionResolver Interface 구현***

```java
@Slf4j
public class MyHandlerExceptionResolver implements HandlerExceptionResolver {
  /**
   * @param request
   * @param response
   * @param handler: 컨트롤러  
   * @param ex: 컨트롤러에서 발생한 예외
   * @return
   */
  @Override
  public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
    try {
      /**
       * IllegalArgumentException 이 발생하면,
       * response.sendError(400) 를 호출해서 HTTP 상태코드를 400으로 지정하고,
       * 빈 ModelAndView 를 반환
       */
      if (ex instanceof IllegalArgumentException) {
        response.sendError(HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
        return new ModelAndView();
      }
    } catch (IOException e) {
      log.error("resolver ex", e);
    }
    return null;
  }
}
```
> `빈 ModelAndView 반환`: 뷰를 렌더링하지 않고, 정상 흐름으로 서블릿이 리턴된다.  
> `ModelAndView 지정`: ModelAndView에 View, Model 등의 정보를 지정해서 반환하면 뷰를 렌더링한다.  
> `null 반환`: 다음 ExceptionResolver를 찾아서 실행한다. 처리할 수 있는 ExceptionResolver가 없다면 예외 처리가 안되고, 기본에 발생한 예외를 서블릿 밖으로 던진다.  

<br/>

***커스텀한 ExceptionResolver 적용***

```java
@Configuration
public class WebConfiguration implements WebMvcConfigurer {
  
  ...
  
  @Override
  public void extendHandlerExceptionResolve(List<HandlerExceptionResolver> resolvers) {
    resolvers.add(new MyHandlerExceptionResolver());
  }

}
```
> WebMvcConfigurer 인터페이스 구현(extendHandlerExceptionResolve() 메소드 오버 라이딩)  

<br/>
<hr>

# HandlerExceptionResolver 활용

- 예외 발생 시 WAS까지 예외가 던져지고, WAS에서 오류 페이지 정보를 찾아 다시 /error 를 호출하는 과정은 너무 복잡한다. 
- ExceptionResolver 를 활용하면 예외가 발생했을 때 이런 복잡한 과정 없이 여기에서 문제를 깔끔하게 해결할 수 있다. 




