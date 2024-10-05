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

<br/>
<hr>

# 배열(Array)

- 배열의 특징
  - 배열에서 자료를 찾을 때 인덱스(index)를 사용하면 매우 빠르게 자료를 찾을 수 있다.
  - 인덱스를 통한 입력, 변경, 조회의 경우 한번의 계산으로 자료의 위치를 찾을 수 있다.
  - 가장 기본적인 자료 구조이고, 인덱스를 사용할 때 최고의 효율
- 배열의 인덱스 활용
  - <img src="/assets/img/kyh_java/array_index.png" width="600px" />
  - 공식: 배열의 시작 참조 + (자료의 크기 \* 인덱스 위치)
  - O(1): 한번의 계산으로 필요한 위치를 찾아서 처리

### 빅오(O) 표기법

- 알고리즘의 성능을 분석할 때 사용하는 수학적 표현 방식
- 알고리즘이 처리해야할 데이터의 양이 증가할 때, 그 알고리즘이 얼마나 빠르게 실행되는지 나타냄(성능의 변화 추세를 비교하는데 사용)
- 빅오 표기법 예시
  - O(1) - 상수 시간
    - 입력 데이터의 크기에 관계없이 알고리즘의 실행 시간이 일정한다.
    - 예: 배열에서 인덱스를 사용하는 경우
  - O(n) - 선형 시간
    - 알고리즘의 실행 시간이 입력 데이터의 크기에 비례하여 증가한다.
    - 예: 배열의 검색, 배열의 모든 요소를 순회하는 경우
  - O(n²) - 제곱 시간
    - 알고리즘의 실행 시간이 입력 데이터의 크기의 제곱에 비례하여 - 증가한다.
    - n²은 n \* n 을 뜻한다.
    - 예: 보통 이중 루프를 사용하는 알고리즘에서 나타남
  - O(log n) - 로그 시간
    - 알고리즘의 실행 시간이 데이터 크기의 로그에 비례하여 - 증가한다.
    - 예: 이진 탐색
  - O(n log n) - 선형 로그 시간
    - 예: 많은 효율적인 정렬 알고리즘들
- 정리

  - 배열의 인덱스 사용: O(1)
  - 배열의 순차 검색: O(n)

- 배열 데이터 추가
  - 배열의 첫번째 위치에 추가: O(n)
  - 배열의 중간 위치에 추가: O(n)
  - 배열의 마지막 위치에 추가: O(1)
- 배열의 한계: 배열의 크기를 배열 생성 시점에 미리 정해야 한다.

<br/>
<hr>

# 3. 리스트(List)

- 배열 vs 리스트
  - 배열: 순서 존재, 중복 허용. 크기가 정적으로 고정
  - 리스트: 순서 존재, 중복 허용. 크기가 동적으로 변함

### 배열 리스트(ArrayList)

- 초기에 정한 배열의 크기를 초과할 경우 크기가 2배인 배열을 만들어 복사
- 데이터 추가
  - 배열의 첫번째 위치에 추가/삭제: O(n)
  - 배열의 중간 위치에 추가/삭제: O(n)
  - 배열의 마지막 위치에 추가/삭제: O(1)
- 인덱스 조회: O(1)
- 데이터 검색: O(n)
- **_정리_**
  - 배열 리스트는 순서대로 데이터를 추가/삭제 시 성능이 좋다.
  - 앞, 중간에 데이터 추가/삭제 성능이 좋지 않다.

<details>
<summary><span style="color:orange" class="point"><b>MyArrayList Code</b></span></summary>
<div markdown="1">

```java
public class MyArrayListV3 {

  private static final int DEFAULT_CAPACITY = 5;

  private Object[] elementData;
  private int size = 0;

  // 생성자
  public MyArrayListV3() {
    elementData = new Object[DEFAULT_CAPACITY];
  }
  public MyArrayListV3(int initialCapacity) {
    elementData = new Object[initialCapacity];
  }

  public int size() {
    return size;
  }

  public void add(Object e) {
    if (size == elementData.length) {
      grow();
    }
    elementData[size] = e;
    size++;
  }

  // 특정 인덱스에 값을 추가한다.
  public void add(int index, Object e) {
    if (elementData.length == size) {
      grow();
    }
    getShiftRightFrom(index);
    elementData[size] = e;
    size++;
  }

  // 배열의 길이를 2배로 늘린다.
  public void grow() {
    elementData = Arrays.copyOf(elementData, elementData.length * 2);
  }

  // 해당 인덱스부터 값을 한 칸씩 오른쪽으로 옮김
  public void getShiftRightFrom(int index) {
    for (int i = size; i > index; i--) {
      elementData[i] = elementData[i - 1];
    }
  }

  // 인덱스에 해당되는 값을 리턴
  public Object get(int index) {
    return elementData[index];
  }

  // 해당 인덱스의 값 변경(변경되기 전 값 리턴)
  public Object set(int index, Object e) {
    Object oldValue = get(index);
    elementData[index] = e;
    return oldValue;
  }

  public Object remove(int index) {
    Object oldValue = get(index);
    shiftLeftFrom(index);
    size--;
    elementData[size] = null;
    return oldValue;
  }

  // 해당 인덱스까지 들어있는 값들을 왼쪽으로 옮김
  public void shiftLeftFrom(int index) {
    for (int i = index; i < size - 1; i++) {
      elementData[i] = elementData[i + 1];
    }
  }

  // 인덱스 반환
  public int indexOf (Object o) {
    return IntStream.range(0, size).filter(i -> o.equals(elementData[i])).findFirst().orElse(-1);
  }

  @Override
  public String toString() {
    return Arrays.toString(Arrays.copyOf(elementData, size)) + " size=" +
            size + ", capacity=" + elementData.length;
  }

}
```

</div>
</details>
  
<details>
<summary><span style="color:orange" class="point"><b>MyArrayList Generic Code</b></span></summary>
<div markdown="1">

```java
public class MyArrayListV4_generic<E> {

  /**
   * Object -> E 타입변경
   *    변경 x
   *    필드: Object[]
   *    생성자: Object
   */

  private static final int DEFAULT_CAPACITY = 5;

  private Object[] elementData;
  private int size = 0;

  // 생성자
  public MyArrayListV4_generic() {
    elementData = new Object[DEFAULT_CAPACITY];
  }
  public MyArrayListV4_generic(int initialCapacity) {
    elementData = new Object[initialCapacity];
  }

  public int size() {
    return size;
  }

  public void add(E e) {
    if (size == elementData.length) {
      grow();
    }
    elementData[size] = e;
    size++;
  }

  // 특정 인덱스에 값을 추가한다.
  public void add(int index, E e) {
    if (elementData.length == size) {
      grow();
    }
    getShiftRightFrom(index);
    elementData[size] = e;
    size++;
  }

  // 배열의 길이를 2배로 늘린다.
  public void grow() {
    elementData = Arrays.copyOf(elementData, elementData.length * 2);
  }

  // 해당 인덱스부터 값을 한 칸씩 오른쪽으로 옮김
  public void getShiftRightFrom(int index) {
    for (int i = size; i > index; i--) {
      elementData[i] = elementData[i - 1];
    }
  }

  // 인덱스에 해당되는 값을 리턴
  public E get(int index) {
    return (E) elementData[index];
  }

  // 해당 인덱스의 값 변경(변경되기 전 값 리턴)
  public E set(int index, E e) {
    E oldValue = get(index);
    elementData[index] = e;
    return oldValue;
  }

  public E remove(int index) {
    E oldValue = get(index);
    shiftLeftFrom(index);
    size--;
    elementData[size] = null;
    return oldValue;
  }

  // 해당 인덱스까지 들어있는 값들을 왼쪽으로 옮김
  public void shiftLeftFrom(int index) {
    for (int i = index; i < size - 1; i++) {
      elementData[i] = elementData[i + 1];
    }
  }

  // 인덱스 반환
  public int indexOf (E o) {
    return IntStream.range(0, size).filter(i -> o.equals(elementData[i])).findFirst().orElse(-1);
  }

  @Override
  public String toString() {
    return Arrays.toString(Arrays.copyOf(elementData, size)) + " size=" +
            size + ", capacity=" + elementData.length;
  }

}
```

> Object[]: 제네릭의 한계  
> 제네릭은 런타임에 이레이저에 의해 타입 정보가 사라진다.  
> 따라서, 런타임에 타입 정보가 필요한 생성자에 사용할 수 없다.  
> **생성자에는 제네릭의 타입 매개변수를 사용할 수 없다.**

</div>
</details>

### 연결 리스트(LinkedList)

- 낭비되는 메모리 없이 필요한 만큼만 메모리를 확보해서 사용
- 앞/중간에 데이터 추가/삭제 시 효율적인 자료 구조
- 노드 구조
  - <img src="/assets/img/kyh_java/node.png" width="600px" />
  - 는 각각의 노드가 참조를 통해 연결(Link, 링크) 되어 있다.
- **_ArrayList vs LinkedList_**
  - <img src="/assets/img/kyh_java/compareArrayListToLinkedList.png" width="600px" />
  - ArrayList: 데이터 조회할 일 많고 뒷 부분에 데이터 추가 시
  - LinkedList: 앞쪽에 데이터 추가/삭제 시

<details>
<summary><span style="color:orange" class="point"><b>Node Code</b></span></summary>
<div markdown="1">

```java
public class Node {

  Object item;
  Node next;

  public Node(Object item) {
    this.item = item;
  }

  @Override
  public String toString() {

    StringBuilder sb = new StringBuilder();

    Node x = this;
    sb.append("[");
    while (x != null) {
      sb.append(x.item);
      if (x.next != null) {
        sb.append(" -> ");
      }
      x = x.next;
    }
    sb.append("]");

    return sb.toString();
  }

  public String toString2() {

    StringBuilder sb = new StringBuilder("[");
    for (Node x = this; x != null; x = x.next) {
      sb.append(x.item).append(x.next != null ? " -> " : "");
    }
    return sb.append("]").toString();
  }

}
```

```java
public static void main(String[] args) {

  Node first = new Node("A");
  first.next =  new Node("B");
  first.next.next = new Node("C");
  first.next.next.next = new Node("D");

  System.out.println(first); // [A -> B -> C -> D]

}
```

```java
public static void main(String[] args) {

  // 노드 생성하고 연결하기: A -> B -> C
  Node first = new Node("A");
  first.next = new Node("B");
  first.next.next = new Node("C");
  System.out.println(first);

  // 모든 노드 탐색하기
  System.out.println("모든 노트 탐색하기");
  printAll(first);

  // 마지막 노드 조회하기
  Node lastNode = getLastNode(first);
  System.out.println("lastNode = " + lastNode);

  // 특정 index 노드 조회하기
  int index = 2;
  Node index2Node = getNode(first, index);
  System.out.println("index2Node = " + index2Node.item);

  // 데이터 추가하기
  System.out.println("데이터 추가하기");
  add(first, "D");
  System.out.println(first);
  add(first, "E");
  System.out.println(first);
  add(first, "F");
  System.out.println(first);
}

private static void add(Node node, Object object) {
  Node lastNode = getLastNode(node);
  lastNode.next = new Node(object);
}

private static Node getNode(Node node, int index) {
  Node x = node;
  for (int i = 0; i < index; i++) {
    x = x.next;
  }
  return x;
}

private static Node getLastNode(Node node) {
  Node x = node;
  while (x.next != null) {
    x = x.next;
  }
  return x;
}

private static void printAll(Node node) {
  Node x = node;
  while (x != null) {
    System.out.println(x.item);
    x = x.next;
  }
}
```

</div>
</details>

<br/>

<details>
<summary><span style="color:orange" class="point"><b>LinkedList Code</b></span></summary>
<div markdown="1">

```java
public class MyLinkedListV2 {

  private Node first; // List 역할
  private int size = 0;

  public void add(Object e) {
    Node newNode = new Node(e);
    if (first == null) {
      first = newNode;
    } else {
      Node lastNode = getLastNode();
      lastNode.next = newNode;
    }
    size++;
  }

  // 추가된 코드
  public void add(int index, Object e) {
    Node newNode = new Node(e);
    if (index == 0) {
      newNode.next = first;
      first = newNode;
    } else {
      Node prev = getNode(index - 1);
      newNode.next = prev.next;
      prev.next = newNode;
    }
    size++;
  }

  // 추가된 코드
  public Object remove(int index) {

    Node nodeToRemove = getNode(index);
    Object removedItem = nodeToRemove.item;

    if (index == 0) {
      first = nodeToRemove.next;
    } else {
      Node previousNode = getNode(index-1);
      previousNode.next = nodeToRemove.next;
    }

    nodeToRemove.item = null;
    nodeToRemove.next = null;
    size--;

    return removedItem;
  }

  private Node getLastNode() {
    Node x = first;
    while (x.next != null) {
      x = x.next;
    }
    return x;
  }

  public Object set(int index, Object element) {
    Node x = getNode(index);
    Object oldItem = x.item;
    x.item = element;
    return oldItem;
  }

  public Object get(int index) {
    Node node = getNode(index);
    return node.item;
  }

  public Node getNode(int index) {
    Node x = first;
    for (int i = 0; i < index; i++) {
      x = x.next;
    }
    return x;
  }

  public int indexOf(Object o) {
    int index = 0;
    for (Node i = first; i.next != null; i = i.next) {
      if (o.equals(i.item)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  public int size() {
    return size;
  }
  @Override
  public String toString() {
    return "MyLinkedListV1{" +
            "first=" + first +
            ", size=" + size +
            '}';
  }

}
```

</div>
</details>

<br/>

<details>
<summary><span style="color:orange" class="point"><b>이중 연결 리스트 예시</b></span></summary>
<div markdown="1">

```java
public class Node {
  Object item;
  Node next; //다음 노드 참조
  Node prev; //이전 노드 참조
}

public class LinkedList {
  private Node first;
  private Node last; //마지막 노드 참조
  private int size = 0;
}
```

</div>
</details>

<br/>

<details>
<summary><span style="color:orange" class="point"><b>LinkedList Generic Code</b></span></summary>
<div markdown="1">

```java
public class MyLinkedListV3 <E> {

  private Node<E> first; // List 역할
  private int size = 0;

  public void add(E e) {
    Node<E> newNode = new Node(e);
    if (first == null) {
      first = newNode;
    } else {
      Node lastNode = getLastNode();
      lastNode.next = newNode;
    }
    size++;
  }

  // 추가된 코드
  public void add(int index, E e) {
    Node<E> newNode = new Node<>(e);
    if (index == 0) {
      newNode.next = first;
      first = newNode;
    } else {
      Node<E> prev = getNode(index - 1);
      newNode.next = prev.next;
      prev.next = newNode;
    }
    size++;
  }

  // 추가된 코드
  public E remove(int index) {

    Node<E> nodeToRemove = getNode(index);
    E removedItem = nodeToRemove.item;

    if (index == 0) {
      first = nodeToRemove.next;
    } else {
      Node<E> previousNode = getNode(index-1);
      previousNode.next = nodeToRemove.next;
    }

    nodeToRemove.item = null;
    nodeToRemove.next = null;
    size--;

    return removedItem;
  }

  private Node<E> getLastNode() {
    Node<E> x = first;
    while (x.next != null) {
      x = x.next;
    }
    return x;
  }

  public E set(int index, E element) {
    Node<E> x = getNode(index);
    E oldItem = x.item;
    x.item = element;
    return oldItem;
  }

  public E get(int index) {
    Node<E> node = getNode(index);
    return node.item;
  }

  public Node<E> getNode(int index) {
    Node<E> x = first;
    for (int i = 0; i < index; i++) {
      x = x.next;
    }
    return x;
  }

  public int indexOf(E o) {
    int index = 0;
    for (Node i = first; i.next != null; i = i.next) {
      if (o.equals(i.item)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  public int size() {
    return size;
  }
  @Override
  public String toString() {
    return "MyLinkedListV1{" +
            "first=" + first +
            ", size=" + size +
            '}';
  }

  private static class Node<E> {

    E item;
    Node<E> next;

    public Node(E item) {
      this.item = item;
    }

    @Override
    public String toString() {
      StringBuilder sb = new StringBuilder();
      Node<E> temp = this;
      sb.append("[");
      while (temp != null) {
        sb.append(temp.item);
        if (temp.next != null) {
          sb.append("->");
        }
        temp = temp.next;
      }
      sb.append("]");
      return sb.toString();
    }

  }

}
```

</div>
</details>

<br/>
<hr>

# 리스트 추상화

**_구체적인 클레스에 의존하는 코드_**

```java
public class BatchProcessor {
  private final MyLinkedList<Integer> list = new MyLinkedList<>();
  public void logic(int size) {
    for (int i = 0; i < size; i++) {
      list.add(0, i); //앞에 추가
    }
  }
}
```

<br/>

**_추상적인 클래스에 의존_**

```java
public class BatchProcessor {
  private final MyList<Integer> list;
  public BatchProcessor(MyList<Integer> list) {
    this.list = list;
  }
  public void logic(int size) {
    for (int i = 0; i < size; i++) {
      list.add(0, i); // 앞에 추가
    }
  }
}

main() {
  new BatchProcessor(new MyArrayList()); // MyArrayList를 사용하고 싶을 때
  new BatchProcessor(new MyLinkedList()); // MyLinkedList를 사용하고 싶을 때
}
```

<br/>

## 컴파일 타임 의존관계 vs 런타임 의존관계

- 컴파일 타임 의존관계
  - <img src="/assets/img/kyh_java/compile.jpg" width="600px" />
  - 실행하지 않은 소스 코드에 정적으로 나타나는 의존관계
  - BatchProcessor 클래스는 MyList 인터페이스에만 의존
- 런타임 의존관계
  - <img src="/assets/img/kyh_java/runtime.jpg" width="600px" />
