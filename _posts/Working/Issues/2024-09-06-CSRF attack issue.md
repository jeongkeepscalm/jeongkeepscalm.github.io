---
title: "CSRF Attack Issue"
description: "CSRF Attack Issue"
date: 2024-09-06
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

### CSRF(Cross-Site Request Forgery)

- 공격자는 사용자가 인지하지 못한 상태에서 사용자의 권한을 이용해 특정 요청을 서버에 보내도록 유도
- 공격자는 사용자의 권한으로 악의적인 작업을 수행

<hr>

### CSRF 공격 방어

***Security Code***

```java
private void csrf() throws Exception {
    httpSecurity.csrf(csrf -> csrf
            .ignoringRequestMatchers(new AntPathRequestMatcher("/api/**"))
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            .csrfTokenRequestHandler(new SpaCsrfTokenTestHandler())
            )
            .addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class);
}
```
- `ignoringRequestMatchers`
  - /api/** 경로의 요청은 CSRF 검증을 무시한다. 
- `csrfTokenRepository`
  - CSRF 토큰을 쿠키에 저장
- `csrfTokenRequestHandler`
  - SPA용 CSRF 토큰 처리 핸들러를 설정
  - Thymeleaf로 개발된 애플리케이션은 전통적인 서버 사이드 렌더링 방식을 사용하지만, 일부 페이지나 기능에서 SPA 방식으로 동작할 수 있다. 이 경우 SPA용 CSRF 토큰 처리 핸들러가 필요
  
<hr>

***SPA vs MPA***

- `SPA(Single Page Application)`
  - 단일 페이지에서 동적으로 콘텐츠를 로드
- `MPA(Multiple Page Application)`
  - 여러 페이지로 구성

<hr>
<br/>

```html
<form name="formTest" action="/auth/test" method="post" target="test_popup">
    <input type="hidden" name="_csrf" th:value="${_csrf.token}" />
    <input type="hidden" name="test1" value="testValue1">
    <input type="hidden" name="test2" value="testValue2">
</form>
```
> api 로 시작되지 않는 url에 DB 내 데이터를 변경할 수 있는 메소드가 존재할 경우  
> <code>input type="hidden" name="_csrf" th:value="${_csrf.token}"</code>   
> 해당 input이 필요하다.    

<hr>
<br/>

***CsrfCookieFilter***

```java
final class CsrfCookieFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        if (csrfToken != null) {
            csrfToken.getToken(); // CSRF 토큰을 강제로 로드
        }
        filterChain.doFilter(request, response);

    }
}
```

<hr>
<br/>

***SpaCsrfTokenTestHandler***

```java
final class SpaCsrfTokenRequestHandler extends CsrfTokenRequestAttributeHandler implements CsrfTokenRequestHandler {

    private final CsrfTokenRequestHandler delegate = new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
        // XorCsrfTokenRequestAttributeHandler로 BREACH 보호 처리
        this.delegate.handle(request, response, csrfToken);
    }

    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {

        // 요청 헤더에 CSRF 토큰이 있으면 해당 값을 사용
        if (StringUtils.hasText(request.getHeader(csrfToken.getHeaderName()))) {
            return super.resolveCsrfTokenValue(request, csrfToken);
        }
        // 그 외의 경우, 요청 파라미터에서 CSRF 토큰 값을 가져옴
        return this.delegate.resolveCsrfTokenValue(request, csrfToken);

    }

}
```