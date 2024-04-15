---
title: Spring Security, 401 403
description: Spring Security
date: 2024-02-26T19:40:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, 401 403 exception handler ]
---

- 401, 403 에러가 발생했을 때 핸들링할 필터가 필요

- ```SecurityFilterChain```
  - ```exceptionHandling``` : 각 발생 에러는 리다이렉트 시킬때 ```modal```창을 띄우기 위한 ```url parameter```을 가진다.
    - ```authenticationEntryPoint``` : 401 에러 핸들링
    - ```accessDiniedHandler``` : 403 에러 핸들링

```java
@Slf4j
@Configuration
@RequiredArgsConstructor
public class AngrySecurityConfiguration {

  //    ...

    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

  //    ...

    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        corsAndCsrfSetting(http)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .authorizeHttpRequests(
                  //    ...
                )
                .formLogin(formLogin -> formLogin
                  //    ...
                );

        return http.build();
    }

    private HttpSecurity xssProtecting(HttpSecurity http) throws Exception {
      //    ...
    }

    private HttpSecurity corsAndCsrfSetting(HttpSecurity http) throws Exception {
      //    ...
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
```


<h2> AuthenticationEntryPoint : 401 </h2>

- 인증이 안되었을 때 발생하는 에러 핸들링
  - 로그인이 안되어 있는 상태이거나, 외부 ```cors```, ```csrf``` 관련 인증이 안된 상태일 때
  - ```/login-form``` 으로 리다이렉트 시켜 로그인을 유도한다.

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final HttpServletRequestService httpServletRequestService;
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        log.info("authentication entrypoint = {}", authException.getMessage());
        RequestInformation requestInformation = httpServletRequestService.requestInfo(request);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.sendRedirect("/login-form?error=authorization");
    }
}
```

<br>

<h2> AccessDeniedHandler : 403 </h2>

- 인증은 되었지만 권한이 없을 때 발생하는 에러 핸들링, 로그인은 하였으나 해당 기능에 접근할 수 있는 권한이 없을 때
  - ```authorizeHttpRequests``` 에 ```deny```가 된 앤드 포인트로 접근할 때 발생
  - 모두가 접근 가능한 메인 페이지로 리다이렉트 시킨다.

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final HttpServletRequestService httpServletRequestService;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        RequestInformation requestInformation = httpServletRequestService.requestInfo(request);

        String header = request.getHeader("referer");
        log.info("header = {}", header);

        log.info("access denied handler = {}", accessDeniedException.getMessage());
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.sendRedirect("/main?error=authorization");

    }

}
```

<br>
