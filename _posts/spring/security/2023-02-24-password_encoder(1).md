---
title: Spring Security, Password Encoder
description: Spring Security
date: 2024-02-24T21:00:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, password encoder ]
---

<h2> Password Encoder </h2>

- 실제 사용자의 ```password``` 정보는 암호화되어 저장되기 때문에 추가적인 검증 필요.

- ```AuthenticationProvider``` : ```UserDetailsService```와 ```PasswordEncoder```로 구성되어 있음.
  - ```UserDetailsService``` : 사용자 세부 정보 서비스
  - ```PasswordEncoder``` : 사용자 암호를 검증
    - ```BCryptPasswordEncoder``` 사용.

<br>

<h2> PasswordEncoder </h2>

- 의존성 추가

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
    //    ...
  }

  private HttpSecurity httpSecurity(HttpSecurity http) throws Exception {
    //    ...
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

}
```

<h2> AuthenticationProvider </h2>

```java

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationProviderService implements AuthenticationProvider {

  private final PasswordEncoder passwordEncoder;
  private final JpaUserDetailsService jpaUserDetailsService;

  @Override
  @Transactional
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {

    String email = authentication.getName();
    String password = authentication.getCredentials().toString();
    UserDetails userDetails = jpaUserDetailsService.loadUserByUsername(email);
    boolean passwordValidate = passwordEncoder.matches(password, userDetails.getPassword());

    if (passwordValidate) {
      return new UsernamePasswordAuthenticationToken(
        userDetails.getUsername(),
        userDetails.getPassword(),
        userDetails.getAuthorities()
      );
    } else {
      throw new BadCredentialsException("Something went wrong!");
    }

  }

  @Override
  public boolean supports(Class<?> authentication) {
    return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
  }

}
```

<br>

<h2> 테스트 </h2>


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

![password_encoder](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/f0da06fe-3e40-4879-bc36-b184ef2d00b1)
