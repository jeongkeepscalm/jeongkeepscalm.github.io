---
title: "[KYH] JAVA Intermediate_part2"
description: java
date: 2024-05-24
categories: [ Java, Java Basic ]
tags: [ Java, Java Basic, kyh, intermediate ]
---

## Generic

* 제네릭 타입  
  제네릭 클래스, 제네릭 인터페이스를 모두 합쳐 제네릭 타입으로 부른다.  
  예: class GenericBox<T> {private T t;}  
  GenericBox<T> 을 제네릭 타입이라 부른다.  
  
* 타입 매개변수(Type Parameter)  
  제네릭 타입이나 메소드에서 사용되는 변수로, 실제 타입으로 대체된다.  
  예: GenericBox<T>  
  T를 타입 매개변수라 한다.  
  
* 타입 인자(Type Argument)  
  제네릭 타입을 사용할 때 제공되는 실제 타입  
  예: GenericBox<Integer>  
  Integer를 타입 인자라 한다.  
  기본형이 아닌 참조형만 사용 가능하다.  
  
<details>
<summary><span style="color:orange" class="point"><b>Generic Class</b></span></summary>
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

<br/>

* Raw Type  
  제네릭 타입 인스턴스 생성 시, 타입 인자 없이 생성하는 것  
  권장하지 않으므로, Object 타입 인자로 명시하는 것을 권장한다.  

<details>
<summary><span style="color:yellow" class="point"><b>메타 데이터 조회</b></span></summary>
<div markdown="1">   

```java
public class RawTypeMain {
  public static void main(String[] args) {
    GenericBox integerBox = new GenericBox();
    //GenericBox<Object> integerBox = new GenericBox<>(); // 권장
    integerBox.set(10);
    Integer result = (Integer) integerBox.get();
    System.out.println("result = " + result);
  }
}
```

<div>
</details>

<br/>

<details>
<summary><span style="color:yellow" class="point"><b>타입 매개변수 상한</b></span></summary>
<div markdown="1">   

```java
public class AnimalHospitalV3<T extends Animal> {

  private T animal;

  public void set(T animal) {
    this.animal = animal;
  }

  public void checkup() {
     System.out.println("동물 이름: " + animal.getName());
     System.out.println("동물 크기: " + animal.getSize());
     animal.sound();
  }

  public T bigger(T target) {
     return animal.getSize() > target.getSize() ? animal : target;
  }
}
```
> <T extends Animal> {}: Animal 과 하위 타입만 받는다.  
> 타임 매개변수에 입력될 수 있는 값의 범위 예측이 가능하다.    

<br/>

```java
public class AnimalHospitalMainV3 {

  public static void main(String[] args) {

    AnimalHospitalV3<Dog> dogHospital = new AnimalHospitalV3<>();
    AnimalHospitalV3<Cat> catHospital = new AnimalHospitalV3<>();

    Dog dog1 = new Dog("dog1", 100);
    Cat cat1 = new Cat("cat1", 300);

    // 개 병원
    dogHospital.set(dog1);
    dogHospital.checkup();

    // 고양이 병원
    catHospital.set(cat1);
    catHospital.checkup();

    // 문제1: 개 병원에 고양이 전달
     // dogHospital.set(cat1); // 타입 제한

    // 문제2: 개 타입 반환
    dogHospital.set(dog1);
    Dog biggerDog = dogHospital.bigger(new Dog("dog2", 500));
    System.out.println("biggerDog = " + biggerDog);

    /**
     * 코드 재사용성 o
     *    다형성을 통해 AnimalHospitalV3 하나로 개와 고양이를 모두 처리
     * 타입 안정성 o
     *    개 병원에 고양이를 전달하는 문제 해결
     */

  }

}
```

<div>
</details>
