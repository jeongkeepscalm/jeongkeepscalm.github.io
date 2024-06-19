---
title: "[KYH] Spring Validation"
description: "[KYH] Spring Validation"
date: 2024-06-18
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

# BindingResult 

- 스프링이 제공하는 검증 오류를 보관하는 객체이다. 검증 오류가 발생하면 여기에 보관하면 된다.
- BindingResult 가 있으면 @ModelAttribute 에 데이터 바인딩 시 오류가 발생해도 컨트롤러가 호출
- 매개변수로 검증 객체 뒤에 위치한다.

```java
@PostMapping("/add")
public String addItemV1(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

  if (!StringUtils.hasText(item.getItemName())) {
    bindingResult.addError(new FieldError("item", "itemName", "상품 이름은 필수입니다."));
  }

  if (item.getPrice() == null || item.getPrice() < 1_000 || item.getPrice() > 1_000_000) {
    bindingResult.addError(new FieldError("item", "price","가격은 1,000 ~ 1,000,000까지 허용합니다."));
  }

  if (item.getQuantity() == null || item.getQuantity() >= 10000) {
    bindingResult.addError(new FieldError("item", "quantity", "수량은 최대 9,999 까지 허용합니다."));
  }

  if (item.getPrice() != null && item.getQuantity() != null) {
    int resultPrice = item.getPrice() * item.getQuantity();
    if (resultPrice < 10000) {
      bindingResult.addError(new ObjectError("item", "가격 * 수량의 합은 10,000원 이상이어야 합니다. 현재 값 = " + resultPrice));
    }
  }

  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v2/addForm";
  }

  // 성공 로직
  Item savedItem = itemRepository.save(item);
  redirectAttributes.addAttribute("itemId", savedItem.getId());
  redirectAttributes.addAttribute("status", true);
  return "redirect:/validation/v2/items/{itemId}";
}
```

<br/>

```java

public FieldError(String objectName, String field, String defaultMessage) 

public FieldError(String objectName, String field, @Nullable Object rejectedValue
, boolean bindingFailure, @Nullable String[] codes, @Nullable Object[] arguments
, @Nullable String defaultMessage) 
```
> objectName : 오류가 발생한 객체 이름  
> field : 오류 필드  
> rejectedValue : 사용자가 입력한 값(거절된 값)  
> bindingFailure : 타입 오류 같은 바인딩 실패인지, 검증 실패인지 구분 값  
> codes : 메시지 코드  
> arguments : 메시지에서 사용하는 인자  
> defaultMessage : 기본 오류 메시지  

```java
public ObjectError(String objectName, String defaultMessage) {}
```
> objectName : @ModelAttribute 의 이름  
> defaultMessage : 오류 기본 메시지  

<br/>

- 필드에 오류: FieldError 객체를 생성해서 bindingResult에 담아둔다.
- 특정 필드를 넘어서는 오류: ObjectError 객체를 생성해서 bindingResult에 담아둔다.

<br/>
<hr>

# BindingResult 검증 오류 적용 3가지 방법

1. @ModelAttribute의 객체에 타입 오류 등 `바인딩이 실패`하는 경우, 스프링이 `FiledError 자동 생성`하여 BindingResult 에 넣어준다. 
2. 개발자가 직접 FieldError / ObjectError 생성 후 넣어준다. 
3. Validator 사용한다. 

# BindingResult & Errors

- BindingResult 인터페이스는 Errors 인터페이스를 상속받고 있다. 
- BeanPropertyBindingResult: 실제 넘어오는 구현체. BindingResult && Errors 둘다 구현하고 있으므로 Errors를 대신 사용 가능
- BindingResult가 Errors 보다 더 많은 기능을 제공한다. 
- 주로 관례상 BindingResult를 많이 사용한다. 

<br/>
<hr>

***FieldError 객체의 추가 속성***

```java
public String addItemV2(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

  if (!StringUtils.hasText(item.getItemName())) {
    bindingResult.addError(new FieldError("item", "itemName",
            item.getItemName(), false, null, null, "상품 이름은 필수입니다."));
  }

  if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
    bindingResult.addError(new FieldError("item", "price", item.getPrice(),
            false, null, null, "가격은 1,000 ~ 1,000,000 까지 허용합니다."));
  }

  if (item.getQuantity() == null || item.getQuantity() >= 10000) {
    bindingResult.addError(new FieldError("item", "quantity",
            item.getQuantity(), false, null, null, "수량은 최대 9,999 까지 허용합니다."));
  }

  // 특정 필드 예외가 아닌 전체 예외
  if (item.getPrice() != null && item.getQuantity() != null) {
    int resultPrice = item.getPrice() * item.getQuantity();
    if (resultPrice < 10000) {
      bindingResult.addError(new ObjectError("item", null, null, "가격 * 수량 의 합은 10,000원 이상이어야 합니다. 현재 값 = " + resultPrice));
    }
  }

  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v2/addForm";
  }

  // 성공 로직
  Item savedItem = itemRepository.save(item);
  redirectAttributes.addAttribute("itemId", savedItem.getId());
  redirectAttributes.addAttribute("status", true);
  return "redirect:/validation/v2/items/{itemId}";
}
```

<br/>
<hr>

***FieldError 객체 내 속성 code 에 메시지 코드를 넣는다.***

```java
public String addItemV3(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

  if (!StringUtils.hasText(item.getItemName())) {
    bindingResult.addError(new FieldError("item", "itemName",
            item.getItemName(), false, new String[]{"required.item.itemName"}, null, null));
  }

  if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
    bindingResult.addError(new FieldError("item", "price", item.getPrice(),
            false, new String[]{"range.item.price"}, new Object[]{1000, 1000000}, null));
  }
  if (item.getQuantity() == null || item.getQuantity() > 10000) {
    bindingResult.addError(new FieldError("item", "quantity",
            item.getQuantity(), false, new String[]{"max.item.quantity"}, new Object[]{9999}, null));
  }

  // 특정 필드 예외가 아닌 전체 예외
  if (item.getPrice() != null && item.getQuantity() != null) {
    int resultPrice = item.getPrice() * item.getQuantity();
    if (resultPrice < 10000) {
        bindingResult.addError(new ObjectError("item", new String[]{"totalPriceMin"}
                , new Object[]{10000, resultPrice}, null));
    }
  }

  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v2/addForm";
  }

  // 성공 로직
  Item savedItem = itemRepository.save(item);
  redirectAttributes.addAttribute("itemId", savedItem.getId());
  redirectAttributes.addAttribute("status", true);
  return "redirect:/validation/v2/items/{itemId}";

}
```

<br/>
<hr>

***BindingResult.rejectValue() / BindingResult.reject()***

```java
/** FieldError, ObjectError 객체를 직접 생성하지 않고 깔끔하게 오류 검증 가능 **/

public String addItemV4(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

  log.info("objectName={}", bindingResult.getObjectName());
  log.info("target={}", bindingResult.getTarget());

  if (!StringUtils.hasText(item.getItemName())) {
    bindingResult.rejectValue("itemName", "required");
  }

  if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
    bindingResult.rejectValue("price", "range", new Object[]{1000, 1000000}, null);
  }

  if (item.getQuantity() == null || item.getQuantity() > 10000) {
    bindingResult.rejectValue("quantity", "max", new Object[]{9999}, null);
  }

  // 특정 필드 예외가 아닌 전체 예외
  if (item.getPrice() != null && item.getQuantity() != null) {
    int resultPrice = item.getPrice() * item.getQuantity();
    if (resultPrice < 10000) {
      bindingResult.reject("totalPriceMin", new Object[]{10000, resultPrice}, null);
    }
  }

  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v2/addForm";
  }

  // 성공 로직
  Item savedItem = itemRepository.save(item);
  redirectAttributes.addAttribute("itemId", savedItem.getId());
  redirectAttributes.addAttribute("status", true);
  return "redirect:/validation/v2/items/{itemId}";

}
```
> BindingResult 는 이미 Target 객체를 알고 있기에, 해당 정보는 넣어줄 필요가 없다.  

<br/>

```java
void rejectValue(@Nullable String field, String errorCode, 
  @Nullable Object[] errorArgs, @Nullable String defaultMessage);
```
> `field`: 오류 필드명
> `errorCode`: 오류 코드(이 오류 코드는 **메시지에 등록된 코드가 아니다.** 뒤에서 설명할 `messageResolver`를 위한 오류 코드)
> `errorArgs`: 오류 메시지에서 {0} 을 치환하기 위한 값
> `defaultMessage`: 오류 메시지를 찾을 수 없을 때 사용하는 기본 메시지

<br/>
<hr>

# MessageCodesResolver  

```properties
#Level1
required.item.itemName: 상품 이름은 필수 입니다.

#Level2
required: 필수 값 입니다.
```

```java
if (!StringUtils.hasText(item.getItemName())) {
  bindingResult.rejectValue("itemName", "required");
}
```
> 해당 코드처럼 required로 코드 지정 시 MessageCodesResolver가 메시지 코드를 생성한다.   
> required.item.itemName 처럼 구체적인 것을 먼저 만들어주고, required 처럼 덜 구체적인 것을 가장 나중에 만든다.  
  
- 정리
  1. rejectValue() 호출
  2. MessageCodesResolver 를 사용해서 검증 오류 코드로 메시지 코드들을 생성
  3. new FieldError() 를 생성하면서 메시지 코드들을 보관
  4. th:erros 에서 메시지 코드들로 메시지를 순서대로 메시지에서 찾고, 노출

- DefaultMessageCodesResolver의 기본 메시지 생성 규칙
  - 객체 오류 
    - 객체 오류의 경우 다음 순서로 2가지 생성
    - 1.: code + "." + object name
    - 2.: code
    - 예) 오류 코드: required, object name: item
    - 1.: required.item
    - 2.: required

  - 필드 오류 
    - 필드 오류의 경우 다음 순서로 4가지 메시지 코드 생성
    - 1.: code + "." + object name + "." + field
    - 2.: code + "." + field
    - 3.: code + "." + field type
    - 4.: code
    - 예) 오류 코드: typeMismatch, object name "user", field "age", field type: int
    - "typeMismatch.user.age"
    - "typeMismatch.age"
    - "typeMismatch.int"
    - "typeMismatch"

<br/>
<hr>

# 스프링이 직접 만든 오류 메시지 처리

- 숫자 값을 받는 input 란에 문자 입력 시 BindingResult 에 FieldError 가 담겨있고 하위 메시지 코드가 생성된 걸 확인할 수 있다.   
<code>codes[typeMismatch.item.price,typeMismatch.price,typeMismatch.java.lang.Integer,typeMismatch]</code>  
- 스프링은 타입 오류 발생하면 typeMismatch 오류 코드를 사용하고 해당 오류 코드가 MessageCodesResolver를 통하여 4가지 메시지 코드가 생성된다.  

<br/>

```properties
# 스프링(MessageCodesResolver)에서 자동 생성하는 메시지 코드를 활용하기 위해 추가된 코드

typeMismatch.java.lang.Integer=숫자를 입력해주세요.
typeMismatch=타입 오류입니다.
```

<br/>
<hr>

# Validator 분리

***Validator 인터페이스 상속받아 ItemValidator 구현***

```java
@Component
public class ItemValidator implements Validator {

  @Override
  public boolean supports(Class<?> aClass) {
    return Item.class.isAssignableFrom(aClass);
  }

  @Override
  public void validate(Object target, Errors errors) {

    Item item = (Item) target;

    // 상품명 검증(빈값, 공백)
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "itemName", "required");

    if (item.getPrice() == null || item.getPrice() < 1_000 || item.getPrice() > 1_000_000) {
      errors.rejectValue("price","range", new Object[]{1_000, 1_000_000}, null );
    }

    if (item.getQuantity() == null || item.getQuantity() > 10_000) {
      errors.rejectValue("quantity", "max", new Object[]{9_999}, null);
    }


    // 특정 필드 예외가 아닌 전체 예외
    if (item.getPrice() != null && item.getQuantity() != null) {
      int resultPrice = item.getPrice() * item.getQuantity();
      if (resultPrice < 10_000) {
        errors.reject("totalPriceMin", new Object[]{1_000, resultPrice}, null);
      }
    }

  }

}
```
> supports() {}: 해당 검증기를 지원하는 여부 확인  
> validate(Object target, Errors errors): 검증 대상 객체와 BindingResult  

<br/>

***ItemValidator 호출***

```java
private final ItemValidator itemValidator; // validator 생성자 주입

@PostMapping("/add")
public String addItemV5(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

  itemValidator.validate(item, bindingResult);

  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v2/addForm";
  }

  // 성공 로직
  Item savedItem = itemRepository.save(item);
  redirectAttributes.addAttribute("itemId", savedItem.getId());
  redirectAttributes.addAttribute("status", true);
  return "redirect:/validation/v2/items/{itemId}";

}
```

<br/>
<hr>

# Validator 분리 2

1. WebDataBinder.addValidators()로 검증기를 등록
2. 검증이 필요한 객체 앞에 @Validated 어노테이션 붙임

<br/>

```java
@InitBinder
public void init(WebDataBinder webDataBinder) {
  webDataBinder.addValidators(itemValidator);
}

@PostMapping("/add")
public String addItemV6(@Validated @ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

  // itemValidator.validate(item, bindingResult); 필요 없어진 코드

  if (bindingResult.hasErrors()) {
    log.info("errors={}", bindingResult);
    return "validation/v2/addForm";
  }

  Item savedItem = itemRepository.save(item);
  redirectAttributes.addAttribute("itemId", savedItem.getId());
  redirectAttributes.addAttribute("status", true);
  return "redirect:/validation/v2/items/{itemId}";

}

// 글로벌 설정
@SpringBootApplication
public class ItemServiceApplication implements WebMvcConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(ItemServiceApplication.class, args);
	}

  // WebMvcConfigurer 구현하여 추가된 코드
  @Override
  public Validator getValidator() {
    return new ItemValidator();
  }
}

```
> `WebDataBinder`: 검증기를 추가하면 컨트롤러에서 자동으로 적용된다.    
> `@InitBinder`:  
>     해당 컨트롤러에만 영향을 준다.   
>     @InitBinder 를 제거해도 글로벌 설정으로 정상 동작한다.(글로벌 설정을 직접 사용하는 경우는 드물다.)  
> `@Validated`:  
>     검증기를 실행하라는 어노테이션  
>     WebDataBinder에 등록한 검증기를 찾아서 실행한다.  
>     검증기 실행시 supports()가 사용되어 검증기를 특정하여 실행한다.  

<br/>

- 글로벌 설정을 하면 BeanValidator가 자동으로 등록되지 않는다.  
- 검증 어노테이션으로 `@Validated`, `@Valid` 둘 다 사용 가능
  - javax.validation.@Valid 를 사용하려면 build.gradle 의존관계 추가가 필요
  - implementation 'org.springframework.boot:spring-boot-starter-validation'

