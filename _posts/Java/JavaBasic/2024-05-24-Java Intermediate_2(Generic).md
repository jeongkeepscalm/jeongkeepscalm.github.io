---
title: "Java Intermediate_2 (Generic CollectionFramework)"
description: "Java Intermediate_2 (Generic CollectionFramework)"
date: 2024-05-24
categories: [Java, Java Basic]
tags: [Java, Java Basic, kyh, intermediate]
---

# 제네릭(Generic)

- 제네릭 타입  
  제네릭 클래스, 제네릭 인터페이스를 모두 합쳐 제네릭 타입으로 부른다.  
  예: class GenericBox<T> {private T t;}  
  GenericBox<T> 을 제네릭 타입이라 부른다.
- 타입 매개변수(Type Parameter)  
  제네릭 타입이나 메소드에서 사용되는 변수로, 실제 타입으로 대체된다.  
  예: GenericBox<T>  
  T를 타입 매개변수라 한다.
- 타입 인자(Type Argument)  
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

> `제네릭 클래스`: <>를 사용한 클래스  
> `<T>`: 타입 매개변수  
> 클래스 내부에 T 타입이 필요한 곳에 T value 와 같이 타입 매개변수를 적어준다.  
> `타입추론`: 자바가 스스로 타입 정보를 추론해서 개발자가 타입 정보를 생략할 수 있는 것

</div>
</details>

<br/>

- Raw Type  
  제네릭 타입 인스턴스 생성 시, 타입 인자 없이 생성하는 것  
  권장하지 않으므로, Object 타입 인자로 명시하는 것을 권장한다.

<details>
<summary><span style="color:orange" class="point"><b>메타 데이터 조회</b></span></summary>
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

</div>
</details>

<br/>

<details>
<summary><span style="color:orange" class="point"><b>타입 매개변수 상한</b></span></summary>
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

</div>
</details>

<br/>

- 제네릭 메소드  
  정의: <T> T genericMethod(T t)  
  메소드를 호출하는 시점에 타입인자를 전달한다.

<details>
<summary><span style="color:orange" class="point"><b>Generic Method</b></span></summary>
<div markdown="1">

```java

public class AnimalMethod {

  /**
   * Created Static Generic Method
   */
  public static <T extends Animal> void checkup(T t) {
    System.out.println("동물 이름: " + t.getName());
    System.out.println("동물 크기: " + t.getSize());
    t.sound();
  }

  public static <T extends Animal> T bigger(T t1, T t2) {
    return t1.getSize() > t2.getSize() ? t1 : t2;
  }

}

public class MethodMain2 {

  public static void main(String[] args) {

    Dog dog = new Dog("dog1", 100);
    Cat cat = new Cat("cat1", 200);

    /**
     * 타입 매개변수 추론으로 생략 가능
     */
    AnimalMethod.checkup(dog);
    AnimalMethod.checkup(cat);
    // AnimalMethod.<Dog>checkup(dog);
    // AnimalMethod.<Cat>checkup(cat);

    Dog targetDog = new Dog("targetDog", 150);
    Dog biggerOne = AnimalMethod.bigger(targetDog, dog);
    // Dog biggerOne = AnimalMethod.<Dog>bigger(targetDog, dog);
    System.out.println("biggerOne = " + biggerOne);

  }

}
```

</div>
</details>

<br/>

- 와일드 카드
  와일드카드는 제네릭타입/제네릭메소드가 아니라 이미 만들어진 제네릭타입/제네릭메소드를 활용할 때 사용된다.  
  제네릭타입/제네릭메소드를 쉽게 사용할 수 있게해주는 도구

<details>
<summary><span style="color:orange" class="point"><b>Wildcard Example</b></span></summary>
<div markdown="1">

```java

public class Box<T> {
  private T value;
  public void set(T value) {
    this.value = value;
  }
  public T get() {
    return value;
  }
}

public class WildcardEx {
  static <T> void printGenericV1(Box<T> box) { // Box 라는 제네릭 타입을 받는다.
    System.out.println("T = "+ box.get());
  }
  static void printWildcardV1(Box<?> box) { // wildcard 변환
    System.out.println("? = "+ box.get());
  }

  static <T extends Animal> void printGenericV2(Box<T> box) { // Box 라는 제네릭 타입을 받지만 Animal 이 들어있는 박스
    T t = box.get();
    System.out.println("동물 이름: " + t.getName());
  }
  static void printWildcardV2(Box<? extends Animal> box) { // wildcard 변환
    Animal animal = box.get();
    System.out.println("동물 이름: " + animal.getName());
  }

  static <T extends Animal> T printAndReturnGeneric(Box<T> box) { // 동물이름 출력 후 반환
    T t = box.get();
    System.out.println("동물 이름: " + t.getName());
    return t;
  }
  static Animal printAndReturnWildcard(Box<? extends Animal> box) { // wildcard 변환
    Animal animal = box.get();
    System.out.println("동물 이름: " + animal.getName());
    return animal;
  }

}

public class WildcardMain1 {
  public static void main(String[] args) {
    Box<Object> objectBox = new Box<>();
    Box<Dog> dogBox = new Box<>();
    Box<Cat> catBox = new Box<>();

    dogBox.set(new Dog("멍멍이", 100));
    WildcardEx.printGenericV1(dogBox);
    WildcardEx.printWildcardV1(dogBox);

    WildcardEx.printGenericV2(dogBox);
    WildcardEx.printWildcardV2(dogBox);

    Dog dog = WildcardEx.printAndReturnGeneric(dogBox);
    Animal animal = WildcardEx.printAndReturnWildcard(dogBox);
  }

}
```

</div>
</details>

<br/>

**_제네릭 메소드 실행 예시_**

```java
//1. 전달
printGenericV1(dogBox)
//2. 제네릭 타입 결정 dogBox는 Box<Dog> 타입, 타입 추론 -> T의 타입은 Dog
static <T> void printGenericV1(Box<T> box) {
  System.out.println("T = " + box.get());
}
//3. 타입 인자 결정
static <Dog> void printGenericV1(Box<Dog> box) {
  System.out.println("T = " + box.get());
}
//4. 최종 실행 메서드
static void printGenericV1(Box<Dog> box) {
  System.out.println("T = " + box.get());
}
```

**_와일드 카드 실행 예시_**

```java
// 1. 전달(제네릭 메서드가 아닌 일반적인 메서드)
printWildcardV1(dogBox)
//2. 최종 실행 메서드, 와일드카드 ?는 모든 타입을 받을 수 있다.
static void printWildcardV1(Box<?> box) {
  System.out.println("? = " + box.get());
}
```

> 특정 시점에 타입 매개변수에 타입 인자를 전달해서 타입을 결정해야 하는 것은 번거롭다.  
> **제네릭 타입이나 제네릭 메서드를 정의하는게 꼭 필요한 상황이 아니라면, 더 단순한 와일드카드 사용하자**

- 제네릭 메소드를 사용해야 하는 경우  
  상한 와일드카드 메소드 사용 시 리턴 타입을 최상위 부모클래스로 정해져있다.  
  **즉, 리턴 타입을 하위 타입으로 지정하고 싶을 경우에** 제네릭 메소드를 사용해야 한다.

<details>
<summary><span style="color:orange" class="point"><b>하한 와일드 카드</b></span></summary>
<div markdown="1">

```java
public class WildcardMain2 {
  public static void main(String[] args) {
    Box<Object> objectBox = new Box<>();
    Box<Animal> animalBox = new Box<>();
    Box<Dog> dogBox = new Box<>();
    Box<Cat> catBox = new Box<>();

    // Animal 포함 상위 타입 전달 가능
    writeBox(objectBox);
    writeBox(animalBox);
    // writeBox(dogBox);
    // writeBox(catBox);

  }

  // 하한 와일드카드: Animal 포함 상위 클래스만 받는다.
  static void writeBox(Box<? super Animal> box) {
    box.set(new Dog("dog", 100));
  }

}

```

</div>
</details>

<br/>

- 타입 이레이저(Eraser)  
  자바의 제네릭 타입은 컴파일 시점에만 존재하고, 런타임 시에는 제네릭 정보가 지워진다.  
  제네릭은 타입매개변수가 지정되고 컴파일되고 난 후에 사라진다.  
  (클래스 파일에 지정된 타입매개변수가 Object로 변한 것을 확인 할 수 있다.)  
  하지만 내부적으로 다음 컴파일 시 지정된 타입매개변수로 캐스팅하여 실행하므로 문제가 되지 않는다.