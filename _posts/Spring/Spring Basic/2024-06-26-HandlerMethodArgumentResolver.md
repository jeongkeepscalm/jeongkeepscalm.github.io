---
title: "HandlerMethodArgumentResolver"
description: "HandlerMethodArgumentResolver"
date: 2024-06-26
categories: [Spring, Spring Basic]
tags: [Spring, Spring Basic]
---

# HandlerMethodArgumentResolver 

- 컨트롤러 메소드의 파라미터를 동적으로 해석하고 처리하는 역할
- 해당 인터페이스를 구현해서 파라미터에 대해 커스텀 로직을 적용할 수 있다.

<br/>
<hr>

# 커스텀 어노테이션 적용

- @Login 어노테이션 개요
  - 해당 애노테이션이 있으면 직접 만든 ArgumentResolver 가 동작해서 자동으로 세션에 있는 로그인 회원을 찾아주고, 세션에 회원 정보가 없다면 null울 반환하도록 개발

<br/>

***HomeController***

```java
@GetMapping("/")
public String homeLoginV5(@Login Member loginMember, Model model) {
  if (loginMember == null) {
    return "home";
  }
  model.addAttribute("member", loginMember);
  return "loginHome";
}
```

<br/>

***Login Annotation***

```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface Login {}
```
> `@Target(ElementType.PARAMETER)`: 해당 어노테이션을 파라미터에서만 사용한다.  
> `@Retention(RetentionPolicy.RUNTIME)`: 리플렉션 등을 활용할 수 있도록 런타임까지 애토테이션 정보가 남아있는다.  

<br/>

***HandlerMethodArgumentResolver 구현***

```java
@Slf4j
public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {

  @Override
  public boolean supportsParameter(MethodParameter parameter) {

    log.info("supportsParameter() 실행");

    // 파라미터에 @Login 어노테이션이 붙어 있는지 확인
    boolean hasLoginAnnotation = parameter.hasParameterAnnotation(Login.class);

    // 파라미터 타입이 Member 또는 그 하위 타입인지 확인
    boolean hasMemberType = Member.class.isAssignableFrom(parameter.getParameterType());

    // @Login 어노테이션이 붙은 타입이 Member 이면 true
    return hasLoginAnnotation && hasMemberType;

  }

  @Override
  public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

    log.info("resolverArgument() 실행");

    /*
      세션에 멤버 정보가 있다면 해당 멤버를 리턴
      그렇지 않다면 null 리턴
    */
    HttpServletRequest httpServletRequest = (HttpServletRequest) webRequest.getNativeRequest();
    HttpSession session = httpServletRequest.getSession(false);
    if (session == null) {
      return null;
    }
    return session.getAttribute(SessionConst.LOGIN_MEMBER);

  }

}
```

- `supportsParameter()`
  - @Login 애노테이션이 있으면서 Member 타입이면 해당 ArgumentResolver가 사용된다.

- `resolveArgument()`
  - 컨트롤러 호출 직전에 호출되어 필요한 파라미터 정보를 생성해준다.
  - 로그인 회원 정보인 member 객체를 찾아 반환하고, 스프링 mvc는 컨트롤러의 메소드를 호출하면서 여기서 반환된 member 객체를 파라미터에 전달해준다.
  - 즉, 파라미터 내 @Login Member 를 찾아 세션에 회원 정보가 있다면 매핑시켜준다.

<br/>

***커스텀 ArgumentResolver 설정***

```java
@Configuration
public class WebConfiguration_ArgumentResolver implements WebMvcConfigurer {

  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
    resolvers.add(new LoginMemberArgumentResolver());
  }
}
```

<br/>
<hr>

# 정리

1. 어노테이션 생성
2. HandlerMethodArgumentResolver 구현 (supportsParameter(), resolveArgument() 메소드 오버라이딩)
3. 해당 구현체 설정파일에 적용
4. 실제 사용