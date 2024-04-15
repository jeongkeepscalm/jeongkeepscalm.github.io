---
title: Spring Redis
description: 스프링 레디스
date: 2024-02-07
categories: [ Spring, Redis ]
tags: [ back-end, spring, redis, docker redis, reflection, hSet, hGetAll ]
---

[정리 코드](https://github.com/AngryPig123/spring-redis/tree/java-redis-basic){:target="\_blank"}

> <h2> redis hash set </h2>

- ```<T> T hSet(String key, T t) throws ClassNotFoundException ```

```java

@Override
public <T> T hSet(String key, T t) throws ClassNotFoundException {
  long result = jedis.hset(key, hSetHelper(t));   //  hSet을 해주는 부분.
  if (result <= 0L) {
    return null;    //  저장이 안되면 null 반환
  } else {
    return t;   //  저장되면 t 반환
  }
}
```

<br>

> <h2> redis hash get all </h2>

- ``` public <T> T hGetAll(String key, Class<T> type) throws ClassNotFoundException ```

```java

@Override
public <T> T hGetAll(String key, Class<T> type) throws ClassNotFoundException {

  Map<String, String> stringStringMap = jedis.hgetAll(key);
  String classInfo = stringStringMap.get(CLASS_INFO);

  Class<T> aClass = (Class<T>) Class.forName(classInfo);

  T instance = null;

  try {
    Constructor<?>[] constructors = aClass.getDeclaredConstructors();

    for (Constructor<?> constructor : constructors) {
      if (stringStringMap.size() - 1 == constructor.getParameterTypes().length) {

        Class<?>[] paramTypes = constructor.getParameterTypes(); // 생성자의 매개변수 타입을 가져와야 함
        Object[] args = new Object[paramTypes.length];
        int index = 0;
        for (String paramName : stringStringMap.keySet()) {
          if (!paramName.equals(CLASS_INFO)) {
            args[index++] = stringStringMap.get(paramName); // 매개변수 값 설정
          }
        }
        instance = (T) constructor.newInstance(args); // 새로운 인스턴스 생성
        break; // 적절한 생성자를 찾았으므로 루프 종료
      }
    }

    if (instance == null) {
      return null;
    }

    for (Field field : aClass.getDeclaredFields()) {
      field.setAccessible(true);  //  접근 제한 해제
      String fieldName = field.getName();
      String mapValue = stringStringMap.get(fieldName);
      if (mapValue != null) {
        field.set(instance, mapValue);
      }
    }
  } catch (InstantiationException | IllegalAccessException | InvocationTargetException e) {
    log.error("exception = ", e);
    return null;
  }

  return instance;
}
```

<br>


> <h2> 도우미 메소드 </h2>

```java
    private <T> Map<String, String> hSetHelper(T t) {

  Map<String, String> setMap = new HashMap<>();
  setClassInfoToHash(t, setMap);

  Field[] fields = t.getClass().getDeclaredFields();
  for (Field field : fields) {
    try {
      field.setAccessible(true);
      Object value = field.get(t);
      setMap.put(field.getName(), value.toString());
    } catch (IllegalAccessException illegalAccessException) {
      log.error("illegalAccessError = ", illegalAccessException);
    }
  }
  return setMap;
}

//  전달받은 클래스 정보를 셋팅해주기 위한 메소드.
private <T> void setClassInfoToHash(T t, Map<String, String> setMap) {
  setMap.put(CLASS_INFO, t.getClass().toString().replace("class ", ""));
}
```

> 테스트를 위한 클래스 및 equals(Object o), hashCode() 메소드 셋팅

<br>

> <h2> UserInfo class </h2>

```java
@Getter
@Setter
@ToString
public class UserInfo {

  private String email;
  private String password;
  private String name;


  public UserInfo() {

  }

  @Builder
  public UserInfo(String email, String password, String name) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    UserInfo userInfo = (UserInfo) o;
    return Objects.equals(email, userInfo.email) && Objects.equals(password, userInfo.password) && Objects.equals(name, userInfo.name);
  }

  @Override
  public int hashCode() {
    return Objects.hash(email, password, name);
  }

}
```

<br>

> <h2> TestInfo class </h2>

```java
@Getter
@Setter
@ToString
public class TestInfo {

    private String val1;
    private String val2;

    public TestInfo() {
    }

    @Builder
    public TestInfo(String val1, String val2) {
        this.val1 = val1;
        this.val2 = val2;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TestInfo testInfo = (TestInfo) o;
        return Objects.equals(val1, testInfo.val1) && Objects.equals(val2, testInfo.val2);
    }

    @Override
    public int hashCode() {
        return Objects.hash(val1, val2);
    }

}
```

<br>

> <h2> 테스트 코드 </h2>

```java
@SpringBootTest
public class ReflectionTest {


    @Autowired
    MyRedisService myRedisService;

    @Test
    public void jedisTest() throws ClassNotFoundException {

        UserInfo userInfo =
                UserInfo.builder()
                        .name("홍길동")
                        .password("1q2w3e4r!")
                        .email("ghdrlfehd@gmail.com")
                        .build();

        TestInfo testInfo =
                TestInfo.builder()
                        .val1("val1")
                        .val2("val2")
                        .build();

        UserInfo saveUserInfo = myRedisService.hSet("user", userInfo);
        TestInfo saveTestInfo = myRedisService.hSet("test", testInfo);

        UserInfo findUser = myRedisService.hGetAll("user", UserInfo.class);
        TestInfo findTest = myRedisService.hGetAll("test", TestInfo.class);

        Assertions.assertEquals(saveUserInfo,findUser);
        Assertions.assertEquals(saveTestInfo,findTest);

    }

}
```

> 테스트 전 redis 상태
>>![before_redis](https://github.com/AngryPig123/angrypig123.github.io/assets/86225268/23f57138-c5a3-46e1-871a-d8d42ecf2f1f)

> 테스트 결과
>> ![after_redis](https://github.com/AngryPig123/angrypig123.github.io/assets/86225268/691aaba4-a234-44b2-a22a-9d875fbbb384)
>> ![after_redis](https://github.com/AngryPig123/angrypig123.github.io/assets/86225268/21cae7cf-fe28-473a-a758-e19c99729568)
