---
title: Spring, Openfeign(1)
description: Spring Openfeign
date: 2024-02-27T23:00:000
categories: [ Spring, Openfeign ]
tags: [ back-end, spring, open feign ]
---

[otp_part_1](https://angrypig123.github.io/posts/security_otp(1)/){:target="\_blank"}

<h2> open feign </h2>

- ```openfeign``` : ```netflix```에서 개발한 서버끼리 ```rest api```를 할때 사용 더 편하게 호출할 수 있게해줌.

- 해당 서비스를 가지고 인증 서버에 요청을 보내는 서비스 구현

<br>

<h2> openfeign implements </h2>

- ```implements```로 ```org.springframework.cloud:spring-cloud-starter-openfeign``` 해당 의존성을 땡겨오면 안됨
  - 추가적으로 ```ext{}``` 부분과 ```dependencyManagement``` 부분을 같이 떙겨 와야함.
  - ```openfeign```라이브러리 자체가 ```spring cloud``` 에 붙어있는 기술이라 해당 라이브러리만 땡겨오기 위한 설정으로 추정

```text
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.3'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'org.spring.example'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '17'
}

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

ext {
    set('springCloudVersion', "2023.0.0")
}

dependencies {
    //  ...

    implementation 'org.springframework.cloud:spring-cloud-starter-openfeign'

    //  ...
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
    }
}

tasks.named('test') {
    //  ...
}

```

<br>

- ```open feign```로 ```gateway``` 서비스를 구성하려면 ```@FeignClient``` 구성 필요.
  - ```configuration```을 따로 설정할 수 있으나 해당 프로젝트에서는 불필요함으로 패스


- ```OtpAuthenticationGateWay```
  - ```@FeignClient``` name 설정은 중요치 않고 ```url```은 호출할 대상이 되는 호스트 ```url``` 해당 서비스 에서는 <br>
    ```otp```인증을 관리하는 서버

```java

@FeignClient(name = "otp", url = "${auth.otp}")
public interface OtpAuthenticationGateWay {
  @PostMapping(path = "/user/add")
  void userAdd(User.OtpUser otpUser);

  @PostMapping(path = "/user/auth")
  String userAuth(User.OtpUser otpUser);

  @PostMapping(path = "/otp/check")
  void otpCheck(User.Otp otp);
}
```

<br>

<h2> OtpFeignClientService </h2>

- ```gateway```를 직접 호출하는건 위험하다 판단되어 서비스로 만들어서 사용

- 인증 서버에서 호출할 ```end point``` 마다 서비스 구성


- service

```java
public interface OtpFeignClientService {
  boolean userAdd(User user);

  String userAuth(User user);

  boolean otpCheck(User user);
}
```

- implements

```java

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpFeignClientServiceImpl implements OtpFeignClientService {

  private final OtpAuthenticationGateWay gateWay;

  @Override
  public boolean userAdd(User user) {
    try {
      gateWay.userAdd(user.toOtpUser());
      return true;
    } catch (HttpClientErrorException | HttpServerErrorException e) {
      log.error("Failed to get resource = ", e);
      return false;
    }
  }

  @Override
  public String userAuth(User user) {
    try {
      return gateWay.userAuth(user.toOtpUser());
    } catch (HttpClientErrorException | HttpServerErrorException e) {
      log.error("Failed to get resource = ", e);
      throw e;
    }
  }

  @Override
  public boolean otpCheck(User user) {
    try {
      gateWay.otpCheck(user.toOtp());
      return true;
    } catch (HttpClientErrorException | HttpServerErrorException e) {
      log.error("Failed to get resource = ", e);
      return false;
    }
  }

}
```

<br>

<h2> EnableFeignClients </h2>

- ```service implements``` 부분을 보면 어디에서도 ```gateway```기능을 ```@Bean```등록을 해주는게 <br>
  없음 해당 문제를 해결하기 위한 설정 필요
  - 진입 ```entry point```에 ```@EnableFeignClients``` 설정을 해주면 자동으로 빈주입을 해준다.

```java

@EnableFeignClients
@SpringBootApplication  //  요녀석이 붙어있는 클래스를 entry point 라고 한다.
public class SpringSecurityBusinessApplication {

  public static void main(String[] args) {
    SpringApplication.run(SpringSecurityBusinessApplication.class, args);
  }

}

```

<br>

<h2> 테스트 </h2>

- 테스트 방식
  - 로컬에 인증 서버를 띄워놓음.
  - 비지니스 서버에서 테스트 진행


- User 객체 안에 요청을 보낼 수 있는 ```req```로 변환해주는 코드 작성

```java

@Setter
@Getter
@NoArgsConstructor
public class User {

  private String username;
  private String password;
  private String code;

  @Builder
  public User(String username, String password, String code) {
    this.username = username;
    this.password = password;
    this.code = code;
  }

  public OtpUser toOtpUser() {
    return OtpUser.builder()
      .username(username)
      .password(password)
      .build();
  }

  public Otp toOtp() {
    return Otp.builder()
      .username(username)
      .code(code)
      .build();
  }

  @Setter
  @Getter
  @NoArgsConstructor
  public static class OtpUser {
    private String username;
    private String password;

    @Builder
    public OtpUser(String username, String password) {
      this.username = username;
      this.password = password;
    }
  }

  @Setter
  @Getter
  @NoArgsConstructor
  public static class Otp {
    private String username;
    private String code;

    @Builder
    public Otp(String username, String code) {
      this.username = username;
      this.code = code;
    }
  }

}
```

<br>

- 1 ] 비지니스 서버에서 사용되는 ```user``` 전역으로 선언 해당 객체는 테스트 클래스가 종료 될때까지 유지된다.
- 2 ] ```userAdd()``` 검증
- 3 ] ```userAuth()``` 검증 및 ```user```객체에 ```otp code```설정
- 4 ] ```otpAuth()``` 메소드를 실행해서 해당 ```otp```가 유효 한지 검증

```java

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class OtpAuthenticationTest {

  @Autowired
  private OtpFeignClientService otpFeignClientService;
  private static User user;

  @BeforeAll
  static void setup() {
    user = User.builder()
      .username("first_tester")
      .password("1q2w3e4r!")
      .code("")
      .build();
  }

  @Test
  @Order(1)
  void otp_feign_client_service_user_add_test() {
    boolean b = otpFeignClientService.userAdd(user);
    Assertions.assertTrue(b);
  }

  @Test
  @Order(2)
  void otp_feign_client_service_user_auth_test() {
    String code = otpFeignClientService.userAuth(user);
    Assertions.assertNotNull(code);
    user.setCode(code);
  }

  @Test
  @Order(3)
  void otp_feign_client_service_otp_auth_test() {
    boolean b = otpFeignClientService.otpCheck(user);
    Assertions.assertTrue(b);
  }

}
```

- 실행 결과

![open_feign_test](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/30e93359-63f3-4fc7-84db-cf42c4064ee0)


- 인증 서버 콘솔 확인

![authentication_server](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/7d7254a8-f707-415d-96e8-9dba0ee0ad91)

