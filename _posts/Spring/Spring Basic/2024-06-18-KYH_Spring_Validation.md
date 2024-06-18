---
title: "[KYH] Spring Validation"
description: "[KYH] Spring Validation"
date: 2024-06-18
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

# BindingResult 사용법

- 매개변수로 검증 객체 뒤에 위치

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
public FieldError(String objectName, String field, String defaultMessage) {}
```
> objectName : @ModelAttribute 이름  
> field : 오류가 발생한 필드 이름  
> defaultMessage : 오류 기본 메시지  

```java
public ObjectError(String objectName, String defaultMessage) {}
```
> objectName : @ModelAttribute 의 이름  
> defaultMessage : 오류 기본 메시지  

<br/>

- 필드에 오류: FieldError 객체를 생성해서 bindingResult에 담아둔다.
- 특정 필드를 넘어서는 오류: ObjectError 객체를 생성해서 bindingResult에 담아둔다.
