---
title: Spring Security, Csrf 검증 필터
description: Spring Security
date: 2024-02-22T21:40:000
categories: [ Exception, Security ]
tags: [ back-end, spring, security, csrf ]
---

- Spring Security Csrf 설정중 생긴 문제

- Csrf 공격 모방을 실제로 하기 힘들어 csrf test 코드 작성중 생긴 문제
  - ```perform``` 메소드 에서 인자로 ```with(csrf().asHeader().userInvalidToken())```을 넘길시 상태 코드가 ```200```으로 넘어오는 문제

<br>

<h2> 테스트에 사용한 코드 </h2>

```java

@SpringBootTest
public abstract class SecuritySetup {

  @Autowired
  private WebApplicationContext wac;
  @Autowired
  protected CustomCorsConfig customCorsConfig;
  protected CorsConfiguration corsConfiguration;
  protected MockHttpServletRequest httpServletRequest = new MockHttpServletRequest();
  protected MockMvc mockMvc;

  @BeforeEach
  public void setup() {
    mockMvc = MockMvcBuilders
      .webAppContextSetup(wac)
      .apply(springSecurity())
      .build();

    corsConfiguration = customCorsConfig.getCorsConfiguration(httpServletRequest);
  }

}

public class SecurityCsrfTest extends SecuritySetup {

  @Test
  void get_basic_get_pass() throws Exception {
    mockMvc.perform(options("/basic")
        .with(csrf().asHeader().useInvalidToken())
        .header("Origin", corsConfiguration.getAllowedOrigins())
        .header("Access-Control-Request-Method", "GET")
      )
      .andExpect(status().isForbidden())
      .andDo(print());
  }

}
```

<br>

<h2> SecurityConfiguration </h2>

```java

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AngrySecurityConfiguration {

  private final CsrfCookieFilter csrfCookieFilter;
  private final CustomCorsConfig customCorsConfig;

  @Bean
  public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
    CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
    requestHandler.setCsrfRequestAttributeName("_csrf");
    http
      .cors((cors) -> cors.configurationSource(customCorsConfig))
      .csrf((csrf) -> csrf.
        csrfTokenRequestHandler(requestHandler) //  csrf
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
      .addFilterAfter(csrfCookieFilter, BasicAuthenticationFilter.class)
      .authorizeHttpRequests(
        (requests) -> requests.anyRequest().permitAll()
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

<h2> CsrfCookieFilter </h2>

```java

@Component
public class CsrfCookieFilter extends OncePerRequestFilter {
  //  OncePerRequestFilter : HttpServletRequest 에 대해 한번만 필터가 실행되는것을 보장함.
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
    if (null != csrfToken.getHeaderName()) {
      response.setHeader(csrfToken.getHeaderName(), csrfToken.getToken());
    }
    filterChain.doFilter(request, response);
  }
}
```

<br>

- 의심 되는 부분을 디버깅 해본 결과 ```CsrfCookieFilter``` 해당 필터를 안거치는 문제 확인.

