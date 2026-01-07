---
title: "SpringBoot Basic"
description: "SpringBoot Basic"
date: 2025-12-20
categories: [ Spring, Spring Error Solution ]
tags: [ Spring, Spring Error Solution ]
---

## 1. JAR vs Fat JAR vs Spring Boot Executable JAR

애플리케이션 배포 시 라이브러리 처리 방식에 따라 JAR 형태가 달라짐.

| 구분 | 특징 | 장점 | 단점 및 한계 |
| :--- | :--- | :--- | :--- |
| **Normal JAR** | 작성한 코드(클래스)와 리소스만 포함 | 가볍고 구조가 단순함 | 외부 라이브러리 미포함으로 **단독 실행 불가** (classpath 별도 설정 필요) |
| **Fat JAR** | 코드와 모든 의존성 라이브러리를 **압축 해제하여 하나로 합침** | 단독 실행 가능 | 라이브러리 간 **파일명 중복 시 덮어쓰기 문제** 발생 가능, 내부 구조 확인 어려움 |
| **Spring Boot JAR** | **Executable JAR** 구조. 라이브러리를 압축 해제하지 않고 **JAR 파일 자체를 내부에 포함(Nesting)** | 단독 실행 가능, **파일명 중복 문제 완벽 해결**, 명확한 의존성 구조 | 스프링 부트 로더(JarLauncher)가 필요하여 실행 시 미세한 오버헤드 존재 |

> **핵심:** 일반적인 Fat JAR의 단점(파일 중복 등)을 해결하기 위해, 스프링 부트는 JAR 안에 JAR를 통째로 넣는 방식(Nested JAR)을 채택함.

## 2. 부트 클래스 (Main Class)

스프링 부트 애플리케이션의 진입점(Entry Point).

* **어노테이션 활용:** `@SpringBootApplication`을 통해 설정 자동화 시작.
* **컨테이너 생성:** `SpringApplication.run()` 메서드 실행 시 내부에서 **스프링 컨테이너** 생성.
* **내장 WAS 실행:** 별도 톰캣 설치 없이 내부에서 **내장 톰캣(Embedded Tomcat)** 생성 및 실행.

## 3. 라이브러리 버전 관리 (Dependency Management)

스프링 부트는 `dependency-management` 플러그인을 사용하여 라이브러리 간 호환성 문제 해결.

**build.gradle 설정 예시**

```groovy
plugins {
    id 'org.springframework.boot' version '3.0.2'
    id 'io.spring.dependency-management' version '1.1.0' // 버전 관리 플러그인
    id 'java'
}

dependencies {
    // 버전을 명시하지 않아도 플러그인이 권장 버전을 자동으로 매핑함
    implementation 'org.springframework.boot:spring-boot-starter-web'
}
```
> 개발자가 일일이 라이브러리 버전을 맞출 필요 없이, 스프링 부트가 검증한 버전 조합(BOM)을 자동으로 적용함.  

## 4. 자동 구성 (Auto Configuration)

스프링 부트의 가장 강력한 기능.  
애플리케이션 실행에 필요한 빈들을 자동으로 등록해 준다.  

### 주요 특징

* **자동 빈 등록:** `DataSource`, `JdbcTemplate`, `TransactionManager` 등 필수 빈 자동 생성 및 배치.
* **`@Conditional` (Spring Framework):** 특정 조건(메모리, 환경 변수 등)에 따라 빈 등록 여부 결정.
* **`@ConditionalOnProperty` (Spring Boot):** 설정 파일(`application.properties`)의 속성 값에 따라 편리하게 빈 등록 제어.

### 자동 구성 동작 원리 (Process)

스프링 부트 실행 시 자동 구성 동작 순서.  

1.  **`@SpringBootApplication`** 실행
2.  **`@EnableAutoConfiguration`** 활성화
3.  **`@Import(AutoConfigurationImportSelector.class)`** 호출
4.  **설정 정보 로드:**
    * `resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 파일 확인하여 자동 구성 목록 스캔.
5.  **컨테이너 등록:**
    * 선택된 설정 정보가 스프링 컨테이너에 빈으로 등록되어 사용 가능한 상태가 됨.

### 자동 구성의 활용

* 주로 회사 내부 공통 모듈이나 라이브러리를 만들어 배포할 때 사용.
* 라이브러리 추가만으로 복잡한 설정 없이 기능이 동작하도록 구성 가능.

## 5. 외부 설정 

### 외부 설정 방법 4가지

1. OS 환경 변수
2. 자바 시스템 속성( VM Options )
    - jar 로 빌드되어 있을 경우 실행시 <code>java -Durl=devdb -Dusername=dev_user -Dpassword=dev_pw -jar app.jar</code>
3. 자바 커멘드 라인 인수( main(args) 메소드 )
    - program arguments
    - jar 로 빌드되어 있을 경우 실행시 <code>java -jar project.jar var1 var2</code>
    - key value 형식은 -- 를 붙여서 적용한다.
    - e.g. -url=devdb --username=dev_user --password=dev_pw
4. 외부 파일(애플리케이션에서 특정 위치의 파일을 읽도록 한다.)

### 스프링 외부 설정 통합

<img src="/assets/img/kyh_java/ec2.png" width="600px" />

- `PropertySource`
    - 스프링은 로딩 시점에 필요한 PropertySource 들을 생성하고 Environment 에서 사용할 수 있게 연결해둔다. 
    - e.g. .properties, .yml 확장자
- `Environment`
    - 특정 외부 설정에 종속되지 않고 일관성 있게 key=value 형식의 외부 설정에 접근할 수 있다. 
    - PropertySource 들에 접근
    - 모든 외부 설정을 Environment 를 통해서 조회한다.
  
<img src="/assets/img/kyh_java/ec3.png" width="600px" />  

**두 개의 파일로 분리**  
- main/resoures 내 application-dev.properites, application-prod.properties 두 설정 파일 생성 
- spring.profiles.active 에 설정된 속성 값에 따라 dev 혹은 prod 를 참조한다.
- 실행 방법  
    - IDE 커맨드 라인 옵션 인수 실행(Program Arguments)
        - --spring.profiles.active=dev
    - IDE에서 자바 시스템 속성 실행(Vm Options)
        - -Dspring.profiles.active=dev
    - Jar 실행
        - ./gradlew clean build
        - build/libs 로 이동
        - java -Dspring.profiles.active=dev -jar external-0.0.1-SNAPSHOT.jar
        - java -jar external-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
    
***하나의 환경설정 파일 생성 후 논리적으로 영역 분리***  
- application.properties : `#---` , `!---`
- application.yml : `---`

```properties
url=local.db.com
username=local_user
password=local_pw

#---

spring.config.activate.on-profile=dev
url=dev.db.com
username=dev_user
password=dev_pw

#---

spring.config.activate.on-profile=prod
url=prod.db.com
username=prod_user
password=prod_pw
```
> 순차적으로 설정 파일을 읽는다.  

### 환경설정 파일 참조 방법  

1. Environment 객체에 접근
2. @Value 사용
3. @ConfigurationProperties
    - @EnableConfigurationProperties : @ConfigurationProperties 를 하나하나 직접 등록할 때 사용.
        - e.g. <code>@EnableConfigurationProperties(MyDataSourcePropertiesV1.class)</code>
    - @ConfigurationProperties 를 특정 범위로 자동 등록할 때는 @ConfigurationPropertiesScan 을 사용
        - e.g. <code>@ConfigurationPropertiesScan({ "com.example.app", "com.example.another" })</code>
    - 외부 설정의 계층을 객체로 표현 가능
    - 타입 오류 방지
    - 검증기 적용 가능 

<details>
<summary><span style="color:orange" class="point"><b>Source Code 1</b></span></summary>
<div markdown="1">

```properties
my.datasource.url=myLocal.db.com
my.datasource.username=myLocal_user
my.datasource.password=myLocal_pw
my.datasource.etc.max-connection=1
my.datasource.etc.timeout=3500ms
my.datasource.etc.options=CACHE,ADMIN
```

```java
@Getter
@ConfigurationProperties("my.datasource")
@Validated
public class MyDataSourcePropertiesV3 {

    @NotEmpty
    private String url;
    @NotEmpty
    private String username;
    @NotEmpty
    private String password;
    @Valid // 중첩 필드 유효성 검사 적용 (스프링 부트 3.4 이상 적용 필요)
    private Etc etc;
    public MyDataSourcePropertiesV3(String url, String username, String
            password, Etc etc) {
        this.url = url;
        this.username = username;
        this.password = password;
        this.etc = etc;
    }

    @Getter
    public static class Etc {
        @Min(1)
        @Max(999)
        private int maxConnection;
        @DurationMin(seconds = 1)
        @DurationMax(seconds = 60)
        private Duration timeout;
        private List<String> options;

        public Etc(int maxConnection, Duration timeout, List<String> options) {
            this.maxConnection = maxConnection;
            this.timeout = timeout;
            this.options = options;
        }
    }

}

@Slf4j
@EnableConfigurationProperties(MyDataSourcePropertiesV3.class)
public class MyDataSourceConfigV3 {
    private final MyDataSourcePropertiesV3 properties;

    public MyDataSourceConfigV3(MyDataSourcePropertiesV3 properties) {
        this.properties = properties;
    }

    @Bean
    public MyDataSource dataSource() {
        return new MyDataSource(
                properties.getUrl(),
                properties.getUsername(),
                properties.getPassword(),
                properties.getEtc().getMaxConnection(),
                properties.getEtc().getTimeout(),
                properties.getEtc().getOptions());
    }
}

@Import(MyDataSourceConfigV3.class)
@SpringBootApplication(scanBasePackages = "hello.datasource")
public class ExternalApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExternalApplication.class, args);
    }

}

```

</div>
</details>


<details>
<summary><span style="color:orange" class="point"><b>Profile</b></span></summary>
<div markdown="1">

```java
@Component
@RequiredArgsConstructor
public class OrderRunner implements ApplicationRunner {

    private final OrderService orderService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        orderService.order(1000);
    }
}

@Service
@RequiredArgsConstructor
public class OrderService {

    private final PayClient payClient;

    public void order(int money) {
        payClient.pay(money);
    }

}

@Slf4j
@Configuration
public class PayConfig {

    /**
     * @Profile : 해당 프로필이 활성화된 경우에만 빈을 등록한다.
     */

    @Bean
    @Profile("default")
    public LocalPayClient localPayClient() {
        log.info("LocalPayClient 빈 등록");
        return new LocalPayClient();
    }

    @Bean
    @Profile("prod")
    public ProdPayClient prodPayClient() {
        log.info("ProdPayClient 빈 등록");
        return new ProdPayClient();
    }

}
```

</div>
</details>