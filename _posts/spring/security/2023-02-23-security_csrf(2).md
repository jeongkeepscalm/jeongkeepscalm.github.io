---
title: Spring Security, Csrf
description: Spring Security
date: 2024-02-23T10:50:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, csrf ]
---

<h2>- Csrf(cross site request forgery)</h2>

- A 사이트에 로그인, 사용자 권한 획득
- 사용자가 웹 어플레케이션에 로그인 했다고 가정하며 사용자는 공격자에게 속아서<br>
  직업중인 같은 어플리케이션에서 작업을 실행하는 스크립트가 포함된 페이지가 열리면서 공격


- ```Spring Security```에서는 해당 공격을 막기 위한 옵션이 자동으로 설정되어있음.
  - 서버쪽에 토큰값을 Cookie 형태로 저장.
  - 해당 구성을 확인하기 위한 Filter 추가.
  - ```CsrfTokenRepository```를 직접 구현하여 설정을 바꿀 수 있음.

<br>


<h2>CsrfTokenLoggerFilter</h2>

- ```Spring Security``` 가 자동으로 생성해주는 csrf 토큰 확인.

```java

@Slf4j
@Component
public class CsrfTokenLoggerFilter implements Filter {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
    Object o = request.getAttribute("_csrf");
    CsrfToken csrfToken = (CsrfToken) o;

    log.info("csrfToken.getParameterName = {}", csrfToken.getParameterName());
    log.info("csrfToken.getHeaderName = {}", csrfToken.getHeaderName());
    log.info("csrfToken.getToken = {}", csrfToken.getToken());
    filterChain.doFilter(request, response);
  }

}
```

<br>

<h2>CsrfTokenLoggerFilter</h2>

- ```defaultSecurityFilterChain``` 해당 메소드안에 ```.addFilterAfter()```로 추가.

```java

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AngrySecurityConfiguration {

  private final CustomCorsConfig customCorsConfig;
  private final CsrfTokenLoggerFilter csrfTokenLoggerFilter;

  @Bean
  public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {

    CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
    requestHandler.setCsrfRequestAttributeName("_csrf");

    http
      .addFilterAfter(csrfTokenLoggerFilter, BasicAuthenticationFilter.class) //
      .cors((cors) -> cors.configurationSource(customCorsConfig))
      .authorizeHttpRequests(
        (requests) -> requests.anyRequest().authenticated()
      )
      .formLogin(withDefaults())
      .httpBasic(withDefaults());
    return http.build();
  }

  @Bean
  public InMemoryUserDetailsManager inMemoryUserDetailsManager() {
    UserDetails admin = org.springframework.security.core.userdetails.User.withUsername("admin").password("12345").roles("admin").build();
    UserDetails user = org.springframework.security.core.userdetails.User.withUsername("user").password("12345").roles("user").build();
    UserDetails guest = org.springframework.security.core.userdetails.User.withUsername("guest").password("12345").roles("guest").build();
    return new InMemoryUserDetailsManager(admin, user, guest);
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return NoOpPasswordEncoder.getInstance();   //  ToBE bcrypt
  }

}
```

<br>

<h2>로그 확인</h2>

![csrf_token](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/20601f1e-a200-4669-a653-cf58aa81a1a0)


<br>

- 실제로 로그인 인증이 완료된 후에 값이 저장되는지 확인
  - ```csrf```옵션을 활성화한다.
  - ```HttpServletRequest```를 이용해 쿠키값을 확인해본다.

<h2>CsrfTokenValidFilter</h2>

```java

@Slf4j
@Component
public class CsrfTokenValidFilter implements Filter {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {

    HttpServletRequest httpServletRequest = (HttpServletRequest) request;

    Cookie[] cookies = ((HttpServletRequest) request).getCookies();

    Cookie _XSRF_TOKEN = null;
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if ("XSRF-TOKEN".equals(cookie.getName())) {
          _XSRF_TOKEN = cookie;
        }
      }
    }

    if (_XSRF_TOKEN != null) {
      log.info("XSRF-TOKEN = {}", _XSRF_TOKEN);
      log.info("XSRF-TOKEN.getName() = {}", _XSRF_TOKEN.getName());
      log.info("XSRF-TOKEN.getValue() = {}", _XSRF_TOKEN.getValue());
    }

    HttpSession session = httpServletRequest.getSession();
    Enumeration<String> attributeNames = session.getAttributeNames();

    while (attributeNames.hasMoreElements()) {
      String name = attributeNames.nextElement();
      Object attribute = session.getAttribute(name);
      log.info("attribute = {}", attribute);
    }

    filterChain.doFilter(request, response);
  }

}
```

- ```csrfTokenLoggerFilter```를 추가한것과 마찬가지로 필터 추가
  - ```text
            http
                .addFilterAfter(csrfTokenLoggerFilter, BasicAuthenticationFilter.class) //
                .addFilterAfter(csrfTokenValidFilter, BasicAuthenticationFilter.class)
                .cors((cors) -> cors.configurationSource(customCorsConfig))
                .csrf((csrf)-> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
                .authorizeHttpRequests(
                        (requests) -> requests.anyRequest().authenticated()
                )
                .formLogin(withDefaults())
                .httpBasic(withDefaults());
    ```

![csrf_valid](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/2e15c3e8-bcfd-42c3-ad0a-3044f07c5fda)


<h2> CsrfToken 설명 </h2>

```java

public interface CsrfToken extends Serializable {

  /**
   * Gets the HTTP header that the CSRF is populated on the response and can be placed
   * on requests instead of the parameter. Cannot be null.
   * @return the HTTP header that the CSRF is populated on the response and can be
   * placed on requests instead of the parameter
   */
  String getHeaderName();

  /**
   * Gets the HTTP parameter name that should contain the token. Cannot be null.
   * @return the HTTP parameter name that should contain the token.
   */
  String getParameterName();

  /**
   * Gets the token value. Cannot be null.
   * @return the token value
   */
  String getToken();

}

```
