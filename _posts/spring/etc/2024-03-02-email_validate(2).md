---
title: Spring, 이메일 인증 회원가입(2).
description: 기초 데이터 설정 및 이메일 서비스 연동
date: 2024-03-02T19:10:000
categories: [ Spring ]
tags: [ back-end, spring, email sender ]
---

[이메일_인증_회원가입(1)](https://angrypig123.github.io/posts/email_validate(1)/){:target="\_blank"}

- 이번에 할것
  - 기초 데이터 셋팅을 위한 유틸 서비스 구성

<br>

<h2>기초 데이터 셋팅을 위한 유틸 서비스 구성</h2>

- 프로젝트를 할때마다 기초 데이터를 셋팅하는것에 고민이 많아서 구성하게됨
  - 랜덤하게 유저를 생성해주는 ```API```가 있어서 ```openfeign```으로 호출 후 필요한 부분만 파싱해서 사용할 예정
    - 랜덤 유저 생성 api : https://randomuser.me/api/

<br>

<h2> 리스폰스 되는 데이터 확인 </h2>

- 아래와 같은 데이터 형태로 옴
  - 다음과 같이 여러 데이터를 제공해 주는데 주목해야할 부분은 ```results``` 부분이 ```List```로 되어있다는 것
    해당 부분을 유의해서 필요한 데이터를 파싱할 수 있도록 DTO 작성


- json 데이터

```text
{
"results":[
{
  "gender":"female",
  "name":{
    "title":"Miss",
    "first":"Kylie",
    "last":"Scott"
  },
  "location":{
    "street":{
      "number":5964,
      "name":"Dogwood Ave"
  },
  "city":"Bunbury",
  "state":"Victoria",
  "country":"Australia",
  "postcode":8739,
  "coordinates":{
    "latitude":"-83.5762",
    "longitude":"53.2443"
  },
  "timezone":{
    "offset":"+4:00",
    "description":"Abu Dhabi, Muscat, Baku, Tbilisi"
  }
  },
  "email":"kylie.scott@example.com",
  "login":{
    "uuid":"8d09923d-ffea-443a-ac90-3c8271b2a2af",
    "username":"angryelephant778",
    "password":"marjorie",
    "salt":"95PqnQiV",
    "md5":"12e6713e3800d265d0c0c2e4c33a1cee",
    "sha1":"9c0d12afd1b0fd10adf27ccfe9d1be63a5f52ab8",
    "sha256":"b3c6c90c745dc4a5fd14de8a4c7eb9a5a1e5dba88e1d3e2b2d5cd2bcda7a45d4"
  },
  "dob":{
    "date":"1974-05-06T08:34:53.563Z",
    "age":49
  },
  "registered":{
    "date":"2005-09-02T15:42:51.922Z",
    "age":18
  },
  "phone":"00-7161-6910",
  "cell":"0401-794-305",
  "id":{
    "name":"TFN",
    "value":"390761861"
  },
  "picture":{
    "large":"https://randomuser.me/api/portraits/women/42.jpg",
    "medium":"https://randomuser.me/api/portraits/med/women/42.jpg",
    "thumbnail":"https://randomuser.me/api/portraits/thumb/women/42.jpg"
  },
  "nat":"AU"
  }
],
  "info":{
    "seed":"294d6bf7956e1b52",
    "results":1,
    "page":1,
    "version":"1.4"
  }
}
```

- 파싱할 Dto

- 당장 필요하지 않아도 추후에 필요할거같은 필드들을 담아서 파싱.

```java

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RandomUserMe {
  private List<Result> results;

  @Getter
  @ToString
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Result {
    private String gender;
    private String email;
    private Name name;
    private Login login;
    private Picture picture;

    public UserDto toUserDto() {
      return UserDto.builder()
        .userEmail(email)
        .password(login.password)
        .build();
    }

    @Getter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    static class Name {
      private String title;
      private String first;
      private String last;
    }

    @Getter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    static class Login {
      private String uuid;
      private String username;
      private String password;
    }

    @Getter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    static class Picture {
      private String large;
      private String medium;
      private String thumbnail;
    }

  }
}
```

<br>

<h2> gateway </h2>


[openfeign_사용해보기](https://angrypig123.github.io/posts/spring_openfeign(1)/){:target="\_blank"}

- ```openfeign``` 구성
  - ```RandomUserMe makeRandomUser(@RequestParam("results") int result)```
    - 파라미터에 제공받을 리스트 사이즈를 명시하면 해당 사이즈만큼 리스트를 리턴해준다

```java

@FeignClient(name = "random-user-gateway", url = "https://randomuser.me/api/")
public interface RandomUserGateway {

  @GetMapping
  RandomUserMe makeRandomUser();

  @GetMapping
  RandomUserMe makeRandomUser(@RequestParam("results") int result);

}
```

- 해당 서비스를 공통 서비스로 빼기

```java
public interface CommonUtilService {
  RandomUserMe getRandomUser();
}

@Slf4j
@Component
@RequiredArgsConstructor
public class CommonUtilServiceImpl implements CommonUtilService {
  private final RandomUserGateway randomUserGateway;

  @Override
  public RandomUserMe getRandomUser() {
    RandomUserMe randomUserMe = randomUserGateway.makeRandomUser(10);
    log.info("randomUserMe = {}", randomUserMe);
    log.info("random user me size = {}", randomUserMe.getResults().size());
    return randomUserMe;
  }
}
```

<br>

<h2> 프로젝트 실행시 자동으로 insert 되게 설정</h2>

- ```spring``` 프로젝트를 빌드할때 모든 의존성이 설정된 후 초기 설정을 통해 유저 정도를 넣기 위한 작업
  - 해당 작업에는 크게 2가지 방법으로 할 수 있음
    - ```@PostConstruct```를 활용한 방법
    - ```CommandLineRunner```인터페이스를 구현하여 사용하는 방법
    - 클래스 레밸에서 관리하기가더 수월하게 하기 위해 두번째 방법으로 구성.

<br>

```java

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomRunnable implements CommandLineRunner {

  private final CommonUtilService commonUtilService;
  private final UserRepository userRepository;

  @Override
  public void run(String... args) throws Exception {
    List<RandomUserMe.Result> randomUserList = getRandomUserList();
    List<User> userList = randomUserList.stream()
      .map(RandomUserMe.Result::toUserDto)
      .map(UserDto::toEntity)
      .collect(Collectors.toList());
    userRepository.saveAll(userList);
  }

  private List<RandomUserMe.Result> getRandomUserList() {
    return commonUtilService.getRandomUser().getResults();
  }

}
```

- 설정하고 프로젝트를 실행하면 데이터가 적재되는걸 볼 수 있다.
  - 알아볼것 1. ```@LastModifiedBy```, ```@CreatedBy``` 설정
  - 알아볼것 2. ```jpa```로 ```bulk insert```하는 방식


![insert_check](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/ef9a0534-34b2-4b48-a4bd-49f40f90f284)


- 다음에 할것
  - Email 서비스 연동
