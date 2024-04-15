---
title: Spring Security, CorsConfiguration
description: Spring Security
date: 2024-02-21T15:15:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, cors ]
---

- User, Role, Auth 아래 참조.

[참조](https://angrypig123.github.io/posts/user_role_auth/){:target="\_blank"}

<br>

<h2> CorsConfigurer </h2>

- cors 공격을 막기 위해 CorsConfigurer 를 구현하여 적용시켜야함. cors가 뭘까?

<br>

- cors
  - http headers를 이용하여 요청을 제한하는것.
  - 요청을 제한하지 않고 모두 허용한다면 copy 사이트를 만들어 사용자의 로그인을 유도 악용할 수 있음.

<br>

- Access-Control-Allow-Origin: 요청이 허용되는 출처를 나타내는 헤더
- Access-Control-Allow-Methods: 허용되는 HTTP 메서드를 지정하는 헤더
- Access-Control-Allow-Headers: 허용되는 HTTP 헤더를 지정하는 헤더
- Access-Control-Allow-Credentials: 인증된 요청의 허용 여부를 나타내는 헤더
- Access-Control-Expose-Headers: 브라우저에 노출할 헤더를 지정하는 헤더

<br>

<h2> 구현 코드 </h2>

- Security 6.x.x 버전으로 올라오면서 설정 방식이 많이 바뀌었음으로 버전 확인 필요
  - Spring Boot Version : 3.2.2
  - Java Version : 17
  - Spring Security Version : 6.2.1

<br>

- CustomCorsConfig

```java

@Component
public class CustomCorsConfig implements CorsConfigurationSource {
  @Override
  public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
    CorsConfiguration corsConfiguration = new CorsConfiguration();
    corsConfiguration.setAllowedOrigins(Collections.singletonList("http://localhost:18231"));
    corsConfiguration.setAllowedMethods(Collections.singletonList("*"));
    corsConfiguration.setAllowCredentials(true);
    corsConfiguration.setAllowedHeaders(Collections.singletonList("*"));
    corsConfiguration.setMaxAge(3600L);
    return corsConfiguration;
  }

}
```

<br>

- SecurityFilterChain에 적용

```java

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AngrySecurityConfiguration {

  private final CustomCorsConfig customCorsConfig;

  @Bean
  public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
    http
      .cors((cors) -> cors.configurationSource(customCorsConfig))
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

<h2> 테스트 코드 작성 </h2>

- ```MockMvc```의 추가 설정을 통해 test 코드에서 security 테스트 진행 가능.

- security test 코드 기본 설정

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
```

- ```WebApplicationContext``` : MockMvc 추가 설정을 위해 필요.
- ```CustomCorsConfig``` : 내가 구성한 Cors 구성 정보를 로드하는데 필요.
- ```CorsConfiguration``` : 내가 구성한 Cors 구성 정보를 로드하는데 필요.
- ```MockHttpServletRequest``` : 내가 구성한 Cors 구성 정보를 로드하는데 필요.

<br>

- 왜 그런지는 모르겠으나 ```MockMvc``` 에서 ```perform``` 메소드를 이용하여 cors 테스트를 할시 <br>
  작동이 예상과 다르게됨. 찾아보니 ```options```를 이용하여 테스트를 해야 한다고함.<br>
  그래서 header 에 ```Access-Control-Request-Method``` 추가.
  - `Access-Control-Request-Method` : 브라우저가 서버로 보내는 사전 요청에서, 어떤 메서드를 사용할 것인지 서버에게 알리기 위해 사용
- 설정한 Cors 에서는 ```localhost:18231``` 에서 들어온 모든 요청을 요청 메소드 상관없이 허용
- 다른 호스트에서 요청할시 403 에러가 발생해야함.

```java
public class SecurityCorsTest extends SecuritySetup {

  @Test
  void get_basic_get_pass() throws Exception {
    mockMvc.perform(options("/basic")
        .header("Origin", corsConfiguration.getAllowedOrigins())
        .header("Access-Control-Request-Method", "GET")
      )
      .andExpect(status().isOk())
      .andDo(print());
  }

  @Test
  void get_basic_post_pass() throws Exception {
    mockMvc.perform(options("/basic")
        .header("Origin", corsConfiguration.getAllowedOrigins())
        .header("Access-Control-Request-Method", "POST")
      )
      .andExpect(status().isOk())
      .andDo(print());
  }

  @Test
  void get_basic_get_fail() throws Exception {
    mockMvc.perform(options("/basic")
        .header("Origin", "https://www.google.com")
        .header("Access-Control-Request-Method", "GET")
      )
      .andExpect(status().is4xxClientError())
      .andDo(print());
  }

  @Test
  void get_basic_post_fail() throws Exception {
    mockMvc.perform(options("/basic")
        .header("Origin", "https://www.google.com")
        .header("Access-Control-Request-Method", "POST")
      )
      .andExpect(status().is4xxClientError())
      .andDo(print());
  }

}
```

![cors_test](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/c8380cb3-455b-42ec-bda7-d4ef9aadfe59)
