---
title: Spring Security, User Authentication
description: Spring Security
date: 2024-02-23T13:00:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, user authentication ]
---

- 사용자 인증 구현

[ENTITY_설계](https://angrypig123.github.io/posts/user_role_auth/){:target="\_blank"}

![erd](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/8faa7798-bc02-406a-b2d9-0f86dff0f209)

<h2>CustomUserDetails</h2>

- ```getAuthorities()``` : 접근한 사용자의 권한들을 가져오는 메소드.

```java

@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

  private final User user;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return user.getRole().getRoleAuths().stream()
      .map(a -> new SimpleGrantedAuthority(
        a.getAuth().getName()
      )).collect(Collectors.toList());
  }

  @Override
  public String getUsername() {
    return user.getEmail();
  }

  @Override
  public String getPassword() {
    return user.getPassword();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

}
```

<br>

<h2>JpaUserDetailsService</h2>

- ```SimpleGrantedAuthority``` : ```Spring security``` 가 기본 제공.
- 애플리케이션 사용자의 이름에 해당하는 사용자를 찾으면 위에서 만들었던 CustomUserDetails에 user인스턴스를 래핑해서 반환
  - ```UsernameNotFoundException``` : 사용자를 못찾으면 반환하는 에러.

```java

@Slf4j
@Service
@RequiredArgsConstructor
public class JpaUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Supplier<UsernameNotFoundException> usernameNotFoundExceptionSupplier = () -> new UsernameNotFoundException("problem during authentication!");
    User user = userRepository.findUserByEmail(email).orElseThrow(usernameNotFoundExceptionSupplier);
    log.info("JpaUserDetailsService user = {}", user);
    return new CustomUserDetails(user);
  }

}
```

<br>


<h2>AuthenticationProvider</h2>

- ```authenticate()``` 실제 인증이 진행하고 유저 토큰을 리턴

```java

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationProviderService implements AuthenticationProvider {

  private final JpaUserDetailsService jpaUserDetailsService;

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {

    String email = authentication.getName();
    UserDetails userDetails = jpaUserDetailsService.loadUserByUsername(email);

    log.info("authentication provider service userDetails = {}", userDetails.getUsername());
    log.info("authentication provider service userDetails = {}", userDetails.getPassword());
    log.info("authentication provider service userDetails = {}", userDetails.getAuthorities());

    return new UsernamePasswordAuthenticationToken(
      userDetails.getUsername(),
      userDetails.getPassword(),
      userDetails.getAuthorities()
    );

  }

  @Override
  public boolean supports(Class<?> authentication) {
    return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
  }

}
```

- ```JpaUserDetailsService```해당 서비스를 이미 ```@Bean```으로 등록하고 있기 때문에 <br>
  ```SecurityConfiguration```에 추가설정 불필요.

<br>


<h2>Exception</h2>

- 이미 저장되어 있는 유저 정보로 로그인 시도 ⇒ 공포의 no_session 예외 발생

![no_session](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/a342ee85-e050-4ddb-ae6d-f6f798923ece)

- 영속성 유지를 위해 ```AuthenticationProviderService```클래스의 ```authenticate``` 메소드에 ```@Transaction``` 설정

![success](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/3c161773-12b1-4db2-8e0b-3df1801481b5)

역할, 권한에 따른 접근 제한은 나중에....
