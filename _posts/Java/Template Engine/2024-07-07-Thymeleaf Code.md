---
title: "Thymeleaf Code"
description: "Thymeleaf Code"
date: 2024-07-07
categories: [ Java, Java Template Engine ]
tags: [ Java, Java Template Engine ]
---

## selectBox

- selectBox에 th:field 속성을 주었을 경우, option들의 th:value 값이 존재해야 렌더링된다. 

```html
<select class="select block" th:field="*{searchField}">
	<option th:value="''">선택</option>
	<option th:value="'searchId'">아이디</option>
	<option th:value="'searchName'">이름</option>
	<option th:value="'searchDepartment'">부서</option>
</select>
```

<br/>
<hr>

## th:attr

- th:attr: 하나 이상의 HTML 속성을 동적으로 설정 가능
	- th:onclick 속성만으로 코드를 적용하려니 동작이 되지 않았음. 
	- 수정된 코드
		- <a th:attr="onclick=${administrators.first} ? 'return false;' : |pagination('${pageType}', ${pageNumber - 1});|"

