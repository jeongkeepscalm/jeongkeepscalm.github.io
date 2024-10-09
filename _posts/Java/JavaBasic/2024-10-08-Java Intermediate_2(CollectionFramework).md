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

- 해시 알고리즘(O(n) -> O(1))

  1. 데이터의 값 자체를 배열의 인덱스와 맞추어 저장(큰 배열 사용, 메모리 공간 낭비)
  2. 나머지 연산 (해시 인덱스 활용)

  - <img src="/assets/img/kyh_java/hash.png" width="600px" />
  - int
    <details>
      <summary><span style="color:oranage" class="point"><b>Code</b></span></summary>
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
      <summary><span style="color:oranage" class="point"><b>Code</b></span></summary>
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

### Object.hashCode()
