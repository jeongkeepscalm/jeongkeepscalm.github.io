---
title: "Java-Lambda"
description: Java-Lambda
date: 2025-07-05
categories: [ Java, Java Basic ]
tags: [ Java, Java Basic, kyh ]
---

### Lambda

- 익명 클래스 사용의 보일러플레이트 코드를 크게 줄이고, 간결한 코드로 생산성과 가독성을 높일 수 있다.
	- 보일러플레이트 코드: 반복적으로 작성해야 하는 고정된 형식의 코드
- 대부분의 익명 클래스는 람다로 대체할 수 있다.
- 람다를 사용할 때 new 키워드를 사용하지 않지만, 람다도 익명 클래스처럼 인스턴스가 생성된다.
- 함수형 인터페이스에만 할당 가능
	- 함수형 인터페이스: 정확히 하나의 추상 메서드를 가지는 인터페이스
	- 단일 추상 메서드: SAM(Single Abstract Method)

### 고차함수

- 함수를 인자로 받거나 함수를 반환하는 메소드
- 함수를 다루는 추상화 수준이 더 높다는 데에서 유래

```java
// 함수(람다)를 매개변수로 받음
static void calculate(MyFunction function) {
  // ...
}

// 함수(람다)를 반환
static MyFunction getOperation(String operator) {
  // ...
  return (a, b) -> a + b;
}
```




- 소스코드: <https://github.com/jeongkeepscalm/java-lambda/tree/master/src> 