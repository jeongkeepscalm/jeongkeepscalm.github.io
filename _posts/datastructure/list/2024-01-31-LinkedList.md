---
title: LinkedList
description: 연결된 리스트
date: 2024-01-31
categories: [datasutructure, list]
tags: [data, cs] # TAG는 반드시 소문자로 이루어져야함!
---
[정리 코드](https://github.com/AngryPig123/datasutructure/tree/linked-list){:target="_blank"}



> 배열의 공간 낭비를 피할 수 있는 자료구조. (동적 할당,Node 사용)

```java
public class Node {
    public int value;
    public Node next;
    public Node(int value) {
        this.value = value;
    }
}
```

<br><br>

> LinkedList의 기본 구성

```java
public class LinkedList {
    private Node head;  //  맨 앞의 노드를 가르킨다.
    private Node tail;  //  맨 뒤의 노드를 가르킨다.
    private int size;   //  리스트의 크기를 체크한다.
}
```

<br><br>

```markdown
- 구현 메소드 목록
  - public LinkedList(int value);
  - public void append(int value);
  - public Node removeFirst();
  - public Node removeLast();
  - public Node get(int index);
  - public void set(int index, int value);
  - public void insert(int index, int value);
  - public void prepend(int value);
  - public Node remove(int index);
  - public void reverse();
```

<br><br>

> 생성자(Constructor) : LinkedList 생성시 기본 노드를 설정해준다.

```java
    public LinkedList(int value) {
        Node node = new Node(value);
        this.head = node;
        this.tail = node;
        this.size++;
    }
```

<br><br>

> 추가(append) : 리스트의 tail에 생성된 노드를 넣고 tail을 재설정한다.

```java
    public void append(int value) {
        Node node = new Node(value);
        if (this.size == 0) {
            this.head = node;
        } else {
            this.tail.next = node;
        }
        this.tail = node;
        this.size++;
    }
```

<br><br>

> head 삭제(removeFirst()) : head 요소를 삭제하고 head 를 재설정 한다.

```java
    public Node removeFirst() {
        Node headNode = this.head;
        if (this.getSize() == 0) {
            return null;
        } else {
            this.head = headNode.next;
            headNode.next = null;   //  참조 제거
            this.size--;
            if (this.getSize() == 0) {
                this.head = null;
                this.tail = null;
            }   //  삭제후 리스트의 상태 체크
        }
        return headNode;
    }
```

<br><br>

> tail 삭제(removeLast()) : tail 요소를 삭제하고 재설정 한다.

```java
    public Node removeLast() {
        Node temp = this.head;
        Node pre = this.head;
        if (this.size == 0) {
            return null;
        } else {
            while (temp.next != null) {
                pre = temp;
                temp = temp.next;
            }   // 해당 반복을 통해 마지막 노드의 앞노드를 얻는다.
            this.tail = pre;
            this.tail.next = null;  //  참조 제거
            this.size--;
            if (this.getSize() == 0) {
                this.head = null;
                this.tail = null;
            }
        }
        return temp;
    }
```

<br><br>

> Node get(int index) : 특정 index에 노드를 가져온다

```java
    public Node get(int index) {
        if (this.getSize() <= index || index < 0) {
            return null;
        } else if (this.getSize() - 1 == index) {
            return this.tail;
        } else {
            Node temp = this.head;
            for (int i = 0; i < index; i++) {
                temp = temp.next;
            }
            return temp;
        }
    }
```

<br><br>

> void set(int index, int value) : 특정 노드의 값을 변경한다.

```java
    public void set(int index, int value) {
        this.get(index).value = value;
    }
```

<br><br>

> void insert(int index, int value) : 특정 index에 값을 추가한다.

```java
    public void insert(int index, int value) {
        if (this.getSize() < index || index < 0) {
            throw new NullPointerException("empty");
        }
        if (index == 0) {
            this.prepend(value);
        } else if (this.getSize() == index) {
            this.append(value);
        } else {
            Node newNode = new Node(value);
            Node temp = this.get(index - 1);
            newNode.next = temp.next;
            temp.next = newNode;
            this.size++;
        }
    }
```

<br><br>

> void prepend(int value) : 리스트의 맨 앞에 Node를 추가한다.

```java
    public void prepend(int value) {
        Node newNode = new Node(value);
        Node headNode = this.head;
        if (this.getSize() == 0) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.head = newNode;
            newNode.next = headNode;
        }
        this.size++;
    }
```

<br><br>

> Node remove(int value) : 특정 index의 노드를 삭제한다.

```java
    public Node remove(int index) {
        if (index < 0 || index >= this.getSize()) {
            throw new NullPointerException(EMPTY_MESSAGE);
        } else if (index == 0) {
            return this.removeFirst();
        } else if (index == this.getSize() - 1) {
            return this.removeLast();
        } else {
            Node prev = this.get(index - 1);
            Node temp = prev.next;
            prev.next = temp.next;
            temp.next = null;
            this.size--;
            return temp;
        }
    }
```

<br><br>

> void reverse() : 리스트를 뒤집는다.

```java
    public void reverse() {
        Node temp = this.head;
        this.head = this.tail;
        this.tail = temp;
        Node after;
        Node before = null;
        for (int i = 0; i < this.getSize(); i++) {
            after = temp.next;
            temp.next = before;
            before = temp;
            temp = after;
        }
    }
```
