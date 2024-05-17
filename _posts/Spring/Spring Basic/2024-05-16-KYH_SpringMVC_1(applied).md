---
title: "[KYH] Spring MVC 1 (applied)"
description: "[KYH] Spring MVC 1 (applied)"
date: 2024-05-16
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---


## 요청 매핑

<details>
<summary><span style="color:yellow" class="point"><b>PathVariable 다중 사용</b></span></summary>
<div markdown="1">      

```java
@GetMapping("/mapping/users/{userId}/orders/{orderId}")
  public String mappingPath(@PathVariable("userId") String userId, @PathVariable("orderId") Long orderId) {
    log.info("mappingPath userId={}, orderId={}", userId, orderId);
    return "pathVariable";
  }
```

</div>
</details>

<br/>

<details>
<summary><span style="color:yellow" class="point"><b>특정 파라미터 조건 매핑</b></span></summary>
<div markdown="1">      

```java
/**
 * 파라미터로 추가 매핑
 * params="mode",
 * params="!mode"
 * params="mode=debug"
 * params="mode!=debug" (! = )
 * params = {"mode=debug","data=good"}
 */
@GetMapping(value = "/mapping-param", params = "mode=debug")
public String mappingParam() {
 log.info("mappingParam");
 return "ok";
}
```

</div>
</details>

<br/>

<details>
<summary><span style="color:yellow" class="point"><b>특정 헤더 조건 매핑</b></span></summary>
<div markdown="1">      

```java
/**
 * 특정 헤더로 추가 매핑
 * headers="mode",
 * headers="!mode"
 * headers="mode=debug"
 * headers="mode!=debug" (! = )
 */
@GetMapping(value = "/mapping-header", headers = "mode=debug")
public String mappingHeader() {
 log.info("mappingHeader");
 return "ok";
}
```
> 파라미터 매핑과 비슷하지만, HTTP 헤더를 사용한다.  
> Postman으로 테스트해야 한다.  

</div>
</details>

<br/>

<details>
<summary><span style="color:yellow" class="point"><b>미디어 타입 조건 매핑 - HTTP 요청 Content-Type, consume</b></span></summary>
<div markdown="1">      

```java
/**
 * Content-Type 헤더 기반 추가 매핑 Media Type
 * consumes="application/json"
 * consumes="!application/json"
 * consumes="application/*"
 * consumes="*\/*"
 * MediaType.APPLICATION_JSON_VALUE
 * 
 * ex )
 * consumes = "text/plain"
 * consumes = {"text/plain", "application/*"}
 * consumes = MediaType.TEXT_PLAIN_VALUE
 */
@PostMapping(value = "/mapping-consume", consumes = "application/json")
public String mappingConsumes() {
 log.info("mappingConsumes");
 return "ok";
}
```
> HTTP 요청의 Content-Type 헤더를 기반으로 미디어 타입으로 매핑한다.  
> 만약 맞지 않으면 HTTP 415 상태코드(Unsupported Media Type)을 반환한다.  

</div>
</details>

<br/>

<details>
<summary><span style="color:yellow" class="point"><b>미디어 타입 조건 매핑 - HTTP 요청 Accept, produce</b></span></summary>
<div markdown="1">      

```java
/**
 * Accept 헤더 기반 Media Type
 * produces = "text/html"
 * produces = "!text/html"
 * produces = "text/*"
 * produces = "*\/*"
 * 
 * ex )
 * produces = "text/plain"
 * produces = {"text/plain", "application/*"}
 * produces = MediaType.TEXT_PLAIN_VALUE
 * produces = "text/plain;charset=UTF-8"
 */
@PostMapping(value = "/mapping-produce", produces = "text/html")
public String mappingProduces() {
 log.info("mappingProduces");
 return "ok";
}
```
> HTTP 요청의 Accept 헤더를 기반으로 미디어 타입으로 매핑한다.  
> 만약 맞지 않으면 HTTP 406 상태코드(Not Acceptable)을 반환한다.  

</div>
</details>

<br/>

<details>
<summary><span style="color:yellow" class="point"><b>요청 매핑 - API 예시</b></span></summary>
<div markdown="1">      

```java
@RestController
@RequestMapping("/mapping/users")
public class MappingClassController {

  /**
   * 회원 목록 조회: GET /mapping/users
   */
  @GetMapping
  public String users() {
    return "get users";
  }

  /**
   * 등록: POST /mapping/users
   */
  @PostMapping
  public String addUser() {
    return "post user";
  }

  /**
   * 회원 조회: GET /mapping/users/{userId}
   */
  @GetMapping("/{userId}")
  public String findUser(@PathVariable String userId) {
    return "get userId=" + userId;
  }

  /**
   * 회원 수정: PATCH /mapping/users/{userId}
   */
  @PatchMapping("/{userId}")
  public String updateUser(@PathVariable String userId) {
    return "update userId=" + userId;
  }

  /**
   * 회원 삭제: DELETE /mapping/users/{userId}
   */
  @DeleteMapping("/{userId}")
  public String deleteUser(@PathVariable String userId) {
    return "delete userId=" + userId;
  }

}
```

</div>
</details>

<br/>

<details>
<summary><span style="color:yellow" class="point"><b>HTTP 요청 - 기본, 헤더 조회</b></span></summary>
<div markdown="1">      

```java
@Slf4j
@RestController
public class RequestHeaderController {

  @RequestMapping("/headers")
  public String headers(HttpServletRequest request, HttpServletResponse response
                        , HttpMethod httpMethod
                        , Locale locale
                        , @RequestHeader MultiValueMap<String, String> headerMap
                        , @RequestHeader("host") String host
                        , @CookieValue(value = "myCookie", required = false) String cookie
                        ) {
    log.info("request={}", request);          // org.apache.catalina.connector.RequestFacade@14bede27
    log.info("response={}", response);        // org.springframework.web.context.request.async.StandardServletAsyncWebRequest$LifecycleHttpServletResponse@403568ce
    log.info("httpMethod={}", httpMethod);    // GET
    log.info("locale={}", locale);            // ko_KR
    log.info("headerMap={}", headerMap);      // {host=[localhost:8080], connection=[keep-alive], sec-ch-ua=["Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"]... }
    log.info("header host={}", host);         // localhost:8080
    log.info("myCookie={}", cookie);          // null

    return "ok";

  }

}
```
>  ```@RequestHeader``` MultiValueMap<String, String> headerMap: 모든 HTTP 헤더를 MultiValueMa식으로 조회한다.  
> @RequestHeader("host") String host: http 헤더 안 host 정보만 조회한다.  
> ```@CookieValue```(value = "myCookie", required = false) String cookie: 특정 쿠키를 조회한다.  
> MultiValueMap: HTTP header, HTTP 쿼리 파라미터와 같이 하나의 키에 여러 값을 받을 때 사용한다.  

</div>
</details>

<br/>

<details>
<summary><span style="color:yellow" class="point"><b>HTTP 요청 파라미터 - @RequestParam</b></span></summary>
<div markdown="1">      

```java
@Slf4j
@Controller
public class RequestParamController {

  @RequestMapping("/request-param-v1")
  public void requestParamV1(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String username = request.getParameter("username");
    int age = Integer.parseInt(request.getParameter("age"));
    log.info("username = {}, age = {}", username, age);
    response.getWriter().write("ok");
  }

  @ResponseBody
  @RequestMapping("/request-param-v2")
  public String requestParamV2(@RequestParam("username") String memberName, @RequestParam("age") int memberAge) {
    log.info("username = {}, age = {}", memberName, memberAge);
    return "ok";
  }

  @ResponseBody
  @RequestMapping("/request-param-v3")
  public String requestParamV3(@RequestParam String username, @RequestParam int age) {
    // HTTP 파라미터 이름이 변수 이름과 같으면 파라미터명 생략 가능
    log.info("username={}, age={}", username, age);
    return "ok";
  }

  @ResponseBody
  @RequestMapping("/request-param-v4")
  public String requestParamV4(String username, int age) {
    // String, int 등의 단순 타입이면 @RequestParam 도 생략 가능
    log.info("username={}, age={}", username, age);
    return "ok";
  }

  @ResponseBody
  @RequestMapping("/request-param-required")
  public String requestParamRequired(
          @RequestParam(required = true) String username,
          @RequestParam(required = false) Integer age) {
    log.info("username={}, age={}", username, age);
    return "ok";

    /**
     * @RequestParam(required = false) int age
     * 기본형 타입은 메모리의 할당된 공간에 직접 값을 저장하기 때문에, null 이 들어갈 수 없다. (500 예외 발생)
     *
     * 해결 방안
     *  1. 래퍼클래스인 Integer
     *  2. defaultValue 속성 추가
     */

  }

  @ResponseBody
  @RequestMapping("/request-param-default")
  public String requestParamDefault(
          @RequestParam(required = true, defaultValue = "guest") String username,
          @RequestParam(required = false, defaultValue = "-1") int age) {
    log.info("username={}, age={}", username, age);
    return "ok";
    /**
     *  빈 문자의 경우에도 설정한 기본 값이 적용된다.
     */
  }

  @ResponseBody
  @RequestMapping("/request-param-map")
  public String requestParamMap(@RequestParam MultiValueMap<String, String> multiValueMap){
    // http://localhost:8080/request-param-map?username=ojg&age=32&age=31
    log.info("username={}, age={}", multiValueMap.get("username"), multiValueMap.get("age")); // username=[ojg], age=[32, 31]
    return "ok";
  }

  /**
   * MultiValueMap 이점
   * @RequestParam 내 속성 required, defaultValue 속성을 신경 쓸 필요없다.
   */

}
```

</div>
</details>

<br/>


