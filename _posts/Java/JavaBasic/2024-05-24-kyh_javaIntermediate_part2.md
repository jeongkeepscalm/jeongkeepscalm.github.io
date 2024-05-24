---
title: "[KYH] JAVA Intermediate_part2"
description: java
date: 2024-05-24
categories: [ Java, Java Basic ]
tags: [ Java, Java Basic, kyh, intermediate ]
---

## Generic

* Generic Class  
  코드를 재사용할 수 있고 타입의 안전성을 보장한다.  
  타입을 지정하여 인스턴스를 생성할 수 있다.   

<details>
<summary><span style="color:yellow" class="point"><b>메타 데이터 조회</b></span></summary>
<div markdown="1">   

```java
public class GenericBox<T> {

  private T value;

  public T get() {
    return value;
  }

  public void set(T value) {
    this.value = value;
  }

}

package generic.ex1;

public class BoxMain3 {

  public static void main(String[] args) {

    /**
     * 생성 시점에 T의 타입이 결정된다.
     */
    GenericBox<Integer> integerBox = new GenericBox<Integer>();
    integerBox.set(10);
    // integerBox.set("hello"); // Integer 타입만 허용, 컴파일 오류
    Integer integer = integerBox.get();
    System.out.println("integer = " + integer);

    // 타입 추론: 생성하는 제네릭 타입 생략 가능
    GenericBox<String> stringBox = new GenericBox<>();
    stringBox.set("genericString");
    String str = stringBox.get();
    System.out.println("str = " + str);
  }

}
```
> ```제네릭 클래스```: <>를 사용한 클래스  
> ```<T>```: 타입 매개변수  
> 클래스 내부에 T 타입이 필요한 곳에 T value 와 같이 타입 매개변수를 적어준다.  
> ```타입추론```: 자바가 스스로 타입 정보를 추론해서 개발자가 타입 정보를 생략할 수 있는 것  

<div>
</details>

