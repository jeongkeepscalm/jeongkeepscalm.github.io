---
title: "Spring Bean Validation Priority"
description: "Spring Bean Validation Priority"
date: 2024-06-25
categories: [Spring, Spring Basic]
tags: [Spring, Spring Basic]
---

***Interfaces In Class***

```java
public class ValidationGroups {

  public interface First{};
  public interface Second{};
  public interface Third{};
  public interface Forth{};

}
```

<br/>

***@GroupSequence***

```java
@GroupSequence({ValidationGroups.First.class
        , ValidationGroups.Second.class
        , ValidationGroups.Third.class
        , ValidationGroups.Forth.class})
public interface ValidationSequence {}
```

<br/>

***Request Object***

```java
@Data
public class PriorityRequest {

  @Builder
  @JsonCreator 
  public PriorityRequest(String email) {
    this.email = email;
  }

  @NotBlank(groups = ValidationGroups.Second.class, message = "빈문자 허용 x")
  @Email(groups = ValidationGroups.Third.class,
          regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", message = "이메일 형식에 맞게 입력")
  @Size(groups = ValidationGroups.First.class,
          min = 3, max = 10, message = "3 ~ 10 문자")
  private String email;

}
```
> `@NotBlank`: 빈문자 & 공백 & null 허용하지 않는다.  
> `@JsonCreator`/`@JsonProperty`:   
> @Builder를 사용할 때는 Jackson이 객체를 생성하기 위한 충분한 정보를 가지고 있지 않음. 따라서, Jackson이 객체를 올바르게 생성할 수 있도록 도와주는 추가 설정이 필요하다.  
> 역직렬화 생성자를 명시적으로 정의. @Builder 어노테이션과 함께 사용할 때 유용  

<br/>

***Controller***

```java
@RestController
@Slf4j
public class PriorityController {

  @PostMapping("/test")
  public Object priorityTest(@Validated(ValidationSequence.class) @RequestBody PriorityRequest priorityRequest, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return bindingResult.getAllErrors()
              .stream()
              .map(v -> v.getDefaultMessage())
              .collect(Collectors.toList());
    }
    return "no error";
  }

}
```
> `@Validated(ValidationSequence.clas)`: 시퀀스 정의된 클래스 명시