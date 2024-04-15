---
title: JedisPool Bean 등록 에러
description: 제디스 커넥션 풀 설정 등록
date: 2024-02-07
categories: [ Exception, Spring Jedis ]
tags: [ spring framework, bean registration, jedis pool, MXbean already ]    # TAG는 반드시 소문자로 이루어져야함!
---

> <h2> jedis bean 등록 이후 connection pool 설정을 하려했을때 발생한 문제 </h2>

[이전에 설정했던 jedis bean](https://angrypig123.github.io/posts/spring_jedis/)

<br>

> <h2> 문제가된 코드 </h2>
>>  문제가된 Bean : @Bean("myJedisPool")

```java

@Slf4j
@Configuration
public class MyRedisConfig {

  @Value("${data.redis.host}")
  private String HOST;

  @Value("${data.redis.port}")
  private int PORT;

  @Value("${data.redis.maxTotal}")
  private int MAX_TOTAL;

  @Value("${data.redis.maxIdle}")
  private int MAX_IDLE;

  @Value("${data.redis.minIdle}")
  private int MIN_IDLE;

  @Value("${data.redis.maxWaitMillis}")
  private long MAX_WAIT_MILLIS;

  @Bean("myJedisPool")
  public JedisPool myJedisPool() {
    JedisPoolConfig poolConfig = new JedisPoolConfig();
    poolConfig.setMaxTotal(MAX_TOTAL);
    poolConfig.setMaxIdle(MAX_IDLE);
    poolConfig.setMinIdle(MIN_IDLE);
    poolConfig.setMaxWaitMillis(MAX_WAIT_MILLIS);

    try {
      return new JedisPool(poolConfig, HOST, PORT);
    } catch (Exception e) {
      log.error("Error initializing Jedis pool", e);
      return null;
    }
  }

  @Bean
  public Jedis jedis(@Qualifier("myJedisPool") JedisPool jedisPool) {
    try (
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

<br>

```text
Caused by: javax.management.InstanceAlreadyExistsException: MXBean already registered with name org.apache.commons.pool2:type=GenericObjectPool,name=pool
	at java.management/com.sun.jmx.mbeanserver.MXBeanLookup.addReference(MXBeanLookup.java:152) ~[na:na]
	at java.management/com.sun.jmx.mbeanserver.MXBeanSupport.register(MXBeanSupport.java:160) ~[na:na]
	at java.management/com.sun.jmx.mbeanserver.MBeanSupport.preRegister2(MBeanSupport.java:173) ~[na:na]
	at java.management/com.sun.jmx.interceptor.DefaultMBeanServerInterceptor.registerDynamicMBean(DefaultMBeanServerInterceptor.java:924) ~[na:na]
	at java.management/com.sun.jmx.interceptor.DefaultMBeanServerInterceptor.registerObject(DefaultMBeanServerInterceptor.java:895) ~[na:na]
	at java.management/com.sun.jmx.interceptor.DefaultMBeanServerInterceptor.registerMBean(DefaultMBeanServerInterceptor.java:320) ~[na:na]
	at java.management/com.sun.jmx.mbeanserver.JmxMBeanServer.registerMBean(JmxMBeanServer.java:523) ~[na:na]
	at org.springframework.jmx.support.MBeanRegistrationSupport.doRegister(MBeanRegistrationSupport.java:138) ~[spring-context-6.1.3.jar:6.1.3]
	at org.springframework.jmx.export.MBeanExporter.registerBeanInstance(MBeanExporter.java:687) ~[spring-context-6.1.3.jar:6.1.3]
	at org.springframework.jmx.export.MBeanExporter.registerBeanNameOrInstance(MBeanExporter.java:631) ~[spring-context-6.1.3.jar:6.1.3]
	... 14 common frames omitted
```

<br>

> 어떤 이유인지는 몰라도 해당 부분에서 MXbean에 이미 등록되었다고 나옴
> 실제로 디버깅을 해보니 multiname이 null 로 들어가 발생

![image](https://github.com/AngryPig123/angrypig123.github.io/assets/86225268/2462161d-c456-4760-abe5-91b43706d63b)

<br>

> 해결 방법 : 여러 사이트를 돌아다니면서 테스트를 해보았으나 <br>
> 결국, JMX를 이용한 JedisPool 모니터링을 포기하고 해당 코드 추가 : poolConfig.setJmxEnabled(false);

```java

@Bean("myJedisPool")
public JedisPool myJedisPool() {
  JedisPoolConfig poolConfig = new JedisPoolConfig();
  poolConfig.setJmxEnabled(false);
  poolConfig.setMaxTotal(MAX_TOTAL);
  poolConfig.setMaxIdle(MAX_IDLE);
  poolConfig.setMinIdle(MIN_IDLE);
  poolConfig.setMaxWaitMillis(MAX_WAIT_MILLIS);

  try {
    return new JedisPool(poolConfig, HOST, PORT);
  } catch (Exception e) {
    log.error("Error initializing Jedis pool", e);
    return null;
  }
}
```

<br>

> 실행 확인
![빌드확인](https://github.com/AngryPig123/angrypig123.github.io/assets/86225268/05cfe0e4-f3b4-409a-9819-69de6fbe417f)
