---
title: "Spring Bean Validation"
description: "Spring Bean Validation"
date: 2024-06-19
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

# Bean Validation

- 검증 로직을 모든 프로젝트에 적용할 수 있게 공통화하고, 표준화 한 것
- 애노테이션 하나로 검증 로직을 매우 편리하게 적용
- 특정한 구현체가 아니라 Bean Validation 2.0(JSR-380)이라는 기술 표준
- 검증 어노테이션과 여러 인터페이스의 모음(마치 JPA가 표준 기술이고 그 구현체로 하이버네이트가 있는 개념과 동일)
- Bean Validation을 구현한 기술 중 일반적으로 사용하는 구현체는 `하이버네이트 Validator`이다.(이름에 하이버네이트가 붙어서 그렇지 ORM과는 전혀 관련 없다.) 
- 검증 어노테이션 모음: <https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/html_single/#validator-defineconstraints-spec/>

<br/>
<hr>

# Bean Validation 의존관계 추가

- build.gradle  
  - implementation 'org.springframework.boot:spring-boot-starter-validation'  

<br/>
<hr>

# 검증 코드(참고 사항)

```java
@Data
public class Item {

  private Long id;

  @NotBlank // 빈값 && 공백 허용 x
  private String itemName;

  @NotNull
  @Range(min = 1_000, max = 1_000_000)
  private Integer price;

  @NotNull
  @Max(9_999)
  private Integer quantity;

  public Item() {}

  public Item(String itemName, Integer price, Integer quantity) {
    this.itemName = itemName;
    this.price = price;
    this.quantity = quantity;
  }

}
```

<br/>

***BeanValidationTest***

```java
public class BeanValidationTest {

  @Test
  void beanValidation() {
    ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
    Validator validator = validatorFactory.getValidator();

    Item item = new Item();
    item.setItemName("  ");
    item.setPrice(0);
    item.setQuantity(10_000);

    Set<ConstraintViolation<Item>> violations = validator.validate(item);
    for (ConstraintViolation<Item> violation : violations) {
      System.out.println("violation = " + violation);
      System.out.println("violation.message = " + violation.getMessage());
    }

  }
  
}

/** 
  violation = ConstraintViolationImpl {
    interpolatedMessage='1000에서 1000000 사이여야 합니다'
    , propertyPath=price
    , rootBeanClass=class hello.itemservice.domain.item.Item
    , messageTemplate='{org.hibernate.validator.constraints.Range.message}'
  }
  violation.message = 1000에서 1000000 사이여야 합니다
  ...
*/
```

<br/>
<hr>

# Bean Validator 사용법

1. 라이브러리 추가: 스프링 부트는 해당 라이브러리를 넣으면 자동으로 Bean Validator를 인지하여 스프링에 통합한다.
2. 객체 필드에 BeanValidation 어노테이션 추가
3. 검증 메소드 매개변수에 @Validated / @Valid 어노테이션 추가  
  
- 스프링 부트가 spring-boot-starter-validation 라이브러리를 넣으면 자동으로 Bean Validator를 인지하
고 스프링에 통합한다.
- 스프링 부트는 `LocalValidatorFactoryBean`을 글로벌 Validator로 등록한다. 해당 Validator는 @NotNull 같은 어노테이션을 보고 검증을 수행한다. 검증 오류 발생시, FieldError, ObjectError 생성하여 BindingResult에 담아준다.  


