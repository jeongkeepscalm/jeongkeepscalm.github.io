---
title: Spring Security, Spring Security Otp(3)
description: Spring Security
date: 2024-02-29T21:00:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, spring security otp ]
---

[otp_part_2](https://angrypig123.github.io/posts/security_otp(2)/){:target="\_blank"}

- ```인증필터```, ```JWT 필터 구현```

- ```인증필터 기능``` : 요청을 가로채고 인증 논리를 적용
  - 1 ] 인증 서버가 수행하는 인증을 처리할 필터 구현
  - 2 ] ```JWT```기반 인증 필터 구현

<br>

<h2> InitialAuthenticationFiler </h2>

- 첫번째 인증단계 처리 필터
  - 인증 책임을 위임할 ```AuthenticationManager``` 주입
    - 해당 주입 부분을 ```spring security 6.x.x``` 버전에서 구현하다가 포기하고 ```5.x.x```로 구현(**TODO 항목으로 남겨둠**)
  - ```shouldNotFilter()``` 해당 재정의를 통해 특정 경로에 따른 필터 분기 설정
    - 해당 필터에서는 ```/login```경로에 대해서만 모든 요청을 실행

```java

@Component
public class InitialAuthenticationFilter extends OncePerRequestFilter {

  private final AuthenticationManager manager;

  public InitialAuthenticationFilter(AuthenticationManager manager) {
    this.manager = manager;
  }

  @Value("${jwt.signing.key}")
  private String signingKey;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    String username = request.getHeader("username");
    String password = request.getHeader("password");
    String code = request.getHeader("code");

    if (code == null) {
      Authentication a = new UsernamePasswordAuthentication(username, password);
      manager.authenticate(a);
    } else {
      Authentication a = new OtpAuthentication(username, code);
      manager.authenticate(a);

      SecretKey key = Keys.hmacShaKeyFor(signingKey.getBytes(StandardCharsets.UTF_8));
      String jwt = Jwts.builder()
        .setClaims(Map.of("username", username))
        .signWith(key)
        .compact();
      response.setHeader("Authorization", jwt);
    }

  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    return !request.getServletPath().equals("/login");
  }
}
```

- 코드 분석

- ```HTTP``` 요청에 ```OTP```가 없으면 사용자 이름과 암호로 인증후 ```AuthenticationManager```호출

```text
    if (code == null) {
      Authentication a = new UsernamePasswordAuthentication(username, password);
      manager.authenticate(a);
    }
```

<br>

- ```OTP```코드가 ```null```이 아닌 경우 분기를 추가, 이때, 인증 서버가 ```OTP```를 보냈다고 가정한후.<br>
  ```OtpAuthentication```로 ```AuthenticationManager``` 호출

```text
  } else {
    Authentication a = new OtpAuthentication(username, code);
    manager.authenticate(a);
    //  ..
  }
```

- ```JWT```를 구축하고 헤더에 추가하는 코드

```text
    } else {
        //  ..
        SecretKey key = Keys.hmacShaKeyFor(signingKey.getBytes(StandardCharsets.UTF_8));
        String jwt = Jwts.builder()
            .setClaims(Map.of("username", username))
            .signWith(key)
            .compact();
        response.setHeader("Authorization", jwt);
    }
```

<br>

<h2> JwtAuthenticationFilter </h2>

- ```/login```외에 다른 모든 경로에 대한 요청을 처리하는 필터 추가
  - 해당 필터는 엔드포인트에 대한 접근 권한을 헤더에 담긴 ```JWT``` 토큰을 통해 검증한다.

```java

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Value("${jwt.signing.key}")
  private String signingKey;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    String jwt = request.getHeader("Authorization");

    SecretKey key = Keys.hmacShaKeyFor(signingKey.getBytes(StandardCharsets.UTF_8));
    Claims claims = Jwts.parserBuilder()
      .setSigningKey(key)
      .build()
      .parseClaimsJws(jwt)
      .getBody();

    String username = String.valueOf(claims.get("username"));

    GrantedAuthority a = new SimpleGrantedAuthority("user");
    var auth = new UsernamePasswordAuthentication(username, null, List.of(a));
    SecurityContextHolder.getContext().setAuthentication(auth);

    filterChain.doFilter(request, response);
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    return request.getServletPath().equals("/login");
  }
}
```

<br>

<h2> SecurityConfig </h2>

- ```Filter```,```Provider``` 주입 및 설정 구성

```java

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  private InitialAuthenticationFilter initialAuthenticationFilter;

  @Autowired
  private JwtAuthenticationFilter jwtAuthenticationFilter;

  @Autowired
  private OtpAuthenticationProvider otpAuthenticationProvider;

  @Autowired
  private UsernamePasswordAuthenticationProvider usernamePasswordAuthenticationProvider;

  @Override
  protected void configure(AuthenticationManagerBuilder auth) {
    auth.authenticationProvider(otpAuthenticationProvider)
      .authenticationProvider(usernamePasswordAuthenticationProvider);
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.csrf().disable();

    http.addFilterAt(
        initialAuthenticationFilter,
        BasicAuthenticationFilter.class)
      .addFilterAfter(
        jwtAuthenticationFilter,
        BasicAuthenticationFilter.class
      );

    http.authorizeRequests()
      .anyRequest().authenticated();
  }

  @Override
  @Bean
  protected AuthenticationManager authenticationManager() throws Exception {
    return super.authenticationManager();
  }
}
```

<br>

<h2> 테스트 </h2>

```java

@SpringBootTest
@AutoConfigureMockMvc
public class MainTests {

  @Autowired
  private MockMvc mvc;

  @MockBean
  private MockBean restTemplate;

  @MockBean
  private AuthenticationServerProxy authenticationServerProxy;

  @Test
  @DisplayName("Test /login with username and password")
  public void testLoginWithUsernameAndPassword() throws Exception {
    mvc.perform(get("/login").servletPath("/login")
        .header("username", "bill")
        .header("password", "12345")
      )
      .andExpect(status().isOk());

    verify(authenticationServerProxy)
      .sendAuth("bill", "12345");
  }

  @Test
  @DisplayName("Test /login with username and otp")
  public void testLoginWithUsernameAndOtp() throws Exception {
    when(authenticationServerProxy.sendOTP("bill", "5555"))
      .thenReturn(true);

    mvc.perform(get("/login").servletPath("/login")
        .header("username", "bill")
        .header("code", "5555")
      )
      .andExpect(header().exists("Authorization"))
      .andExpect(status().isOk());
  }

  @Test
  @DisplayName("Test /test with Authorization header")
  public void testRequestWithAuthorizationHeader() throws Exception {
    when(authenticationServerProxy.sendOTP("bill", "5555"))
      .thenReturn(true);

    var authorizationHeaderValue =
      mvc.perform(get("/login").servletPath("/login")
          .header("username", "bill")
          .header("code", "5555")
        )
        .andReturn().getResponse().getHeader("Authorization");

    mvc.perform(get("/test")
        .header("Authorization", authorizationHeaderValue))
      .andExpect(status().isOk());
  }
}
```

- ```oAuth2``` 인증으로 넘어간 후 못다룬 부분을 자세히 알아볼 예정.
