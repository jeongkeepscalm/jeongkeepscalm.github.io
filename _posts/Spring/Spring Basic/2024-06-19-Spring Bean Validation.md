---
title: "Spring Bean Validation"
description: "Spring Bean Validation"
date: 2024-06-19
categories: [Spring, Spring Basic]
tags: [Spring, Spring Basic]
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

**_BeanValidationTest_**

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

<br/>
<hr>

# 검증 순서

1. @ModelAttribute 각각의 필드에 타입 변환 시도

- 성공하면 다음으로
- 실패하면 typeMismatch로 FieldError 추가

2. Validator 적용

- @ModelAttribute → 각각의 필드 타입 변환시도 → 변환에 성공한 필드만 BeanValidation 적용
- BeanValidator는 바인딩에 실패한 필드는 BeanValidation을 적용하지 않는다.
  - e.g. itemName 에 문자 "A" 입력 타입 변환 성공 itemName 필드에 BeanValidation 적용
  - e.g. price 에 문자 "A" 입력 "A"를 숫자 타입 변환 시도 실패 typeMismatch FieldError 추가 price 필드는 BeanValidation 적용 X

<br/>
<hr>

# Bean Validation이 기본으로 제공하는 오류 메시지 변경

- @NotBlank 오류 코드를 기반으로 MessageCodesResolver를 통하여 다양한 메시지 코드가 순서대로 생성된다.
- e.g. @NotBlank  
  NotBlank.item.itemName  
  NotBlank.itemName  
  NotBlank.java.lang.String  
  NotBlank
- e.g. @Range
  Range.item.price  
  Range.price  
  Range.java.lang.Integer  
  Range
- BeanValidation 메시지 찾는 순서
  1. 생성된 메시지 코드 순서대로 messageSource 에서 메시지 찾기
  2. 애노테이션의 message 속성 사용: @NotBlank(message = "공백! {0}")
  3. 라이브러리가 제공하는 기본 값 사용: 공백일 수 없습니다.

**_1. MessageSource에서 메시지 찾기_**

```properties
# Bean Validation 추가
NotBlank={0} 공백X
Range={0}, {2} ~ {1} 허용
Max={0}, 최대 {1}
```

> {0}: 필드명  
> {1}, {2}.. 은 각 어노테이션 마다 다름

**_2. 어노테이션의 message 속성 사용_**

```java
@NotBlank(message = "공백은 입력할 수 없습니다.")
private String itemName;
```

<br/>
<hr>

# Bean Validation - 오브젝트 오류

- Object Error 처리방법 2가지
  1. @ScriptAssert: 제약이 많고 복잡
  2. 자바 코드 작성(권장)

**_@ScriptAssert_**

```java
@Data
@ScriptAssert(lang = "javascript", script = "_this.price * _this.quantity >=10000")
public class Item {
  //...
}
```

**_자바 코드 작성_**

```java
@PostMapping("/add")
public String addItem(@Validated @ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

  // 특정 필드 예외가 아닌 전체 예외
  if (item.getPrice() != null && item.getQuantity() != null) {
    int resultPrice = item.getPrice() * item.getQuantity();
    if (resultPrice < 10000) {
      bindingResult.reject("totalPriceMin", new Object[]{10000, resultPrice}, null);
    }
  }

  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v3/addForm";
  }

  // 성공 로직
  Item savedItem = itemRepository.save(item);
  redirectAttributes.addAttribute("itemId", savedItem.getId());
  redirectAttributes.addAttribute("status", true);
  return "redirect:/validation/v3/items/{itemId}";

}
```

<br/>
<hr>

# Bean Validation 한계

- 데이터를 등록할 때와 수정할 때는 요구사항이 다를 경우
  - 등록시에는 quantity 수량을 최대 9999까지 등록할 수 있지만 수정시에는 수량을 무제한으로 변경
  - 등록시에는 id 에 값이 없어도 되지만, 수정시에는 id 값이 필수
- 해당 문제를 `groups` 속성을 이용하여 해결할 수 있다.
  1. SaveCheck.java, UpdateCheck.java 인터페이스 생성
  2. 검증 객체 Bean Validation 어노테이션 groups 속성 추가
  3. 컨트롤러 검증 메소드 내 @Validated()에 검증 클래스 추가

**_1. 빈 인터페이스 생성_**

```java
public interface SaveCheck {}
public interface UpdateCheck {}
```

**_groups 속성 추가_**

```java
@Data
public class Item {

  @NotNull(groups = {UpdateCheck.class}) // 수정할 경우에만 적용
  private Long id;

  @NotBlank(message = "공백 불가능(어노테이션 메시지 사용)"
          , groups = {SaveCheck.class, UpdateCheck.class}) // 빈값 && 공백 허용 x
  private String itemName;

  @NotNull(groups = {SaveCheck.class, UpdateCheck.class})
  @Range(min = 1_000, max = 1_000_000, groups = {SaveCheck.class, UpdateCheck.class})
  private Integer price;

  @NotNull(groups = {SaveCheck.class, UpdateCheck.class})
  @Max(value = 9_999, groups = {SaveCheck.class}) // 등록할 경우에만 적용
  private Integer quantity;

  public Item() {}

  public Item(String itemName, Integer price, Integer quantity) {
    this.itemName = itemName;
    this.price = price;
    this.quantity = quantity;
  }

}
```

**_@Validated 어노테이션에 속성 추가_**

```java
@PostMapping("/add")
public String addItemV2(@Validated(SaveCheck.class) @ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
  ...
}
```

- 정리
  - groups 기능을 사용하여 등록, 수정 시 각각 다르게 검증 가능
  - 그러나 전반적으로 복잡도 상승
  - 사실 groups 기능은 실제 잘 사용되지 않는데, 그 이유는 실무에서 주로 등록 폼 객체와 수정 폼 객체를 분리에서 사용하기 때문이다.

<br/>
<hr>

# Form 전송 객체 분리

- 폼 데이터 전달에 Item 도메인 객체 사용
  - HTML Form -> Item -> Controller -> Item -> Repository
  - 장점: Item 인스턴스를 만드는 과정이 없어 간단
  - 단점: 간단한 경우에만 적용 가능. 수정 시 검증 중복 가능성. groups 사용해야 함
- 폼 데이터 전달을 위한 별도의 객체 사용
  - HTML Form -> ItemSaveForm -> Controller -> Item 생성 -> Repository
  - 장점: 별도의 폼 객체를 사용해서 검증이 중복되지 않음
  - 단점: Item 인스턴스 생성하는 변환 과정 추가

**_입력 폼 클래스_**

```java
@Data
public class ItemSaveRequest {

  @NotBlank(message = "상품명을 입력해주세요(빈 값 허용 x)")
  private String itemName;

  @NotNull(message = "가격을 입력해주세요.")
  @Range(min = 1_000, max = 1_000_000, message = "가격을 {min} ~ {max} 사이로 설정해주세요.")
  private Integer price;

  @NotNull(message = "수량을 입력해주세요.")
  @Max(value = 9_999, message = "최대 수량은 {value} 입니다.")
  private Integer quantity;

}
```

**_수정 폼 클래스_**

```java
@Data
public class ItemUpdateRequest {

  @NotNull
  private Long id;

  @NotBlank(message = "상품명을 입력해주세요(빈 값 허용 x)")
  private String itemName;

  @NotNull(message = "가격을 입력해주세요.")
  @Range(min = 1_000, max = 1_000_000, message = "가격을 {min} ~ {max} 사이로 설정해주세요.")
  private Integer price;

  @NotNull(message = "수량을 입력해주세요.")
  private Integer quantity;

}
```

<br/>
<hr>

# Bean Validation - HTTP 메시지 컨버터

- @Valid , @Validated 는 HttpMessageConverter ( @RequestBody )에도 적용 가능하다.

**_RestController_**

```java
@Slf4j
@RestController
@RequestMapping("/validation/api/items")
public class ValidationItemApiController {

  @PostMapping("/add")
  public Object addItem(@RequestBody @Validated ItemSaveRequest request, BindingResult bindingResult) {

    log.info("call api controller");

    if (bindingResult.hasErrors()) {
      log.info("validation errors occurred = {}", bindingResult);
      return bindingResult.getAllErrors();
    }

    log.info("successful logic ...");
    return request;

  }

}
```

<br/>

## API 요청 3가지 경우

1. 성공 요청
2. 실패 요청: JSON 객체 생성 실패
3. 검증 오류 요청: JSON 객체 생성 성공 & 검증 실패

**_2. JSON 객체 생성 실패(타입 오류)_**

```json
{
  "_comment" : "Request",

  "itemName": "test item",
  "price": "String",
  "quantity": 10000
}


{
  "_comment" : "Response",

  "timestamp": "2024-06-20T08:13:44.354+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "",
  "path": "/validation/api/items/add"
}
```

> 컨트롤러 자체가 호출되지 않고 그 전에 예외가 발생한다. 물론 Validator도 실행되지 않는다.

<br/>

**_3. 검증 오류 실패_**

```json
{
  "_comment" : "Request",

  "itemName": "test item",
  "price": 20,
  "quantity": 10000
}

[
  {
    "_comment" : "Response",

    "codes": [
      "Max.itemSaveRequest.quantity",
      "Max.quantity",
      "Max.java.lang.Integer",
      "Max"
    ],
    "arguments": [
      {
        "codes": [
            "itemSaveRequest.quantity",
            "quantity"
        ],
        "arguments": null,
        "defaultMessage": "quantity",
        "code": "quantity"
      },
      9999
    ],
    "defaultMessage": "최대 수량은 9999 입니다._ItemSaveRequest",
    "objectName": "itemSaveRequest",
    "field": "quantity",
    "rejectedValue": 10000,
    "bindingFailure": false,
    "code": "Max"
  },
  {
    "codes": [
      "Range.itemSaveRequest.price",
      "Range.price",
      "Range.java.lang.Integer",
      "Range"
    ],
    "arguments": [
      {
        "codes": [
            "itemSaveRequest.price",
            "price"
        ],
        "arguments": null,
        "defaultMessage": "price",
        "code": "price"
      },
      1000000,
      1000
    ],
    "defaultMessage": "가격을 1000 ~ 1000000 사이로 설정해주세요._ItemSaveRequest",
    "objectName": "itemSaveRequest",
    "field": "price",
    "rejectedValue": 20,
    "bindingFailure": false,
    "code": "Range"
  }
]
```

<br/>
<hr>

### @ModelAttribute vs @RequestBody

- @ModelAttribute
  - 필드 단위로 세밀하게 적용(특정 필드에 타입이 맞지 않아 오류 발생해도 나머지 필드는 정상 처리가능)
- @RequestBody
  - 전체 객체 단위로 적용
  - HttpMessageConverter 단계에서 JSON 데이터를 객체로 변경하지 못하면 이후 단계 자체가 진행되지 않고 예외가 발생한다.
  - 컨트롤러도 호출되지 안히고 Validator도 적용할 수 없다.

<br/>
<hr>

# 정리

1. Validator를 구현한 커스텀 검증기를 만들어서 사용
   - WebDataBinder에 커스텀 Validator를 담아 해당 객체를 검증
2. Bean Validation 어노테이션을 사용하여 검증
   - 스프링 부트가 LocalValidatorFactoryBean을 글로벌 Validator로 등록
   - Validator가 매개변수 내 @Validated / @Valid가 존재하는 메소드 찾아 객체 검증
   - Validator가 Bean Validation 어노테이션을 보고 검증을 수행(자동으로 FieldError, ObjectError 생성 후 BindingResult에 담아줌)
