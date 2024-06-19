---
title: "[KYH] Thymeleaf Applied"
description: "[KYH] Thymeleaf Applied"
date: 2024-06-17
categories: [ Java, Java Template Engine ]
tags: [ Java, Java Template Engine ]
---

# 타임리프 스프링 통합

- 타임리프는 스프링 없이도 동작하지만, 스프링과 통합을 위한 다양한 기능을 편리하게 제공한다. 

- 스프링 통합으로 추가되는 기능들
  - 스프링의 SpringEL 문법 통합
  - ${@myBean.doSomething()} 처럼 스프링 빈 호출 지원
  - 편리한 폼 관리를 위한 추가 속성
    - th:object (기능 강화, 폼 커맨드 객체 선택)
    - th:field , th:errors , th:errorclass
  - 폼 컴포넌트 기능
    - checkbox, radio button, List 등을 편리하게 사용할 수 있는 기능 지원
  - 스프링의 메시지, 국제화 기능의 편리한 통합
  - 스프링의 검증, 오류 처리 통합
  - 스프링의 변환 서비스 통합(ConversionService)

<br/>
<hr>

# th:object, th:field

```html
<div class="container">
  <div class="py-5 text-center">
    <h2>상품 등록 폼</h2>
  </div>
  <h4 class="mb-3">상품 입력</h4>
  <form action="item.html" th:action th:object="${item}" method="post">
    <div>
      <label for="itemName">상품명</label>
      <input type="text" id="itemName" th:field="*{itemName}" name="itemName" class="formcontrol" placeholder="이름을 입력하세요">
    </div>
    <div>
      <label for="price">가격</label>
      <input type="text" id="price" th:field="*{price}" name="price" class="form-control"
              placeholder="가격을 입력하세요">
    </div>
    <div>
      <label for="quantity">수량</label>
      <input type="text" id="quantity" th:field="*{quantity}" name="quantity" class="formcontrol" placeholder="수량을 입력하세요">
  </div>
    <hr class="my-4">
    <div class="row">
      <div class="col">
          <button class="w-100 btn btn-primary btn-lg" type="submit">상품 등록
          </button>
      </div>
      <div class="col">
          <button class="w-100 btn btn-secondary btn-lg"
            onclick="location.href='items.html'"
            th:onclick="|location.href='@{/basic/items}'|"
            type="button">취소
          </button>
      </div>
    </div>
  </form>
</div> 
``` 
- `th:object`: form 내 사용할 객체를 지정
- `th:field`: 지정된 객체 내 필드 설정
  - th:field=*{itemName}
    - id, name, value 속성 자동 생성
    - id="itemName", name="itemName", value=""

<br/>
<hr>

# how to get form data

```java
public enum ItemType {

  BOOK("도서"), FOOD("식품"), ETC("기타");

  private final String description;

  ItemType(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }

}

@Data
@AllArgsConstructor
public class DeliveryCode {
  private String code;
  private String displayName;
}

@Data
public class Item {

  private Long id;
  private String itemName;
  private Integer price;
  private Integer quantity;

  private Boolean open;         // 판매 여부
  private List<String> regions; // 등록 지역
  private ItemType itemType;    // 상품 종류
  private String deliveryCode;  // 배송 방식  
  
  public Item() {}

  public Item(String itemName, Integer price, Integer quantity) {
    this.itemName = itemName;
    this.price = price;
    this.quantity = quantity;
  }

}
```

<br/>
<hr>

***single checkbox***

```html
<!-- added single checkbox -->
<div>판매 여부</div>
<div>
  <div class="form-check">
    <input type="checkbox" id="open" th:field="*{open}" class="form-check-input">
    <label for="open" class="form-check-label">판매 오픈</label>
  </div>
</div>
```

```java
@PostMapping("/add")
public String addItemV6(Item item, RedirectAttributes redirectAttributes) {
  log.info("item open = {}", item.getOpen());
  ...
}
```
> checked: true, unchecked: false  
> 체크박스 체크시 html form 에서 open=on 이라는 값으로 넘어오고  
> 스프링은 on 이라는 문자를 true 타입으로 변환(`스프링 타입 컨버터`가 수행한다.)  
> 체크박스 선택하지 않고 폼 전송시, open 이라는 피드 자체가 서버로 전송되지 않는다. 이는 값을 수정할 경우 문제를 야기한다.    

```html
<!-- 타임리프가 아닐 경우 히든 필드 속성(_open) 추가 -->
<div class="form-check">
  <input type="hidden" name="_open" value="on"/>
  <input type="checkbox" id="open" name="open" class="form-check-input">
  <label for="open" class="form-check-label">판매 오픈</label>
</div>

<!-- 타일 리프 사용할 경우 -->
<div class="form-check">
  <input type="checkbox" id="open" th:field="*{open}" class="form-check-input">
  <label for="open" class="form-check-label">판매 오픈</label>
</div>
```
> `th:field="*{open}"`  
>   _open=on 속성을 항상 전송  
>   값이 true면, 체크를 자동으로 처리(checked="checked")  

<br/>
<hr>

***multi checkbox***

```java
// Controller 내 
@ModelAttribute("regionsA")
  public Map<String, String> regions() {
    LinkedHashMap<String, String> regionsB = new LinkedHashMap<>();
    regionsB.put("SEOUL", "서울");
    regionsB.put("BUSAN", "부산");
    regionsB.put("JEJU", "제주");
    return regionsB;
  }
```
> 컨트롤러 내 모든 메소드 호출 시 데이터(regionB)가 담겨져 있다.  
> == model.addAttribute("regionsA", regionsB);  

```html
<!-- 코드 -->
<div>
  <div>등록 지역</div>
  <div th:each="region : ${regionsA}" class="form-check form-check-inline">
    <input type="checkbox" th:field="*{regions}" th:value="${region.key}" class="form-check-input">
    <label th:for="${#ids.prev('regions')}" th:text="${region.value}" class="form-check-label">서울</label>
  </div>
</div>

<!-- 렌더링 된 html -->
<div>
  <div>등록 지역</div>
  <div class="form-check form-check-inline">
    <input type="checkbox" value="SEOUL" class="form-check-input" id="regions1" name="regions">
    <input type="hidden" name="_regions" value="on"/>
    <label for="regions1" class="form-check-label">서울</label>
  </div>
  <div class="form-check form-check-inline">
    <input type="checkbox" value="BUSAN" class="form-check-input" id="regions2" name="regions">
    <input type="hidden" name="_regions" value="on"/>
    <label for="regions2" class="form-check-label">부산</label>
  </div>
  <div class="form-check form-check-inline">
    <input type="checkbox" value="JEJU" class="form-check-input" id="regions3" name="regions">
    <input type="hidden" name="_regions" value="on"/>
    <label for="regions3" class="form-check-label">제주</label>
  </div>
</div>
```
> `th:each`: 체크박스가 반복 생성될 때 id 뒤에 숫자 추가  
> `th:for="${#id.prev('regions')}"`: 숫자가 붙은 새로 생성된 id 값을 사용   
> 선택된 값을 서버에서 List로 받는다.  

<br/>
<hr>

***radio button***

```java
@ModelAttribute("itemTypes")
public ItemType[] itemTypes() {
  return ItemType.values(); // [BOOK, FOOD, ETC]
}
```

```html
<div>
  <div>상품 종류</div>
  <div th:each="itemType : ${itemTypes}" class="form-check form-check-inline">
    <input type="radio" th:field="*{itemType}" th:value="${itemType.name()}" class="form-check-input">
    <label th:for="${#ids.prev('itemType')}" th:text="${itemType.description}" class="form-check-label"></label>
  </div>
</div>

<!-- 
  타임리프테서 ENUM 직접 접근 
  ENUM의 패키지 위치가 변경될 경우 
-->
<div th:each="type : ${T(hello.itemservice.domain.item.ItemType).values()}">
```

<br/>
<hr>

***select box***

```java
@ModelAttribute("deliveryCodes")
  public List<DeliveryCode> deliveryCodes() {
    List<DeliveryCode> deliveryCodes = new ArrayList<>();
    deliveryCodes.add(new DeliveryCode("FAST", "빠른 배송"));
    deliveryCodes.add(new DeliveryCode("NORMAL", "일반 배송"));
    deliveryCodes.add(new DeliveryCode("SLOW", "느린 배송"));
    return deliveryCodes;
  }
```

```html
<div>
  <div>배송 방식</div>
  <select th:field="*{deliveryCode}" class="form-select">
    <option value="">==배송 방식 선택==</option>
    <option th:each="deliveryCode:${deliveryCodes}" th:value="${deliveryCode.code}" th:text="${deliveryCode.displayName}">test</option>
  </select>
</div>
```

<br/>
<hr>

# Validation 적용 

```html
<!-- Map에 에러 메시지를 담을 경우 -->

<div class="container">
  <div class="py-5 text-center">
    <h2 th:text="#{page.addItem}">상품 등록</h2>
  </div>
  <form action="item.html" th:action th:object="${item}" method="post">
    <div th:if="${errors?.containsKey('globalError')}">
        <p class="field-error" th:text="${errors['globalError']}">전체 오류 메시지</p>
    </div>
    <div>
        <label for="itemName" th:text="#{label.item.itemName}">상품명</label>
          <input type="text" id="itemName" th:field="*{itemName}"
              th:classappend="${errors?.containsKey('itemName')} ? 'fielderror' : _"
              class="form-control" placeholder="이름을 입력하세요">
          <div class="field-error" th:if="${errors?.containsKey('itemName')}"
              th:text="${errors['itemName']}">상품명 오류
          </div>
    </div>
    <div>
        <label for="price" th:text="#{label.item.price}">가격</label>
        <input type="text" id="price" th:field="*{price}"
                th:class="${errors?.containsKey('price')} ? 'form-controlfield-error' : 'form-control'"
                class="form-control" placeholder="가격을 입력하세요">
        <div class="field-error" th:if="${errors?.containsKey('price')}" th:text="${errors['price']}">가격 오류
        </div>
    </div>
    <div>
      <label for="quantity" th:text="#{label.item.quantity}">수량</label>
      <input type="text" id="quantity" th:field="*{quantity}"
              th:class="${errors?.containsKey('quantity')} ? 'form-controlfield-error' : 'form-control'"
              class="form-control" placeholder="수량을 입력하세요">
      <div class="field-error" th:if="${errors?.containsKey('quantity')}" th:text="${errors['quantity']}">수량 오류
      </div>
    </div>
    <hr class="my-4">
    <div class="row">
      <div class="col">
        <button class="w-100 btn btn-primary btn-lg" type="submit" th:text="#{button.save}">저장</button>
      </div>
      <div class="col">
        <button class="w-100 btn btn-secondary btn-lg"
                onclick="location.href='items.html'"
                th:onclick="|location.href='@{/validation/v1/items}'|"
                type="button" th:text="#{button.cancel}">취소</button>
      </div>
    </div>
  </form>
</div>
```
> `errors?.`  
>   errors 가 null 일 경우, NullPointerException 발생 x  
>   errors 가 null 일 경우, null 반환  
>   th:if 에서 null 은 실패로 처리되므로 오류 메시지가 출력되지 않는다.  
> <code><input type="text" th:classappend="${errors?.containsKey('itemName')} ? 'fielderror' : _" class="form-control"></code>  
>   classappend 를 사용해서 해당 필드에 오류가 있으면 field-error 라는 클래스 정보를 더해서 폼의 색깔을 빨간
색으로 강조한다. 만약 값이 없으면 _ (No-Operation)을 사용해서 아무것도 하지 않는다.  

<br/>

```html
<!-- BuindingResult 활용 -->

<form action="item.html" th:action th:object="${item}" method="post">
  <div th:if="${#fields.hasGlobalErrors()}">
    <p class="field-error" th:each="err:${#fields.globalErrors()}" th:text="${err}">global error message</p>
  </div>

  <div>
    <label for="itemName" th:text="#{label.item.itemName}">상품명</label>
    <input type="text" id="itemName" th:field="*{itemName}"
      th:classappend="${errors?.containsKey('itemName')} ? 'fielderror' : _"
      class="form-control" placeholder="이름을 입력하세요">

    <div class="field-error" th:errors="*{itemName}">
        상품명 오류
    </div>

  </div>
  <div>
    <label for="price" th:text="#{label.item.price}">가격</label>
    <input type="text" id="price" th:field="*{price}"
      th:errorclass="field-error" class="form-control" placeholder="가격을 입력하세요">

    <div class="field-error" th:errors="*{price}">
      가격오류
    </div>

  </div>
  <div>
      <label for="quantity" th:text="#{label.item.quantity}">수량</label>
      <input type="text" id="quantity" th:field="*{quantity}"
        th:class="${errors?.containsKey('quantity')} ? 'form-controlfield-error' : 'form-control'"
        class="form-control" placeholder="수량을 입력하세요">

      <div class="field-error" th:errors="*{quantity}">
        수량 오류
      </div>

  </div>
  <hr class="my-4">
  <div class="row">
      <div class="col">
        <button class="w-100 btn btn-primary btn-lg" type="submit" th:text="#{button.save}">저장</button>
      </div>
      <div class="col">
          <button class="w-100 btn btn-secondary btn-lg"
            onclick="location.href='items.html'"
            th:onclick="|location.href='@{/validation/v2/items}'|"
            type="button" th:text="#{button.cancel}">취소</button>
      </div>
  </div>
</form>

```
> `#fields`: BindingResult가 제공하는 검증 오류에 접근 가능  
> `th:errors`: 해당 필드에 오류가 있는 경우 태그 출력(th:if 편의 버전)  
> `th:errorclass` : th:field 에서 지정한 필드에 오류가 있으면 class 정보를 추가  

<br/>

