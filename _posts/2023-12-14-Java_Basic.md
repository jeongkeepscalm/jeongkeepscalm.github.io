---
layout: post
title: Java_Basic
date: 2023-12-14 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: javaBasic.jpg # Add image post (optional)
tags: [JAVA] # add tag
---

## 클래스(Class)

* 클래스 == 설계도
* VO(DTO) == 객체 == 인스턴스
* 인스턴스를 생성하면 해당 인스턴스에 대한 참조값(주소)을 반환한다. 
* **자바에서 대입은 항상 변수에 들어 있는 값을 복사해서 전달한다.**

<br/>
<hr>
<br/>

## 데이터타입(Data Type)

* 기본형(소문자) - 사용하는 값을 변수에 넣는다. (int, long, double, boolean)
* 참조형(대문자) - 클래스, 객체가 저장된 메모리의 위치를 가르키는 참조값을 넣는다. (Object, Array) 
* String(대문자) == 클래스 == 참조형

<br/>
<hr>
<br/>

## 변수(Variable)

* 멤버변수 == 필드
* 지역변수 : 메서드에 선언. 매개변수 
* 멤버변수는 인스턴스를 생성할 때 자동으로 초기화된다. (int = 0, boolean = false, 참조형 = null)
* 지역변수는 항상 직접 초기화해야한다. 

<br/>
<hr>
<br/>

## GC(Garbage Collector) - 아무도 참조하지 않는 인스턴스를 제거한다. 

```java
Data data = null;
data = new Data();
data = null;
```
> 이 같은 경우에, 메모리는 생성이 되었지만 메모리에 접근할 수 있는 참조값이 없다. 
> 빈 메모리만 떠있어 메모리용량만 차지하는 상황이다. 
> **자바는 아무도 참조하지 않는 인스턴스가 있다면 JVM의 GC가 해당 인스턴스를 자동으로 메모리에서 제거해준다.**

<br/>
<hr>
<br/>

## 절차지향 vs 객체지향
* 절차지향 : 실행순서 중요 ("어떻게")
	데이터와 해당 데이터에 대한 처리 방식이 분리되어 있다.
* 객체지향 : 객체 중요 ("무엇을")
	데이터와 그 데이터에 대한 행동(메서드)이 하나의 "객체" 안에 함께 포함되어 있다.

* 자바 같은 객체 지향 언어는 클래스 내부에 속성과 기능을 함께 포함할 수 있다. 즉 dto/vo 객체 내 메소드를 만들어 한 곳 에서 유지보수를 가능하게 한다. 
*객체 내 필드와 메소드가 공존.*
*객체 내 메소드에는 static을 붙이지 않는다.(static 을 붙이면 객체 생성없이 해당 메소드를 사용할 수 있다.)
* **원칙적으로 메소드는 객체를 생성해야 호출할 수 있는데, static 을 붙이면 객체를 생성하지 않고도 메소드를 호출할 수 있다.**

<br/>
<hr>
<br/>

## 생성자(Constructor)

* 객체의 초기값을 설정한다. 
* 생성자는 인스턴스를 생성하고 나서 즉시 호출된다. 
* 생성자가 파라미터 3개를 받고 있다면 타입에 맞는 3개 값을 넣어줘야 컴파일이 된다. 그렇지 않으면 컴파일오류가 난다. => 강제하는 것 == 제약
**즉, 생성자를 사용하면 필수값 입력을 보장할 수 있다.**
* **좋은 프로그램은 무한한 자유도가 주어지는 프로그램이 아니라 적절한 제약이 있는 프로그램이다.**
* 클래스에 생성자가 하나도 없으면 기본생성자를 자동으로 만든다. 생성자가 하나라도 있으면 자바는 기본 생성자를 만들지 않는다. 

* 오버로딩 : 파라미터의 개수나 타입이 다른 생성자가 추가적으로 생길 경우.

```java
package constructor;

public class MemberInit {

    String name;
    int age;
    int grade;

    // 기본 생성자
    MemberInit(){};

    // 오버로딩
    MemberInit(String name, int age) {
        this(name, age, 50);

//        this.name = name;
//        this.age = age;
//        this.grade = 50;
        
    }

    MemberInit(String name, int age, int grade) {
        this.name = name;
        this.age = age;
        this.grade = grade;
    }
}
```
> this() : 생성자 코드의 첫 줄에만 작성할 수 있다. 

```java
public MemberConstruct(String name, int age) {
	System.out.println("go");
	this(name, age, 50);
}
```
> 컴파일 오류 발생.

<br/>
<hr>
<br/>

## 접근 제어자(Access Modifier)

* private - 외부에서 접근이 불가능하다. 모든 외부 호출을 막는다. 
* default( package-private ) - 같은 패키지 안에서 호출 허용. 
* protected - 같은 패키지 안에서 호출 허용. 패키지가 달라도 상속관계의 호출은 허용. 
* public - 다른 패키지에서 접근이 가능. 
* 퍼블릭 클래스는 클래스명과 같아야하고 하나만 존재가능하다. 

```java
Speaker speaker = new Speaker(90);
// Speaker 클래스 내 필드 volume을 private 으로 설정 시 접근이 불가능하다. 
speaker.volume = 200; 
```

<br/>
<hr>
<br/>

## 캡슐화(Encapsulation)

1. 객체 내 데이터( 필드 )를 숨겨라.
2. 가급적이면 필요한 기능( 메소드 )만 외부에 노출하자. 
=> **데이터는 다 숨기고, 꼭 필요한 기능만 노출하는 것이 좋은 캡슐화이다.**

<br/>
<hr>
<br/>




