---
title: "Spring Annotation"
description: "Spring Annotation"
date: 2024-05-17
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

## 클래스 단위

```@Controller```  
반환값이 String 이면 뷰 이름으로 인식해서 뷰를 찾고 렌더링된다.  
내부에 @Component 애노테이션이 기재되어 있어 스프링 빈 등록이 되며 @ComponentScan 의 대상이 되어 사용 가능하다.  
  
```@RestController```  
반환값으로 뷰를 찾는 것이 아니라, Http MessageBody 에 바로 입력한다. 따라서 실행 결과로 상태 메시지를 받을 수 있다.  
  
```@SLF4J```  
스프링에서 제공하는 Logback 로깅 라이브러리를 사용할 수 있다.  
  
```@Data```   
@Getter , @Setter , @ToString , @EqualsAndHashCode , @RequiredArgsConstructor 를 자동으로 적용해준다.  

<br/>
<hr>

## 메소드 단위

```@ResponseBody```  
뷰 조회를 무시하고 HTTP MessageBody 에 직접 반환 값을 입력한다.    

<br/>
<hr>

## 파라미터 내

```@RequestParam```  
@RequestParam("username") String username   
@RequestParam(required = false, defaultValue = "-1") int age   
파라미터 이름으로 바인딩  
request.getParameter("username");  
  
```@RequestHeader```  
@RequestHeader MultiValueMap<String, String> headerMap  
모든 HTTP 헤더를 MultiValueMap 형식으로 조회  
  
```@RequestHeader```  
@RequestHeader("host") String host  
HTTP 헤더 내 host 정보를 조회  
  
```@CookieValue```  
@CookieValue(value = "myCookie", required = false) String cookie  
특정 값의 쿠키 조회  
  
```@ModelAttribute```  
@ModelAttribute User user  
지정된 객체를 생성해주고 파라미터로 넘어온 값을 바인딩해준다.   
  
