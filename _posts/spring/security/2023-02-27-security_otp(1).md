---
title: Spring Security, Spring Security Otp(1)
description: Spring Security
date: 2024-02-27T16:40:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, spring security otp ]
---

- ```Spring Security``` 를 이용한 ```OTP``` 인증 구현.
  - 구성
    - ```클라이언트``` : 백엔드 서버에 요청을 보내는 주체 (테스트 코드로 대체 한다.)
    - ```인증서버``` : 사용자 자격을 증명하고 인증 토큰을 DB에서 조회(추후 SNS 서비스로 확장 가능)
    - ```비지니스 논리 서버``` : 노출될 API를 제공하는 애플리케이션 서버
      - ```JWT``` : ```Json Web Token``` 으로 토큰을 구성한다.


- ```클라이언트``` ⇒ ```비지니스 논리 서버``` ⇒ ```인증서버``` ⇒ ```Database```
  - 나중에는 인증 서버가 클라이언트에 ```SNS``` 메세지를 보내고 해당 메세지를 통해 비지니스 서버에서 인증 처리<br>
    유효한 ```OTP```정보면 클라이언트에 ```TOKEN```을 발급한다.

<br>

<h2> 인증 서버 Entity </h2>

- User Entity

```java

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

  @Id
  @Column(name = "username")
  private String username;

  @Setter
  @Column(name = "password")
  private String password;

  @Builder
  public User(String username, String password) {
    this.username = username;
    this.password = password;
  }

}
```

- Otp Entity

```java

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Otp {

  @Id
  @Column(name = "username")
  private String username;

  @Setter
  @Column(name = "code")
  private String code;

  @Builder
  public Otp(String username, String code) {
    this.username = username;
    this.code = code;
  }

}
```

<br>

<h2> 인증 서버 Repository </h2>

```java
public interface UserRepository extends JpaRepository<User, String> {
  Optional<User> findUserByUsername(String username);
}

public interface OtpRepository extends JpaRepository<Otp, String> {
  Optional<Otp> findOtpByUsername(String username);
}
```

<br>

<h2> 인증 서버 Service </h2>

- Service

```java
public interface UserService {
  void addUser(User user);

  String auth(User user);

  boolean check(Otp otpToValidate);
}
```

- ServiceImpl

```java

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final OtpRepository otpRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void addUser(User user) {
    user.setPassword(passwordEncoded(user));
    userRepository.save(user);
  }

  @Override
  public String auth(User user) {
    User findUser = userRepository.findUserByUsername(user.getUsername()).orElseThrow(() -> badCredentials().get());
    log.info("findUser = {}", findUser.getUsername());
    log.info("findUser = {}", findUser.getPassword());
    if (passwordEncoder.matches(user.getPassword(), findUser.getPassword())) {
      return renewOtp(findUser);
    } else {
//            throw badCredentials().get();
      return null;
    }
  }

  @Override
  public boolean check(Otp otpToValidate) {
    Optional<Otp> findOtp = otpRepository.findOtpByUsername(otpToValidate.getUsername());
    if (findOtp.isPresent()) {
      Otp otp = findOtp.get();
      return otpToValidate.getCode().equals(otp.getCode());
    }
    return false;
  }

  private Supplier<BadCredentialsException> badCredentials() {
    throw new BadCredentialsException("not found user. checked username or password");
  }

  private String passwordEncoded(User user) {
    return passwordEncoder.encode(user.getPassword());
  }

  private String renewOtp(User findUser) {
    String code = GenerateCodeUtil.generateCode();
    Optional<Otp> findOtp = otpRepository.findOtpByUsername(findUser.getUsername());

    if (findOtp.isPresent()) {
      Otp otp = findOtp.get();
      otp.setCode(code);
    } else {
      Otp otp = Otp.builder()
        .username(findUser.getUsername())
        .code(code)
        .build();
      otpRepository.save(otp);
    }
    return code;
  }

  private static final class GenerateCodeUtil {
    public GenerateCodeUtil() {
    }

    private static String generateCode() {
      String code = null;
      try {
        SecureRandom random = SecureRandom.getInstanceStrong(); //  난수 생성 방식이 예측하기 어려워서 보안적으로 유리하다.
        int c = random.nextInt(9000) + 1000;
        code = String.valueOf(c);
      } catch (NoSuchAlgorithmException noSuchAlgorithmException) {
        log.error("noSuchAlgorithmException = ", noSuchAlgorithmException);
      }
      return code;
    }
  }

}
```

<br>

<h2> 인증 서버 Controller </h2>

```java

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthController {

  private final UserService userService;

  @PostMapping(path = "/user/add")
  public ResponseEntity<Void> addUser(@RequestBody User user) {
    userService.addUser(user);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PostMapping(path = "/user/auth")
  public String auth(@RequestBody User user) {
    String otpCode = userService.auth(user);
    log.info("otp code = {}", otpCode);
    return otpCode;
  }   //  ToDO otp code 를 response 한다.

  @PostMapping(path = "/otp/check")
  public ResponseEntity<Void> check(@RequestBody Otp otp) {

    if (userService.check(otp)) {
      return new ResponseEntity<>(HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

  }

  @Getter
  @Setter
  @NoArgsConstructor
  public static class RequestBodyContainer<T> {
    private T requestBodyData;

    public RequestBodyContainer(T requestBodyData) {
      this.requestBodyData = requestBodyData;
    }
  }

}
```

<br>

<h2> 인증 서버 Security Configuration </h2>


```java
@Slf4j
@Configuration
@RequiredArgsConstructor
public class ProjectConfig {

    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((requests) -> requests
                        .anyRequest().permitAll()
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}

```

<br>

<h2> 인증 서버 테스트 코드 </h2>

- 테스트를 진행할때 전체 흐름을 확인해야 함으로 ```@Rollback(value = false)``` 설정 <br>
  데이터 초기화를 ```schema.sql```를 통한 초기화 진행


- ```application.yaml```
  - ```spring.sql.init.mode= always``` : 해당 부분을 설정하면 ```resources``` <br>
    폴더 아래에 ```schema.sql```파일을 프로젝트 실행할때 먼저 실행한다.

```text
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/otp_auth
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: true
    open-in-view: false
  sql:
    init:
      mode: always
server:
  port: 8522
```

- ```schema.sql```

```text
CREATE DATABASE IF NOT EXISTS `otp_auth`;   #

CREATE TABLE IF NOT EXISTS `user`
(
    `password` varchar(255) DEFAULT NULL,
    `username` varchar(255) NOT NULL,
    PRIMARY KEY (`username`)
);

CREATE TABLE IF NOT EXISTS `otp`
(
    `code`     varchar(255) DEFAULT NULL,
    `username` varchar(255) NOT NULL,
    PRIMARY KEY (`username`)
);

DELETE
FROM `otp_auth`.`user`;

DELETE
FROM `otp_auth`.`otp`;
```


- 테스트 코드

```java
@SpringBootTest
@AutoConfigureMockMvc
@Rollback(value = false)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OtpRepository otpRepository;

    private User user;

    @BeforeEach
    void setup(WebApplicationContext wac) {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).apply(springSecurity()).build();
        user = User.builder()
                .username("first_tester")
                .password("1q2w3e4r!")
                .build();
    }


    @Test
    @Order(1)
    void addUser() throws Exception {
        mockMvc.perform(
                        post("/user/add")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(user))
                )
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    @Order(2)
    void auth() throws Exception {
        mockMvc.perform(
                        post("/user/auth")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(user))
                )
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    @Order(3)
    void check_validate_happy() throws Exception {
        Otp otp = findOtpHelper();
        ResultActions perform = mockMvc.perform(
                post("/otp/check")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(otp))
        );
        perform.andExpect(status().isOk());
    }

    @Test
    @Order(4)
    void check_validate_sad() throws Exception {
        Otp otp = findOtpHelper();
        otp.setCode("FAIL_CODE");
        ResultActions perform = mockMvc.perform(
                post("/otp/check")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(otp))
        );
        perform.andExpect(status().isForbidden());

    }

    private Otp findOtpHelper() {
        Optional<Otp> findOtp = otpRepository.findOtpByUsername(user.getUsername());
        Assertions.assertNotEquals(Optional.empty(), findOtp);
        return findOtp.orElse(null);
    }

}
```

![otp_auth_test_code](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/77587751-f268-4d5b-bedb-9ad4086b35d0)

- ToDo : 비니지스 논리 서버 구현
