---
layout: post
title: Java_Filter_Interceptor
date: 2023-09-10 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: interceptor.jpg # Add image post (optional)
tags: [Filter, Interceptor] # add tag
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
> - init() : 필터 초기화 메서드, 서블릿 컨테이너가 생성될 때 호출된다. <br/>
> - doFilter() : 고객의 요청이 올 때 마다 해당 메서드가 호출된다. 필터의 로직을 구현하면 된다. <br/>
> - destroy() : 필터 종료 메서드, 서블릿 컨테이너가 종료될 때 호출된다. <br/>

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
> - 필터 인터페이스를 구현해서 사용한다. <br/>
> - HTTP 요청이 오면 doFilter 가 호출된다. ServletRequest request 는 HTTP 요청이 아닌 경우까지 고려해서 만든 인터페이스이다. HTTP를 사용하면 HttpServletRequest httpRequest = (HttpServletRequest) request; 와 같이 다운 캐스팅 하면 된다. <br/>
> - String uuid = UUID.randomUUID().toString(); : HTTP 요청을 구분하기 위해 요청당 임의의 uuid 를 생성해둔다. <br/>
> - **chain.doFilter(request, response);** : 다음 필터가 있으면 필터를 호출하고, 필터가 없으면 서블릿을 호출한다. 만약 이 로직을 호출하지 않으면 다음 단계로 진행되지 않는다. <br/>

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
}
```
> - 필터를 등록하는 방법은 여러가지가 있지만, 스프링 부트를 사용한다면 FilterRegistrationBean 을
사용해서 등록하면 된다. <br/>
> - setFilter(new LogFilter()) : 등록할 필터를 지정한다. <br/>
> - setOrder(1) : 필터는 체인으로 동작한다. 따라서 순서가 필요하다. 낮을 수록 먼저 동작한다. <br/>
> - addUrlPatterns("/*") : 필터를 적용할 URL 패턴을 지정한다. 한번에 여러 패턴을 지정할 수 있다. <br/>

- @ServletComponentScan, @WebFilter(filterName = "logFilter", urlPatterns = "/*") 로
필터 등록이 가능하지만 필터 순서 조절이 안된다. 따라서 FilterRegistrationBean 을 사용하자.

<br/>




<br/>
<hr>
<br/>


