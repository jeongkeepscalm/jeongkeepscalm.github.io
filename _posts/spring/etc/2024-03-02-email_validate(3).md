---
title: Spring, 이메일 인증 회원가입(3).
description: 기초 데이터 설정 및 이메일 서비스 연동
date: 2024-03-03T15:01:000
categories: [ Spring ]
tags: [ back-end, spring, email sender ]
---

[이메일_인증_회원가입(2)](https://angrypig123.github.io/posts/email_validate(1)/){:target="\_blank"}

- 이번에 할것
  - Email 서비스 연동
  - 데이터 생성 API 만들기
  - 유저 권한 부여 API 만들기
  - ```POST MAN``` 문서 작성 틀 잡기
  - ```spring doc``` 설정

<br>

<h2> Email 서비스 연동 </h2>

- 회원가입시 이메일로 특정 키값을 보내고 해당 키를 인증하면 회원가입이 최종적으로 완료 되게 하는 서비스 구성
  - [발신_주체_설정_참고_포스팅](https://velog.io/@tjddus0302/Spring-Boot-%EB%A9%94%EC%9D%BC-%EB%B0%9C%EC%86%A1-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-Gmail){:
    target="\_blank"}


- google-email 설정 부분만 참고하고 나머지 기능설정은 다르게 진행
  - application.properties 를 이용한 구성을 분리하여 직접 ```@Bean```으로 등록

```java

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ProjectConfig {

  @Value("${spring.mail.service.username}")
  private String USER_NAME;

  @Value("${spring.mail.service.password}")
  private String PASSWORD;

  @Bean
  public JavaMailSender javaMailSender() {
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setHost("smtp.gmail.com");
    mailSender.setPort(587);
    mailSender.setUsername(USER_NAME);
    mailSender.setPassword(PASSWORD);
    mailSender.getJavaMailProperties().put("mail.smtp.starttls.enable", "true");
    return mailSender;
  }

}
```

<br>

<h2> 작업시 필요한 데이터를 생성하기 위한 엔드 포인트 생성 </h2>

- 유저 생성 API
- 역할 생성 API
- 권한 생성 API
- 유저에게 역할을 부여하는 API
- 역할에 권한들을 부여하는 API

<br>

<h2> 데이터 생성 API </h2>

- 단순 데이터 생성
  - ```insertUser(@RequestParam("size") int size)```
    - 입력받은 사이즈만큼 ```User``` 데이터를 생성하고 생성된 ```User``` 리스트를 ```UserDto```로 반환해서 리턴
  - ```insertRoles(@RequestBody RequestBodyContainer<List<String>> roleNameList)```
    - 역할 이름을 문자열 형태의 리스트로 입력받고 생성된 ```Roles``` 리스트를 그대로 리턴
      - ToDo 추후 ```RolesDto```를 반환하는것으로 수정
  - ```insertAuthority(@RequestBody List<AuthorityDto> authorityList)```
    - 권한 목록을 입력받고 생성된 ```Authority``` 리스트를 그대로 리턴
      - ToDo 추후 ```AuthorityDto```를 반환하는것으로 수정

```java

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/init-data")
public class InitDataController {

  private final CommonUtilService commonUtilService;

  @GetMapping(path = "/insert-users")
  public List<UserDto> insertUser(@RequestParam("size") int size) {
    List<User> userList = commonUtilService.insertRandomUser(size);
    log.info("init-data controller user list = {}", userList);
    return userList.stream().map(User::toDto).collect(Collectors.toList());
  }

  @PostMapping(path = "/insert-roles")
  public List<Roles> insertRoles(@RequestBody RequestBodyContainer<List<String>> roleNameList) {
    List<Roles> roles = commonUtilService.insertRole(roleNameList.getData());
    log.info("init-data controller roles list = {}", roles);
    return roles;
  }

  @PostMapping(path = "/insert-authorities")
  public List<Authority> insertAuthority(@RequestBody List<AuthorityDto> authorityList) {
    List<Authority> authorities = commonUtilService.insertAuthority(authorityList);
    log.info("init-data controller authorities = {}", authorities);
    return authorities;
  }


  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class RequestBodyContainer<T> {
    private T data;
  }

}
```

<h2> 유저 역할 부여 API </h2>

- 해당 ```API``` 는 추후 서비스에 필요한 로직이라 따로 분리
  - ```givePermissionToAUser(@RequestBody UserDto.GivePermission givePermission)```
    - 유저의 이메일과 권한의 이름을 입력받아 유저와 권한이 둘다 존재하면 유저에 역할 연결

```java

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/user")
public class UserController {

  private final UserService userService;

  @PostMapping(path = "/give-permission")
  public ResponseEntity<UserDto> givePermissionToAUser(@RequestBody UserDto.GivePermission givePermission) {
    UserDto userDto = userService.givePermissionToAUser(givePermission);
    return new ResponseEntity<>(userDto, HttpStatus.OK);
  }

}

```

- ```givePermissionToAUser()``` 구현체
  - ```User```를 직접 반환 하려고 하면 ```no-session```에러 발생 서비스단에서 리턴할 때에는 Dto로 변환하여 넘겨주자!

```java

@Override
public UserDto givePermissionToAUser(UserDto.GivePermission givePermission) {

  String userEmail = givePermission.getUserEmail();
  String roleName = givePermission.getRoleName();

  Optional<User> findUser = userRepository.findUserByUserEmail(userEmail);
  Optional<Roles> findRoles = rolesRepository.findRolesByRoleName(roleName);

  if (findUser.isPresent() && findRoles.isPresent()) {
    User user = findUser.get();
    Roles role = findRoles.get();
    user.setRoles(role);
    User result = userRepository.save(user);
    log.info("result = {}", result);
    return result.toDto();
  } else {
    return null;    //  ToDO 예외 처리 부분을 구체화 한다.
  }

}
```

<br>

<h2> POST MAN </h2>

- 문서 구성
  - ToDO : happy, sad 케이스에 대한 폴더를 구분하여 문서화한다.

![post_man](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/b4d63b4e-0046-469a-8a8d-28b6f3292e47)

<br>

<h2> spring docs 설정 </h2>

- ```implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2'``` 해당 의존성 추가

- 스프링 시큐리티를 활성화했음으로 ```spring docs```에서 지원하는 리소스를 ```permitAll()```해야함. 추가적으로 ```ignoreing()```에도 추가
  - ToDO : ```swagger```를 통해 ```API```에 디테일한 설정을 추가해보자

- SecurityConfig 코드

```java

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

  private final CustomAuthenticationProvider customAuthenticationProvider;

  private static final String[] AUTH_WHITELIST = {
    "/api/**", "/swagger-ui/**", "/api-docs", "/swagger-ui-custom.html",
    "/v3/api-docs/**", "/api-docs/**", "/swagger-ui.html"
  };

  @Bean
  public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
    http
      .cors(AbstractHttpConfigurer::disable)
      .csrf(AbstractHttpConfigurer::disable)
      .authenticationProvider(customAuthenticationProvider)
      .authorizeHttpRequests(
        (requests) -> requests
          .requestMatchers(AUTH_WHITELIST).permitAll()
          .requestMatchers("/api/v*/**").permitAll()
          .anyRequest().permitAll()
      )
      .formLogin(withDefaults())
      .httpBasic(withDefaults());
    return http.build();
  }

  @Bean
  public WebSecurityCustomizer webSecurityCustomizer() {
    return (web) -> web.ignoring().requestMatchers(AUTH_WHITELIST);
  }

}
```

![swagger_ui](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/50e6501b-9f7f-492a-82f9-1293767d1035)

- 다음에 할것
  - 역할_권한 중간 테이블에 데이터 넣는 ```API```추가
  - 토큰 인증 화면 구성(사용자에게 보내지는 메일을 꾸며주는 템플릿)
  - ```email-token```관련 ```Entity```추가 및  ```security``` 인증 로직 수정
