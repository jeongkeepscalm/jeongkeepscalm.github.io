---
title: "Spring Annotation"
description: "Spring Annotation"
date: 2024-05-17
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

## Spring Basic 

```@Configuration```  
스프링 설정 정보에 사용되는 어노테이션으로 싱들톤을 보장한다.  
  
```@ComponentScan```  
@Component 가 붙은 모든 클래스를 스프링 빈으로 등록  
  
```@Component```  
Bean을 자동으로 등록하는데 사용  
  
```@Autowired```  
의존 관계를 자동으로 주입해준다.  

```@Repository```  
스프링 데이터 접근 계층으로 인식하고, 데이터 계층의 예외를 스프링 예외로 변환해준다.  
  
```@RequiredArgsConstructor```  
final이 붙은 필드를 모아서 생성자를 자동으로 만들어준다.  
  
```@AllArgsConstructor```  
모든 멤버 변수를 인자로 받는 생성자를 자동으로 생성해준다.  
  
```@Qualifier / @Primary```  
둘 다 같은 타입의 빈이 여러 개 있을 때, 어떤 빈을 주입할지 선택하는데 사용된다.  
우선순위: @Qualifier > @Primary   
  
```@PostConstruct```  
빈이 생성되고 의존성 주입이 완료된 후에 자동으로 호출된다. 특정한 설정을 해야한다거나, DB에 초기 데이터를 채워야 하는 작업을 할 때 사용한다.  
  
```@PreDestroy```  
스프링 빈의 생명주기가 끝나기 직전에 호출되는 메서드에 붙인다. 주로 리소스 해제 등을 위해 사용된다.  

<br/>
<hr>

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
  
