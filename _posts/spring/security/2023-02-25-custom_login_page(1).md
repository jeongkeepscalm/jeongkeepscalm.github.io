---
title: Spring Security, Custom Form Login
description: Spring Security
date: 2024-02-25T21:00:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, custom form login ]
---

<h2> defaultSecurityFilterChain </h2>

- ```defaultSecurityFilterChain``` : 메소드 안에 ```form login``` 설정
  - ```loginPage()``` : 커스텀한 ```view```를 반환하는 ```end-point```
  - ```usernameParameter()``` : ```view``` 에서 ```form``` 에 담은 ```username```에 해당하는 파라미터 설정
    - 시큐리티에서는 아이디를 ```username```으로 사용하고 있지만 해당 서비스 에서는 아이디를 ```email```로 사용하기 떄문에 추가 설정 필요
  - ```passwordParameter()``` : ```usernameParameter()``` 설명과 동일.
  - ```.loginProcessingUrl("/login")``` : ```중요``` 기존에 인증 공급자의 기능을 그대로 설정하는 옵션.
  - ```successHandler()```, ```failureHandler()``` : 인증 성공, 실패 시 다음 동작을 하게하는 핸들러
  - ```permitAll()``` : 해당 페이지는 누구나 접근 가능하게 설정.

```java

@Bean
public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
  httpSecurity(http)
    .authorizeHttpRequests(
      (requests) -> requests
      //  ...
    )
    .formLogin(formLogin -> formLogin
      .loginPage("/login-form")
      .usernameParameter("email")
      .passwordParameter("password")
      .loginProcessingUrl("/login")
      .successHandler(authenticationSuccessHandler)
      .failureHandler(authenticationFailureHandler)
      .permitAll()
    );
  return http.build();
}
```

<br>

<h2> Controller </h2>

```java
@Controller
@RequestMapping(path = "/login-form")
public class LoginFormController {

    @GetMapping
    public String loginForm() {
        return "/login/form";
    }

    @GetMapping("/fail")
    public String loginFailForm() {
        return "/login/fail-form";
    }

}
```

<br>

<h2> view </h2>

```html
<!doctype html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Example</title>

  <link rel="stylesheet" href="/static/css/main.css" th:href="@{/css/main.css}">
  <link rel="stylesheet" href="/static/css/login/form.css" th:href="@{/css/login/form.css}">
  <script type="text/javascript" src="/static/js/login/login.js" th:src="@{/js/login/login.js}"></script>

</head>

<body>

<header class="login-form-header">
  <strong>Spring Security + HTML + CSS Challenge <br> #1 : Sign Login Form</strong>
</header>

<form id="login-form" method="POST" action="/login-form/login" th:method="POST" th:action="@{/login}">
  <div class="login-form-flex-box">

    <div class="input-flex-box">
      <label for="email">email : </label>
      <input id="email" name="email" type="email" placeholder="email"/>
    </div>

    <div class="input-flex-box">
      <label for="password">password : </label>
      <input id="password" class="password" name="password" type="password" placeholder="password"/>
    </div>

    <button>Login In</button>

  </div>
</form>

<footer>
</footer>

</body>

</html>
```

![login_form](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/e178e604-e241-439e-8f9f-5de8bde29684)


<br>

<h2>CustomAuthenticationFailureHandler</h2>

```java
@Slf4j
@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.error("exception = {}", exception.getMessage());
        log.info("CustomAuthenticationFailureHandler");
        response.sendRedirect("/login-form/fail");
    }

}
```

<br>

<h2>CustomAuthenticationSuccessHandler</h2>


```java
@Slf4j
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("CustomAuthenticationSuccessHandler");
        response.sendRedirect("/main");
    }

}
```
