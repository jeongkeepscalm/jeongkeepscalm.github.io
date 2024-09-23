---
title: "[Issue] Integer Overflow"
description: "[Issue] Integer Overflow"
date: 2024-09-09
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

- GetMapping 에 해당하는 url("https://test.com/board/detail/5")이 존재하고 해당 메소드의 파라미터 타입이 Integer 일 경우에 정수 범위보다 큰 숫자를 입력시 에러가 발생한다.   
  - e.g. "https://test.com/board/detail/52131232132142142142141"  
  - **정수 범위를 초과하는 값이 전달되면 Integer로 변환할 수 없기 때문에 handleMethodArgumentTypeMismatchException 발생**
- 이 때, 서버 내부 에러발생하며 해당 에러를 잡아 404 페이지로 리턴한다. 


***RestControllerAdvice***

```java
@ExceptionHandler(MethodArgumentTypeMismatchException.class)
public void handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e, HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
  request.getRequestDispatcher("/404").forward(request, response);
}
```
`MethodArgumentTypeMismatchException`: 매개변수 타입이 요청 파라미터와 불일치 시 발생하는 예외  

