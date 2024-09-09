---
title: "[Issue] Integer Overflow"
description: "[Issue] Integer Overflow"
date: 2024-09-09
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

### Issue

- "https://test.com/board/detail/5" GetMapping 에 해당하는 url 이 존재하고 해당 메소드의 파라미터 타입이 Integer 일 경우에 정수 범위보다 큰 숫자를 입력시 에러가 발생한다.   
  - e.g. "https://test.com/board/detail/52131232132142142142141"  
- 이 때, 서버 내부 에러발생하며 해당 에러를 잡아 404 페이지로 리턴한다. 


***RestControllerAdvice***

```java
@ExceptionHandler(MethodArgumentTypeMismatchException.class)
public void handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e, HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
  log.error("::::: handleMethodArgumentTypeMismatchException: ", e);
  request.getRequestDispatcher("/404").forward(request, response);
}
```
