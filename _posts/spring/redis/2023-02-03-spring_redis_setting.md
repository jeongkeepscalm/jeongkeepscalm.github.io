---
title: Spring Redis
description: 스프링 레디스
date: 2024-02-04
categories: [Spring, Redis]
tags: [back-end, spring, redis, docker redis]
---

[정리 코드](https://github.com/AngryPig123/spring-redis/tree/setting){:target="\_blank"}

> Spring Redis 연동하기


> 개발 환경 : Spring boot 3.2.2, java17


<h2> 의존성  </h2>

```text
  dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-redis'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
  }
```

<br>


> docker-redis 구축 : [docker redis 구축 방법](https://angrypig123.github.io/posts/Redis(1)/ "도커레디스"){:target="\_blank"}



<br>

> Spring boot application 설정 : 추후 환경 설정을 위해 설정 프로필을 분리 설정
> ```text
>  application.yaml 설정
>  spring:
>    profiles:
>     active: data
>
>  application-data.yaml 설정
>  data:
>    redis:
>      host: 127.0.0.1
>      port: 6379
>```

<br>

> RedisConfig 설정

```java
@Slf4j
@Configuration
public class RedisConfig {

    @Value("${data.redis.host}")
    private String HOST;

    @Value("${data.redis.port}")
    private int PORT;


    @Bean("sessionRedisConnectionsFactory")
    public RedisConnectionFactory sessionRedisConnectionsFactory() {
        return redisConnectionFactory(HOST, PORT);
    }

    @Bean("sessionRedisTemplate")
    public RedisTemplate<String, Object> sessionRedisTemplate() {
        return returnRedisTemplate(sessionRedisConnectionsFactory());
    }

    private RedisConnectionFactory redisConnectionFactory(final String host, final int port) {
        return new LettuceConnectionFactory(host, port);
    }

    private RedisTemplate<String, Object> returnRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        redisTemplate.setDefaultSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        return redisTemplate;
    }

}
```

<br>

> Spring Redis CrudRepository 구성

- 1 ] spring redis entity
- 2 ] spring redis repository
- 3 ] spring redis service
- 4 ] 서비스 테스트

<br>


<h2> spring redis entity </h2>

```java
@Getter
@Setter
@ToString
@NoArgsConstructor
@RedisHash(value = "user") // timeToLive 옵션으로 세션 타임 설정 가능
public class RedisUserSession {

    @Id //  RedisHash value 뒤에 붙는 해쉬값
    private String hash;

    private String userId;

    private String password;

    private LocalDateTime signIn;

    @Builder
    public RedisUserSession(String userId, String password) {
        this.userId = userId;
        this.password = password;
        this.signIn = LocalDateTime.now();
    }

}
```

<br>

<h2> spring redis repository </h2>

```java
import org.spring.redis.entity.redis.RedisUserSession;
import org.springframework.data.repository.CrudRepository;
public interface RedisUserSessionRepository extends CrudRepository<RedisUserSession, String> {
}
```

<br>

<h2> spring redis service </h2>

```java

public interface RedisUserSessionService {
    RedisUserSession saveRedisUserSession(RedisUserSession redisUserSession);
}

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisUserSessionServiceImpl implements RedisUserSessionService {
    private final RedisUserSessionRepository redisUserSessionRepository;
    @Override
    public RedisUserSession saveRedisUserSession(RedisUserSession redisUserSession) {
        RedisUserSession result = redisUserSessionRepository.save(redisUserSession);
        log.info("result = {}", result);
        return result;
    }
}
```

<br>

<h2> redis service test </h2>

```java
@SpringBootTest
public class RedisRepositoryTest {

    @Autowired
    RedisUserSessionService redisUserSessionService;

    @Test
    public void redis_user_session_set_test() {
        RedisUserSession redisUserSession = RedisUserSession.builder()
                .userId("홍길동")
                .password("1q2w3e4r!")
                .build();
        RedisUserSession session = redisUserSessionService.saveRedisUserSession(redisUserSession);
        Assertions.assertNotNull(session);
    }

}

```

<h2> 실행 전 redis 상태 </h2>

![실행 전](https://github.com/AngryPig123/angrypig123.github.io/assets/86225268/1a722de6-3af6-4c67-91c2-644091ef19a1)

<h2> 실행 후 redis 상태 </h2>

![실행 후](https://github.com/AngryPig123/angrypig123.github.io/assets/86225268/349166c2-9f56-49a1-8f30-105ba7f28138)

<h2> redis gui 로 본 내부 상태 </h2>

![내부 상태](https://github.com/AngryPig123/angrypig123.github.io/assets/86225268/fdd2bb2b-a1c9-486f-9723-a0888f2fd608)

> entity에 설정한 RedisHash value 값을 key, @Id값을 리스트로 저장하고,<br>
> value:@Id 를 key, 내부 필드를 value로 하는 HASH 형태로 저장한다. <br>

<h2> ToDO : Redis로 회원가입, 로그인, 로그아웃 기능 구현. </h2>
