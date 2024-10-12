---
title: "Java Intermediate_2 (CollectionFramework)"
description: "Java Intermediate_2 (CollectionFramework)"
date: 2024-10-08
categories: [Java, Java Basic]
tags: [Java, Java Basic, kyh, intermediate]
---

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

<hr>

# Collection Interface

- 데이터 그룹을 다루기 위한 메소드 정의
- List, Set, Queue, Deque 와 같은 다양한 하위 인터페이스와 함께 사용됨

# 리스트(List)

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

**전반적으로 ArrayList가 LinkedList 보다 성능이 좋다.**  
**ArrayList 사용하고 앞부분에 몇 십만건의 데이터 추가/제거가 빈번할 경우 그 때, LinkedList 고려**

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

<hr>

# Hash

- 조회성능 ↑
- 해시 알고리즘(O(n) -> O(1))

  1. 데이터의 값 자체를 배열의 인덱스와 맞추어 저장(큰 배열 사용, 메모리 공간 낭비)
  2. 나머지 연산 (해시 인덱스 활용)

  - <img src="/assets/img/kyh_java/hash.png" width="600px" />
  - int
    <details>
      <summary><span style="color:orange" class="point"><b>Code</b></span></summary>
      <div markdown="1">

    ```java
      public class HashStart {

        static final int CAPACITY = 10;

        public static void main(String[] args) {

            // LinkedList<Integer> 타입의 배열 생성
            LinkedList<Integer>[] buckets = new LinkedList[CAPACITY];

            // 배열 내 LinkedList 삽입
            for (int i = 0; i < CAPACITY; i++) {
                buckets[i] = new LinkedList<>();
            }
            add(buckets, 1);
            add(buckets, 2);
            add(buckets, 5);
            add(buckets, 8);
            add(buckets, 14);
            add(buckets, 99);
            add(buckets, 9); // 중복
            System.out.println("buckets = " + Arrays.toString(buckets));

            int searchValue = 9;
            boolean contains = contains(buckets, searchValue);
            System.out.println("buckets.contains(" + searchValue + ") = " + contains);
        }

        private static void add(LinkedList<Integer>[] buckets, int value) {
            int hashIndex = hashIndex(value);
            LinkedList<Integer> bucket = buckets[hashIndex];    // O(1)
            if (!bucket.contains(value)) {                      // O(n)
                bucket.add(value);
            }
        }

        private static boolean contains(LinkedList<Integer>[] buckets, int searchValue) {
            int hashIndex = hashIndex(searchValue);
            LinkedList<Integer> bucket = buckets[hashIndex];    // O(1)
            return bucket.contains(searchValue);                // O(n)
        }

        static int hashIndex(int value) {
            return value % CAPACITY;
        }

    }
    ```

      </div>
    </details>

  - String
    <details>
      <summary><span style="color:orange" class="point"><b>Code</b></span></summary>
      <div markdown="1">

    ```java
      public class HashMain_String {

          static final int CAPACITY = 10;

          public static void main(String[] args) {

              // 모든 문자는 고유한 숫자로 표현이 가능하다.

              // ASCII 코드 변환
              char charA = 'A';
              char charB = 'B';

              System.out.println("(int) charA = " + (int) charA);
              System.out.println("(int) charB = " + (int) charB);

              // hashCode
              int hashCode_abc = hashCode("A");
              System.out.println("hashCode_abc = " + hashCode_abc);


              // hashIndex
              System.out.println("hashIndex(hashcode(A) = " + hashIndex(hashCode("A")));
              System.out.println("hashIndex(hashcode(B) = " + hashIndex(hashCode("B")));
              System.out.println("hashIndex(hashcode(AB) = " + hashIndex(hashCode("AB")));

          }

          // get hashCode
          static int hashCode(String str) {
              return str.chars().sum();
          }

          static int hashIndex(int value) {
              return value % CAPACITY;
          }

      }
    ```

      </div>
    </details>

### hashCode

<details>
<summary><span style="color:orange" class="point"><b>Code</b></span></summary>
<div markdown="1">
  
```java
public class JavaHashCodeMain {

    public static void main(String[] args) {
    //Object의 기본 hashCode는 객체의 참조값을 기반으로 생성
    Object obj1 = new Object();
    Object obj2 = new Object();
    System.out.println("obj1.hashCode() = " + obj1.hashCode());
    System.out.println("obj2.hashCode() = " + obj2.hashCode());

    //각 클래스마다 hashCode를 이미 오버라이딩 해두었다.
    Integer i = 10;
    String strA = "A";
    String strAB = "AB";
    System.out.println("10.hashCode = " + i.hashCode());
    System.out.println("'A'.hashCode = " + strA.hashCode());
    System.out.println("'AB'.hashCode = " + strAB.hashCode());

    //hashCode는 마이너스 값이 들어올 수 있다.
    System.out.println("-1.hashCode = " + Integer.valueOf(-1).hashCode());

    //둘은 같을까 다를까?, 인스턴스는 다르지만, equals는 같다.
    Member member1 = new Member("idA");
    Member member2 = new Member("idA");

    //equals, hashCode를 오버라이딩 하지 않은 경우와, 한 경우를 비교
    System.out.println("(member1 == member2) = " + (member1 == member2));
    System.out.println("member1 equals member2 = " + member1.equals(member2));
    System.out.println("member1.hashCode() = " + member1.hashCode());
    System.out.println("member2.hashCode() = " + member2.hashCode());

    /*
        obj1.hashCode() = 1324119927
        obj2.hashCode() = 81628611
        10.hashCode = 10
        'A'.hashCode = 65
        'AB'.hashCode = 2081
        -1.hashCode = -1
        (member1 == member2) = false
        member1 equals member2 = true
        member1.hashCode() = 104101
        member2.hashCode() = 104101
    */

    }

}

public class Member {

    private String id;

    public Member(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Member member = (Member) o;
        return Objects.equals(id, member.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Member{" +
                "id='" + id + '\'' +
                '}';
    }
}

```
> 데이터의 값이 같으면 같은 해시코드를 반환한다.  
> Member 객체 내 hashCode를 오버라이딩 함으로써, id의 값이 같으면 동등하다.  
> 오버라이딩을 하지 않고, Object.hashCode() 를 사용할 시, 참조값으로 hashCode를 생성하기에 동등하지 않다.  
> 해시 자료 구조에 데이터를 저장하는 경우, 객체를 직접 만들어야할 때 *equals and hashCode를 재정의* 해야한다.  

</div>
</details>
  
- 동일성 vs 동등성
  - 동일성(`==`): 참조 주소가 같은지 확인
  - 동등성(`equals`)
    - 자바 기본 equals 는 참조 주소값으로 비교한다. (Object.equals() 메소드는 == 을 사용하기 때문)
    - 클래스 내 equals 구현 시 데이터 값이 같은지 확인
  
### 제네릭, 인터페이스 도입한 SET

<details>
<summary><span style="color:orange" class="point"><b>Code</b></span></summary>
<div markdown="1">

```java

// 인터페이스
public interface MySet<E> {
    boolean add(E element);
    boolean remove(E value);
    boolean contains(E value);
}

// 구현체
public class MyHashSetV3<E> implements MySet<E> {

    static final int DEFAULT_INITIAL_CAPACITY = 16;

    private LinkedList<E>[] buckets;

    private int size = 0;
    private int capacity = DEFAULT_INITIAL_CAPACITY;

    public MyHashSetV3() {
        initBuckets();
    }

    public MyHashSetV3(int capacity) {
        this.capacity = capacity;
        initBuckets();
    }

    private void initBuckets() {
        buckets = new LinkedList[capacity];
        for (int i = 0; i < capacity; i++) {
            buckets[i] = new LinkedList<>();
        }
    }

    @Override
    public boolean add(E value) {
        int hashIndex = hashIndex(value);
        LinkedList<E> bucket = buckets[hashIndex];
        if (bucket.contains(value)) {
            return false;
        }

        bucket.add(value);
        size++;
        return true;
    }

    @Override
    public boolean contains(E searchValue) {
        int hashIndex = hashIndex(searchValue);
        LinkedList<E> bucket = buckets[hashIndex];
        return bucket.contains(searchValue);
    }

    @Override
    public boolean remove(E value) {
        int hashIndex = hashIndex(value);
        LinkedList<E> bucket = buckets[hashIndex];
        boolean result = bucket.remove(value);
        if (result) {
            size--;
            return true;
        } else {
            return false;
        }
    }

    private int hashIndex(Object value) {
        //hashCode의 결과로 음수가 나올 수 있다. abs()를 사용해서 마이너스를 제거한다.
        return Math.abs(value.hashCode()) % capacity;
    }

    public int getSize() {
        return size;
    }

    @Override
    public String toString() {
        return "MyHashSetV3{" +
                "buckets=" + Arrays.toString(buckets) +
                ", size=" + size +
                ", capacity=" + capacity +
                '}';
    }
}

// 실행
public class MyHashSetV3Main {
    public static void main(String[] args) {
        MyHashSetV3<String> set = new MyHashSetV3<>(10);
        set.add("A");
        set.add("B");
        set.add("C");
        System.out.println(set);

        //검색
        String searchValue = "A";
        boolean result = set.contains(searchValue);
        System.out.println("bucket.contains(" + searchValue + ") = " + result);
    }
}
```

</div>
</details>

<hr>

# 자바가 제공하는 Set Interface

- Set(interface)
  - HashSet
    - LinkedHashSet
  - TreeSet

## HashSet

- O(1)(해쉬 알고리즘 사용)
- 입력한 데이터의 수가 배열의 크기 75% 정도 넘어가면 성능 저하(해시 인덱스 자주 충돌)
  - 자바의 HashSet은 데이터 양이 배열의 크기 75%를 넘어가면 배열의 크기를 2배로 늘려 늘어난 크기를 기준으로 모든 요소에 해시 인덱스를 재적용한다.(재해싱) 


## LinkedHashSet

- HashSet과 동일하지만 입력한 순서 유지(순서 보장)
- O(1)(해쉬 알고리즘 사용)

## TreeSet

- 이진 탐색 트리를 개선한 레드-블랙 트리 사용
  - 이진 탐색 트리
    - 자식이 2개까지 올수 있는 트리
    - 왼쪽 노드가 더 작고, 오른쪽 노드는 더 큰 값을 가진다.
    - **데이터 입력 시점에 정렬해서 보관**
- 3, 1, 2 순서대로 입력해도 1, 2, 3 으로 출력
- `O(log n)`
  - O(n)인 리스트 검색보다는 빠르고, O(1)인 해시의 검색보다는 느리다. 
  - 2로 나누어서 1에 도달하는 횟수
- `레드-블랙 트리`(이진 트리 탐색 개선)
  - 트리에 균형이 맞지 않을 경우, O(n)의 성능이 나올 가능성이 있을 경우, 중간의 값으로 기준을 재설정
  
- TreeSet의 정렬기준
  - int, String 같은 기본 데이터는 크다, 작다 비교가 명확하기 때문에 정렬 가능하다. 
  - 그 외, 직접 만든 클래스(Member) 크기 비교는 `Comparable`, `Comparator` 인터페이스를 구현해야 한다.
  
***정리***  
- 실무에서 Set이 필요한 경우, HashSet을 가장 많이 사용
- 입력 순서 유지, 값 정렬의 필요에 따라 LinkedHashSet / TreeSet을 선택하여 사용
  
## Test Code

<details>
<summary><span style="color:orange" class="point"><b>test code 1</b></span></summary>
<div markdown="1">

```java
public class Test1 {

    public static void main(String[] args) {

        // 1.
        Integer[] inputArr = {30, 20, 20, 10, 10};

        // 중복 제거(순서 유지 x)
        HashSet<Integer> hashSet = new HashSet<Integer>(List.of(inputArr));
        System.out.println("hashSet = " + hashSet);                 // 20, 10, 30

        // 중복 제거(입력 순서 유지)
        LinkedHashSet<Integer> linkedHashSet = new LinkedHashSet<>(Arrays.asList(inputArr));
        System.out.println("linkedHashSet = " + linkedHashSet);     // 30, 20, 10

        // 중복 제거(입력된 데이터 값으로 정렬)
        TreeSet<Integer> treeSet = new TreeSet<Integer>(List.of(inputArr));
        System.out.println("treeSet = " + treeSet);


        // 2. 두 집합의 합집합, 교집합, 차집합(A-B)을 구하여라
        HashSet<Integer> setA = new HashSet<>(List.of(1, 2, 3, 4, 5));
        HashSet<Integer> setB = new HashSet<>(List.of(3, 4, 5, 6, 7));

        // 합집합
        HashSet<Integer> union = new HashSet<>(setA);
        union.addAll(setB);
        System.out.println("union = " + union);                     // 1, 2, 3, 4, 5, 6, 7

        // 교집합
        HashSet<Integer> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);
        System.out.println("intersection = " + intersection);       // 3, 4, 5

        // 차집합
        HashSet<Integer> differenceSet = new HashSet<>(setA);
        differenceSet.removeAll(setB);
        System.out.println("differenceSet = " + differenceSet);     // 1, 2

    }

}
```

</div>
</details>
  
<details>
<summary><span style="color:orange" class="point"><b>test code 2</b></span></summary>
<div markdown="1">

```java
public class RectangleTest {

    public static void main(String[] args) {

        HashSet<Rectangle> rectangleSet = new HashSet<>();
        rectangleSet.add(new Rectangle(10, 10));
        rectangleSet.add(new Rectangle(20, 20));
        rectangleSet.add(new Rectangle(20, 20)); // 중복

        for (Rectangle rectangle : rectangleSet) {
            System.out.println("rectangle = " + rectangle);
        }

        /*
            before overriding equals & hashCode
                rectangle = Rectangle{width=20, height=20}
                rectangle = Rectangle{width=10, height=10}
                rectangle = Rectangle{width=20, height=20}

            after overriding equals & hashCode
                rectangle = Rectangle{width=10, height=10}
                rectangle = Rectangle{width=20, height=20}
         */

    }

}

public class Rectangle {

    private int width;
    private int height;

    public Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (object == null || getClass() != object.getClass()) return false;
        Rectangle rectangle = (Rectangle) object;
        return width == rectangle.width && height == rectangle.height;
    }

    @Override
    public int hashCode() {
        return Objects.hash(width, height);
    }

    @Override
    public String toString() {
        return "Rectangle{" +
                "width=" + width +
                ", height=" + height +
                '}';
    }
}
```

</div>
</details>

<hr>

# Map(Interface)

- 키-값
- 순서 유지 x
  
- Map(Interface)
  - HashMap
    - LinkedHashMap
  - TreeMap
  
<details>
<summary><span style="color:orange" class="point"><b>Map Code 1</b></span></summary>
<div markdown="1">

```java

public static void main(String[] args) {

    HashMap<String, Integer> studentMap = new HashMap<>();

    studentMap.put("studentA", 90);
    studentMap.put("studentB", 80);
    studentMap.put("studentC", 80);
    studentMap.put("studentD", 100);
    System.out.println("studentMap = " + studentMap);
    // studentMap = {studentB=80, studentA=90, studentD=100, studentC=80}

    // 특정 값 조회
    Integer result = studentMap.get("studentD");
    System.out.println("result = " + result);           // result = 100


    // keySet 활용
    Set<String> keySet = studentMap.keySet();           // SET 자료구조로 반환
    for (String key : keySet) {
        Integer value = studentMap.get(key);
        System.out.println("key = " + key + ", value = " + value);
    }
    /*
        key = studentB, value = 80
        key = studentA, value = 90
        key = studentD, value = 100
        key = studentC, value = 80
      */

    // values 활용
    Collection<Integer> values = studentMap.values();   // 컬렉션 반환
    for (Integer value : values) {
        System.out.println("value = " + value);
    }


    // key values 를 묶어 활용하는 entrySet
    // entry: 키와 값을 저장하는 객체
    Set<Map.Entry<String, Integer>> entries = studentMap.entrySet();
    for (Map.Entry<String, Integer> entry : entries) {
        String key = entry.getKey();
        Integer value = entry.getValue();
        System.out.println("key = " + key + ", value = " + value);
    }


}

```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>Map Code 2</b></span></summary>
<div markdown="1">

```java
public static void main(String[] args) {

    HashMap<String, Integer> map = new HashMap<>();

    // 같은 키로 저장시 덮어 씌어진다. 
    map.put("ojg", 90);
    map.put("ojg", 100);
    System.out.println("map = " + map);     // map = {ojg=100}

    map.putIfAbsent("ojg", 30);
    map.putIfAbsent("hwang", 100);
    System.out.println("map = " + map);     // map = {hwang=100, ojg=100}

}
```

</div>
</details>

### Map vs Set

- HashSet의 구현은 대부분 HashMap의 구현을 가져다 쓴다.
  - HashMap의 값을 더미값으로 저장하고 활용
- HashMap은 HashSet과 작동원리가 같다. 
  
***정리***  
- 실무에서 Map이 필요한 경우 HashMap 많이 사용
- 필요에 따라 LinkedHashMap, TreeMap 선택 

<hr>

# Stack

- Stack 사용 권장 x
  - Stack 클래스는 내부에서 Vector 자료 구조를 사용
  - Vector: 자바 1.0에 개발되었는데, 지금은 사용하지 않고 하위 호환을 위해 존재
  - **Deque 사용 권장**

<hr>

# Queue

- offer: 큐에 값을 넣음
- poll: 큐에서 값을 꺼냄

<hr>

# 데크: Deque(Double Ended Queue)

- Collection(Interface)
  - Queue(Interface)
    - Deque(Interface)
      - ArrayDeque: 원형 큐 자료 구조 사용
      - LinkedList: Deque, List 인터페이스를 모두 구현
  
- stack, queue 기능을 모두 포함
- <img src="/assets/img/kyh_java/deque.png" width="600px" />

  
<details>
<summary><span style="color:orange" class="point"><b>Deque Code</b></span></summary>
<div markdown="1">

```java
public static void main(String[] args) {

    Deque<Integer> deque = new ArrayDeque<>();
    // Deque<Integer> deque = new LinkedList<>();

    deque.offerFirst(1);
    deque.offerFirst(2);
    System.out.println("deque = " + deque);     // deque = [2, 1]
    deque.offerLast(3);
    deque.offerLast(4);
    System.out.println("deque = " + deque);     // deque = [2, 1, 3, 4]

    // 데이터를 꺼내지 않고 단순 조회
    System.out.println("deque.peekFirst() = " + deque.peekFirst()); // 2
    System.out.println("deque.peekFirst() = " + deque.peekLast());  // 4

    // 데이터 꺼내기
    System.out.println("deque.pollFirst() = " + deque.pollFirst()); // 2
    System.out.println("deque.pollFirst() = " + deque.pollFirst()); // 1
    System.out.println("deque.pollLast() = " + deque.pollLast());   // 4
    System.out.println("deque.pollLast() = " + deque.pollLast());   // 3
    System.out.println("deque = " + deque);                         // []

}
```
> 성능: ArrayDeque > LinkedList

</div>
</details>

## Test Code

<details>
<summary><span style="color:orange" class="point"><b>test code 1</b></span></summary>
<div markdown="1">

```java
/*
    map1, map2에 공통으로 들어있는 키 찾고 그 값의 합을 구하기
 */
public class CommonKeyValueSum1 {

    public static void main(String[] args) {

        // map1 생성
        Map<String, Integer> map1 = Map.of("A", 1, "B", 2, "C", 3);

        // map2 생성
        Map<String, Integer> map2 = Map.of("B", 4, "C", 5, "D", 6);

        /**
         * mine
         */
        int sum = 0;
        Set<String> keySet1 = map1.keySet();
        Set<String> keySet2 = map2.keySet();

        // 교집합 추출
        Set<String> intersection = new HashSet<>(keySet1);
        intersection.retainAll(keySet2);

        Iterator<String> iterator = intersection.iterator();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Integer i1 = map1.get(key);
            Integer i2 = map2.get(key);
            sum += i1 + i2;
        }

        System.out.println("intersection = " + intersection);   // [B, C]
        System.out.println("sum = " + sum);                     // 14


        /**
         * teacher
         */
        HashMap<String, Integer> result = new HashMap<>();
        for (String key : map1.keySet()) {
            if (map2.containsKey(key)) {
                result.put(key, map1.get(key) + map2.get(key));
            }
        }
        System.out.println("result = " + result);

    }

}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>test code 2</b></span></summary>
<div markdown="1">

```java
/*
    각각의 단어가 나타난 수 출력
 */
public class WordFrequencyTest1 {
    public static void main(String[] args) {
        String text = "orange banana apple apple banana apple";
        HashMap<String, Integer> map = new HashMap<>();
        String[] wordArray = text.split(" ");
        for (String word : wordArray) {
            map.put(word, map.getOrDefault(word, 0) + 1);
        }
        System.out.println("map = " + map);
    }
}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>test code 3</b></span></summary>
<div markdown="1">

```java
public class Cart {

    private Map<Product, Integer> cartMap = new HashMap<>();

    public void add(Product product, int addQuantity) {
        int existingQuantity = cartMap.getOrDefault(product, 0);
        cartMap.put(product, existingQuantity + addQuantity);
    }

    public void printAll() {
        System.out.println("* print all products");
        Set<Map.Entry<Product, Integer>> entries = cartMap.entrySet();
        for (Map.Entry<Product, Integer> entry : entries) {
            Product key = entry.getKey();
            Integer value = entry.getValue();
            System.out.println(key + ", count: " + value);
        }
        System.out.println();
    }

    public void minus(Product product, int minusQuantity) {
        int existingQuantity = cartMap.getOrDefault(product, 0);
        int newQuantity = existingQuantity - minusQuantity;
        if (newQuantity <= 0) {
            cartMap.remove(product);
        } else {
            cartMap.put(product, newQuantity);
        }
    }
}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>test code 4</b></span></summary>
<div markdown="1">

```java
public class BrowserHistory {

    private Deque<String> history = new ArrayDeque<>();
    private String currentPage;


    public void visitPage(String url) {
        if (null != currentPage) history.offerLast(url);
        currentPage = url;
        System.out.println("visit: " + url);
    }

    public String goBack() {
        if (!history.isEmpty()) {
            currentPage = history.pollLast();
            System.out.println("go back: " + currentPage);
            return currentPage;
        }
        return null;
    }

}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>test code 5</b></span></summary>
<div markdown="1">

```java
public interface Task {
    void execute();
}

public class CompressionTask implements Task {
    @Override
    public void execute() {
    System.out.println("데이터 압축...");
    }
}

public class BackupTask implements Task {
    @Override
    public void execute() {
    System.out.println("자료 백업...");
    }
}

public class CleanTask implements Task {
    @Override
    public void execute() {
    System.out.println("사용하지 않는 자원 정리...");
    }
}

public class SchedulerTest {
    public static void main(String[] args) {

        //낮에 작업을 저장
        TaskScheduler scheduler = new TaskScheduler();
        scheduler.addTask(new CompressionTask());
        scheduler.addTask(new BackupTask());
        scheduler.addTask(new CleanTask());

        //새벽 시간에 실행
        System.out.println("작업 시작");
        run(scheduler);
        System.out.println("작업 완료");

    }

    private static void run(TaskScheduler scheduler) {
        while (scheduler.getRemainingTasks() > 0) {
            scheduler.processNextTask();
        }
    }
}

public class TaskScheduler {

    private Deque<Task> tasks = new ArrayDeque<>();

    public void addTask(Task task) {
        tasks.offerLast(task);
    }

    public int getRemainingTasks() {
        return tasks.size();
    }

    public void processNextTask() {
        Objects.requireNonNull(tasks.pollFirst()).execute();
        /*
            Task task = tasks.poll();
            if (task != null) {
                task.execute();
            }
         */
    }
}
```

</div>
</details>