---
title: Spring Security, Access Limit
description: Spring Security
date: 2024-02-23T17:40:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, access limit ]
---

<h2> authorizeHttpRequests </h2>

- 사용자 데이터

[Entity_구성](https://angrypig123.github.io/posts/user_role_auth/){:target="\_blank"}
<br>
![image](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/539353f1-d9ca-44fd-a8a6-6284525202de)
<br>

- 사용자의 접근 제한을 하는부분

- ```Spring Security```에서 설정한 ```cors```, ```csrf``` 설정이 테스트에서 예상밖으로 작동해서<br>
  ```httpSecurity()```메소드를 생성하고 운영, 테스트에 따른 설정을 다르게함

```java

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AngrySecurityConfiguration {

  private final CustomCorsConfig customCorsConfig;
  private final CsrfTokenLoggerFilter csrfTokenLoggerFilter;
  private final CsrfTokenValidFilter csrfTokenValidFilter;

  @Value("${spring.profiles.active}")
  private String ACTIVE;

  @Bean
  public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
    httpSecurity(http)
      .authorizeHttpRequests(
        (requests) -> requests
          .requestMatchers("/basic").permitAll()
          .requestMatchers("/admin").hasAuthority("admin_enter")
          .requestMatchers("/user").hasAuthority("user_enter")
          .requestMatchers("/guest").hasAuthority("guest_enter")
      )
      .formLogin(withDefaults())
      .httpBasic(withDefaults());
    return http.build();
  }

  private HttpSecurity httpSecurity(HttpSecurity http) throws Exception {
    if (ACTIVE.equals("dev")) {
      return http
        .cors(AbstractHttpConfigurer::disable)
        .csrf(AbstractHttpConfigurer::disable);
    } else {
      CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
      requestHandler.setCsrfRequestAttributeName("_csrf");
      return http
        .addFilterAfter(csrfTokenLoggerFilter, BasicAuthenticationFilter.class)
        .addFilterAfter(csrfTokenValidFilter, BasicAuthenticationFilter.class)
        .cors((cors) -> cors.configurationSource(customCorsConfig))
        .csrf((csrf) -> csrf
          .csrfTokenRequestHandler(requestHandler)
          .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        )
        .addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class);
    }
  }


  @Bean
  public PasswordEncoder passwordEncoder() {
    return NoOpPasswordEncoder.getInstance();   //  ToBE bcrypt
  }

}
```

- ```.requestMatchers("/basic").denyAll()``` : ```/basic``` 요청에 대한 모든 접근을 불허한다.

- ```.requestMatchers("/basic").permitAll()``` : ```/basic``` 요청에 대한 모든 접근을 허용한다.

- ```.requestMatchers("/admin").hasAuthority("admin_enter")``` : <br>
  ```/admin```요청에 대한 모든 접근을 ```admin_enter```권한을 갖은 사용자에게만 허용한다.

- ```.requestMatchers(HttpMethod.GET,"/admin")``` : 다음과 같이 메소드 레벨로도 설정 가능.

<br>

<h2> test setup </h2>

```java

@SpringBootTest
public abstract class SecuritySetup {
  protected MockMvc mockMvc;

  protected AccessUser admin;

  protected AccessUser user;

  protected AccessUser guest;

  @BeforeEach
  public void setup(WebApplicationContext wac) {

    mockMvc = MockMvcBuilders
      .webAppContextSetup(wac)
      .apply(springSecurity())
      .build();

    admin = AccessUser.builder()
      .email("admin@gmail.com")
      .password("1q2w3e4r!")
      .build();

    user = AccessUser.builder()
      .email("user@gmail.com")
      .password("1q2w3e4r!")
      .build();

    guest = AccessUser.builder()
      .email("guest@gmail.com")
      .password("1q2w3e4r!")
      .build();

  }


  protected ResultActions accessLimitTestHelper(String endPoint, AccessUser accessUser, HttpMethod httpMethod) throws Exception {

    Assertions.assertNotNull(endPoint);
    Assertions.assertNotNull(accessUser);
    Assertions.assertNotNull(httpMethod);

    MockHttpServletRequestBuilder requestBuilder = null;

    switch (httpMethod.name()) {
      case "GET":
        requestBuilder = get(endPoint);
        break;
      case "POST":
        requestBuilder = post(endPoint);
        break;
      case "PATCH":
        requestBuilder = patch(endPoint);
        break;
      case "PUT":
        requestBuilder = put(endPoint);
        break;
      case "DELETE":
        requestBuilder = delete(endPoint);
        break;
      default:
        throw new IllegalArgumentException("지원되지 않는 HTTP 메소드입니다.");
    }

    // HTTP 기본 인증 및 헤더 추가
    requestBuilder
      .with(httpBasic(accessUser.getEmail(), accessUser.getPassword()));

    return mockMvc.perform(requestBuilder);
  }


  @Getter
  @Setter
  @Builder
  @AllArgsConstructor
  public static class AccessUser {
    private String email;
    private String password;
  }

}
```

<br>

<h2> 테스트 코드 </h2>

```java

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SecurityAccessLimitTest extends SecuritySetup {

  @Nested
  @Order(1)
  @DisplayName("admin test")
  class AdminTest {
    @Test
    @Order(1)
    void admin_get_pass() throws Exception {
      accessLimitTestHelper("/admin", admin, HttpMethod.GET).andExpect(status().isOk());
    }

    @Test
    @Order(2)
    void user_get_fail() throws Exception {
      accessLimitTestHelper("/user", admin, HttpMethod.POST).andExpect(status().isForbidden());
    }

    @Test
    @Order(3)
    void guest_get_fail() throws Exception {
      accessLimitTestHelper("/guest", admin, HttpMethod.PATCH).andExpect(status().isForbidden());
    }

    @Test
    @Order(4)
    void basic_get_pass() throws Exception {
      accessLimitTestHelper("/basic", admin, HttpMethod.PUT).andExpect(status().isOk());
    }
  }

  @Nested
  @Order(2)
  @DisplayName("user test")
  class UserTest {
    @Test
    @Order(1)
    void admin_get_fail() throws Exception {
      accessLimitTestHelper("/admin", user, HttpMethod.GET).andExpect(status().isForbidden());
    }

    @Test
    @Order(2)
    void user_get_pass() throws Exception {
      accessLimitTestHelper("/user", user, HttpMethod.POST).andExpect(status().isOk());
    }

    @Test
    @Order(3)
    void guest_get_fail() throws Exception {
      accessLimitTestHelper("/guest", user, HttpMethod.PATCH).andExpect(status().isForbidden());
    }

    @Test
    @Order(4)
    void basic_get_fail() throws Exception {
      accessLimitTestHelper("/basic", user, HttpMethod.PUT).andExpect(status().isOk());
    }
  }

  @Nested
  @Order(3)
  @DisplayName("guest test")
  class GuestTest {
    @Test
    @Order(1)
    void admin_get_fail() throws Exception {
      accessLimitTestHelper("/admin", guest, HttpMethod.GET).andExpect(status().isForbidden());
    }

    @Test
    @Order(2)
    void user_get_fail() throws Exception {
      accessLimitTestHelper("/user", guest, HttpMethod.POST).andExpect(status().isForbidden());
    }

    @Test
    @Order(3)
    void guest_get_pass() throws Exception {
      accessLimitTestHelper("/guest", guest, HttpMethod.PATCH).andExpect(status().isOk());
    }

    @Test
    @Order(4)
    void basic_get_pass() throws Exception {
      accessLimitTestHelper("/basic", guest, HttpMethod.PUT).andExpect(status().isOk());
    }
  }

}
```

![테스트_결과](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/b47a72ac-0a9d-4fe2-9d3c-daef468fa64f)
