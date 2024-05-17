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
