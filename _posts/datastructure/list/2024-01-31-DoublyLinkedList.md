---
title: DoublyLinkedList
description: 양방향 연결된 리스트
date: 2024-01-31
categories: [datasutructure, list]
tags: [data, cs] # TAG는 반드시 소문자로 이루어져야함!
---

[정리 코드](https://github.com/AngryPig123/datasutructure/tree/double-linked-list){:target="\_blank"}

> Node에 두개의 prev, next 포인터를 가지고 있는 리스트

```java
public class Node {
    public Node next;
    public Node prev;
    public int value;
    public Node(int value) {
        this.value = value;
    }
}
```

<br><br>

> DoublyLinkedList의 기본 구성

```java
public class DoublyLinkedList {
    private Node head;
    private Node tail;
    private int size;
}
```

<br><br>

> 구현 메소드 목록

```markdown
- 구현 메소드 목록
  - public DoublyLinkedList(int value);
  - public void append(int value);
  - public Node removeLast();
  - public void prepend(int value);
  - public Node removeFirst();
  - public Node get(int index);
  - public void set(int index, int value);
  - public void insert(int index, int value);
  - public Node remove(int index);
```

<br><br>

> append(int value)

```java
    public void append(int value) {
        Node newNode = new Node(value);
        if (this.getSize() == 0) {
            this.head = newNode;

        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
        }
        this.tail = newNode;
        this.size++;
    }
```

<br><br>

> Node removeLast()

```java
    public Node removeLast() {
        if (this.getSize() == 0) {
            throw new NullPointerException("empty");
        }
        Node temp = this.tail;
        if (this.getSize() == 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = this.tail.prev;
            this.tail.next = null;
            temp.prev = null;   //  참조를 끊어낸다.
        }
        this.size--;
        return temp;
    }
```

<br><br>

> void prepend(int value)

```java
    public void prepend(int value) {
        Node newNode = new Node(value);
        if (this.getSize() == 0) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.size++;
    }
```

<br><br>

> Node removeFirst()

```java
    public Node removeFirst() {
        Node temp = this.head;
        if (this.getSize() == 0) {
            throw new NullPointerException("empty");
        } else if (this.getSize() == 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = temp.next;
            temp.next = null;
            temp.prev = null;
        }
        this.size--;
        return temp;
    }
```

<br><br>

> Node get(int index)

```java
    public Node get(int index) {
        if (this.getSize() <= index || index < 0) {
            return null;
        }
        Node temp = this.head;
        if (index < this.getSize() / 2) {
            for (int i = 0; i < index; i++) {
                temp = temp.next;
            }
        } else {
            temp = this.tail;
            for (int i = this.getSize() - 1; i > index; i--) {  //  ToDO
                temp = temp.prev;
            }
        }
        return temp;
    }
```

<br><br>

> void set(int index, int value)

```java
    public void set(int index, int value) {
        Node node = this.get(index);
        node.value = value;
    }
```

<br><br>

>  void insert(int index, int value)

```java
    public void insert(int index, int value) {
        if (index == 0) {
            prepend(value);
        } else if (this.getSize() == index) {
            append(value);
        } else {
            Node newNode = new Node(value);
            Node temp = this.get(index);
            newNode.prev = temp.prev;
            temp.prev.next = newNode;
            newNode.next = temp;
            temp.prev = newNode;
            this.size++;
        }
    }
```

<br><br>

> Node remove(int index)

```java
    public Node remove(int index) {
        Node temp = this.get(index);
        if (index >= this.getSize() || index < 0) {
            return null;
        } else if (this.getSize() - 1 == index) {
            removeLast();
        } else if (index == 0) {
            removeFirst();
        } else {
            Node before = temp.prev;
            Node after = temp.next;
            before.next = after;
            after.prev = before;
            temp.prev = null;
            temp.next = null;
            this.size--;
        }
        return temp;
    }
```
