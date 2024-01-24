---
layout: post
title: SpringAnnotation
date: 2024-01-24 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: annotation.png 
tags: [SpringAnnotation] 
---

<br/>

## @ModelAttribute()

* 매개변수로 @ModelAttribute Item item 로 받고 있으면 model.addAttribute("item", item); 과 같다.   
* 리다이렉트된 URL에서도 모델에 추가된 객체를 사용할 수 있다. ex) ${item.id}, ${item.name} ..   

#### 매개변수가 아닌 컨트롤러 내 @ModelAttribute() 를 선언했을 경우,

```java
@ModelAttribute("regions")
    public Map<String, String> regions() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("SEOUL", "서울");
        map.put("BUSAN", "부산");
        map.put("JEJU", "제주");
        return map;
    }
```
> Controller 안에 있는 별도의 메소드를 적용할 수 있다.   
> 컨트롤러를 요청할 때 regions 에서 반환한 값이 자동으로 모델( model )에 담기게 된다.   
> 즉, "regions" 라는 이름으로 모델에 담기어 앞단에서 사용가능하다.   


<br/>
<hr>
<br/>

## RedirectAttributes : Spring MVC에서 제공하는 인터페이스

* URL 파라미터로 데이터를 전달하는 방식이라 addAttribute("test", ____ ) ____에 객체를 담을 수 없다.
* 일반적으로 리다이렉트 시에는 쿼리스트링으로 데이터를 전달하여 데이터가 노출되고 보안에 취약할 수 있고 크기에 제한이 있지만   
  RedirectAttributes 를 사용하면, 데이터를 url에 노출하지 않고 전달할 수 있고, 데이터 크기에도 제한이 없다.   

```java
@PostMapping("/add")
public String addItemV6(Item item, RedirectAttributes redirectAttributes) {
  Item savedItem = itemRepository.save(item);
  redirectAttributes.addAttribute("itemId", savedItem.getId());
  redirectAttributes.addAttribute("status", true);
  return "redirect:/basic/items/{itemId}";
  // return "redirect:/basic/items/" + item.getId(); 인코딩 문제 야기
  // 매개변수를 사용하여 PathVariable 처럼 사용가능하며 인코딩 문제 해결.
  // rediredt 로 넘어온 페이지에서 <h2 th:if="${param.status}" th:text="'저장 완료'"></h2> 처럼 사용 가능.
  // redirectAttributes.addFlashAttribute() : 객체를 보낼 수 있다. 
}
```


<br/>
<hr>
<br/>







