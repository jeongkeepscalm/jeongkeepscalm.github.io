---
title: Reflection
description: 자바 제디스, 리플렉션
date: 2024-02-06
categories: [ Java, Reflection ]
tags: [ java, reflection, redis, jedis, spring ]
---

> 런타임 시점에 구체적인 클래스 타입을 몰라도, 해당 클래스의 정보를 알 수 있는 자바 기능
> - Jedis를 사용하여 HSET 기능을 구현하려 할때 DTO를 직접 넣지 못하고 <br>
    > key : value를 직접 설정해야하는 번거러움이 있어서 해당 문제를 해결하려 학습.
    >
- ![REDIS_HSET](https://github.com/AngryPig123/angrypig123.github.io/assets/86225268/0aec1c14-f5f5-406b-b3f3-d23754016a7a)
>


<br>

> <h2> 구현할 interface 구성 </h2>

```java
public interface MyRedisService {

  <T> T hGetAll(String key);  //  hash 에 모든 정보를 가져온다.

  <F> F hGet(String key, String hashKey, Class<F> uClass);    //  hash 안에 특정 필드를 가져온다
}
```

<br>

> <h2> 구현할 구현체 구성 </h2>

```java

@Slf4j
@Component
@RequiredArgsConstructor
public class MyRedisServiceImpl implements MyRedisService {

  private final Jedis jedis;

  @Override
  public <T> T hSet(String key, T t) {
    return t;
  }

  @Override
  public <T> T hGetAll(String key) {
    return null;
  }

  @Override
  public <F> F hGet(String key, String hashKey, Class<F> uClass) {
    return null;
  }

  private <T> void hSetHelper(T t) {
    //  리플렉션으로 t의 정보를 전부 가져온다.
    //  redis 에 insert 해준다.
  }

  private <T> T hGetAllHelper(String key) {
    //  key 로 hash 정보를 가져온다.
    //  리플렉션을 이용해 객체를 만들어 반환한다.
    return null;
  }

  private <F> F hGetHelper(String key, String hashKey, Class<F> fClass) {
    //  key값을 이용해 redis 에서 hash 정보를 가져온다
    //  가져온 값중에서 field 값을 가져온다
    return null;
  }

}
```

<br>

> <h2> Jedis @Bean 구성 </h2>

```java

@Slf4j
@Configuration
public class RedisConfig {

  @Value("${data.redis.host}")
  private String HOST;

  @Value("${data.redis.port}")
  private int PORT;

  @Bean
  public Jedis jedis() {
    try (
      JedisPool jedisPool = new JedisPool(HOST, PORT);
      Jedis jedis = jedisPool.getResource();
    ) {
      return jedis;
    } catch (JedisException jedisException) {
      log.error("jedis bean registration fail", jedisException);
      return null;
    }
  }

}

```
