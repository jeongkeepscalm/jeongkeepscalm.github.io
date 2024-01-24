---
layout: post
title: URL_Mapping
date: 2024-01-24 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: urlMapping.jpg # Add image post (optional)
tags: [URL Mapping] # add tag
---

<br/>

## RedirectAttributes, @ModelAttribute()

```java
// List
@GetMapping("/basic/items")
public String items(Model model) {
  List<Item> items = itemRepository.findAll();
  model.addAttribute("items", items);
  return "basic/items";
}

// Add Form
@GetMapping("/add")
public String addForm() {
  return "basic/addForm";
}

// Add Process
@PostMapping("/add")
public String addItemV6(Item item, RedirectAttributes redirectAttributes) {
  Item savedItem = itemRepository.save(item);
  redirectAttributes.addAttribute("itemId", savedItem.getId());
  redirectAttributes.addAttribute("status", true);
  return "redirect:/basic/items/{itemId}";
  // return "redirect:/basic/items/" + item.getId(); 인코딩 문제 야기

/**
 * RedirectAttributes 
 *    1. URL 파라미터로 데이터를 전달하는 방식이라 addAttribute("test", ____ ) ____에 객체를 담을 수 없다.
 *    2. rediredt 로 넘어온 페이지에서 <h2 th:if="${param.status}" th:text="'저장 완료'"></h2> 처럼 사용 가능.
 *    매개변수를 사용하여 PathVariable 처럼 사용가능하며 인코딩 문제 해결.
 *    일반적으로 리다이렉트 시에는 쿼리스트링으로 데이터를 전달하여 데이터가 노출되고
 *    보안에 취약할 수 있고 크기에 제한이 있지만
 *    RedirectAttributes 를 사용하면, 데이터를 url에 노출하지 않고 전달할 수 있고, 데이터 크기에도 제한이 없다. 
 * 
 * redirectAttributes.addFlashAttribute() : 객체를 보낼 수 있다. 
 */
}

// View Detail
@GetMapping("/{itemId}")
public String item(@PathVariable long itemId, Model model) {
  Item item = itemRepository.findById(itemId);
  model.addAttribute("item", item);
  return "basic/item";
}

// Edit Form
@GetMapping("/{itemId}/edit")
public String editForm(@PathVariable Long itemId, Model model) {
  Item item = itemRepository.findById(itemId);
  model.addAttribute("item", item);
  return "basic/editForm";
}

// Edit Process
@PostMapping("/{itemId}/edit")
public String edit(@PathVariable Long itemId, @ModelAttribute Item item) {
  itemRepository.update(itemId, item);
  return "redirect:/basic/items/{itemId}";
}
/** 
 * ( @ModelAttribute Item item ) == model.addAttribute("item", item); 코드가 생략된 상황. 
 * 리다이렉트된 URL에서도 모델에 추가된 객체를 사용할 수 있다. ex) ${item.id}
**/

```

<br/>
<hr>
<br/>







