---
layout: post
title: URL_Mapping
date: 2024-01-24 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: urlMapping.jpg # Add image post (optional)
tags: [URL Mapping] # add tag
---

<br/>

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
```

<br/>
<hr>
<br/>







