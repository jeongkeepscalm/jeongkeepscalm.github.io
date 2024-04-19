---
title: "[KYH] JAVA Basic"
description: java
date: 2023-12-14
categories: [ Java, JavaBasic ]
tags: [ Java, JavaBasic, kyh ]
---

## 클래스(Class)

* 클래스 == 설계도
* VO(DTO) == 객체 == 인스턴스
* 인스턴스를 생성하면 해당 인스턴스에 대한 참조값(주소)을 반환한다. 
* **자바에서 대입은 항상 변수에 들어 있는 값을 복사해서 전달한다.**

<br/>

## 데이터타입(Data Type)

* 기본형(소문자) - 사용하는 값을 변수에 넣는다. (int, long, double, boolean)  
* 참조형(대문자) - 클래스, 객체가 저장된 메모리의 위치를 가르키는 참조값을 넣는다. (Object, Array)   
* String(대문자) == 클래스 == 참조형  

<br/>

## 변수(Variable)

* 멤버변수 == 필드  
* 지역변수 : 메서드에 선언. 매개변수   
* 멤버변수는 인스턴스를 생성할 때 자동으로 초기화된다. (int = 0, boolean = false, 참조형 = null)  
* 지역변수는 항상 직접 초기화해야한다.  

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

## 절차지향 vs 객체지향  
* 절차지향 : 실행순서 중요 ("어떻게")  
	데이터와 해당 데이터에 대한 처리 방식이 분리되어 있다.  
* 객체지향 : 객체 중요 ("무엇을")  
	데이터와 그 데이터에 대한 행동(메서드)이 하나의 "객체" 안에 함께 포함되어 있다.  

* 자바 같은 객체 지향 언어는 클래스 내부에 속성과 기능을 함께 포함할 수 있다. 즉 dto/vo 객체 내 메소드를 만들어 한 곳 에서 유지보수를 가능하게 한다.   
* 객체 내 필드와 메소드가 공존.  
* 객체 내 메소드에는 static을 붙이지 않는다.(static 을 붙이면 객체 생성없이 해당 메소드를 사용할 수 있다.)  
* **원칙적으로 메소드는 객체를 생성해야 호출할 수 있는데, static 을 붙이면 객체를 생성하지 않고도 메소드를 호출할 수 있다.**  

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
 
## 캡슐화(Encapsulation)  

1. 객체 내 데이터( 필드 )를 숨겨라.   
2. 가급적이면 필요한 기능( 메소드 )만 외부에 노출하자.   
=> **데이터는 다 숨기고, 꼭 필요한 기능만 노출하는 것이 좋은 캡슐화이다.**  

<br/>

## 자바 메모리 구조  

* ```메소드 영역``` : 클래스 정보를 보관한다. (여러 붕어빵 틀 보관)  
  클래스 정보 (필드, 메소드, 생성자 코드 등 모든 실행코드 존재)  
  static 변수들을 보관  
  런타임 상수 풀(프로그램을 효율적으로 관리하기 위해 상수들을 관리)  
* ```힙 영역``` : new 명령어를 사용한 인스턴스가 생성되는 영역이다. 배열도 new 명령어를 사용하므로 힙 영역에 쌓인다. (여러 붕어빵 보관)
  가비지 컬렉션이 이루어지는 주요영역이다. 더 이상 참조되지 않는 객체는 GC에 의해 제거된다.  
* ```스택 영역``` : 메소드를 실행할 때마다 하나씩 쌓인다.   
  스택 프레임 : 스택 영역에 쌓이는 네모 박스. 메소드를 호출할 때마다 스택 프레임이 쌓이고 종료되면 스택프레임이 제거된다.   
  * 참고 : 쓰레드 수 만큼 스택 영역이 생성된다.   
* Stack : Last In First Out  
* Queue : First In First Out (선착순 이벤트)  

<br/>

## Static 변수  

* static 키워드는 주로 멤버 변수와 메소드에 사용된다.  
  멤버 변수에 static을 붙이게 되면 static 변수 / 정적 변수 / 클래스 변수라고 한다. 

```java
public class Data2 {

  public String name;
  public static int count; // 객체가 몇 개 생성되었는지 파악하는 용도.

  public Data2(String name) {
    this.name = name;
    count++;
  }
}

public class DataCountMain2 {
  public static void main(String[] args) {

    new Data2("aaa");
    new Data2("bbb");
    new Data2("ccc");

    System.out.println("생성된 객체의 수 : " + Data2.count);
  }
}
```
> static 변수를 사용한 덕분에 공용 변수를 사용해서 편리하게 count를 알 수 있었다.  
> **static 변수는 메소드 영역에 저장되고 인스턴스들은 힙에 저장되어 각각 관리된다.**  
> 멤버변수 : name, count  
> 인스턴스 변수 : name  
> 클래스 변수, 정적변수, static 변수 : count  

<br/>

## Static 메소드 (클래스메소드, 정적 메소드)  

* 멤버 메소드  
    * 인스턴스 메소드 : static 붙지 않은 메소드  
    * 클래스 메소드 : static 붙은 메소드 (정적 메소드, static 메소드)  
* 클래스 메소드는 객체 생성 필요 없이 메소드의 호출만으로 필요한 기능을 수행할 때 주로 사용한다.  
* 클래스 메소드는 static이 붙은 클래스 변수, 클래스 메소드만 사용할 수 있다.  
* main 메소드는 정적 메소드/클래스 메소드이다. 즉 객체생성 필요없이 실행 가능하다.  

```java
public class MathArrayUtils {

  private MathArrayUtils() {} 

  public static int sum(int[] nums) {
    int sum = IntStream.of(nums).sum();
    System.out.println("sum : " + sum);
    return sum;
  }

  public static double average(int[] nums) {
    int average = IntStream.of(nums).sum() / nums.length;
    System.out.println("average : " + average);
    return average;
  }

  public static int min(int[] nums) {
    int min = Arrays.stream(nums).min().orElse(Integer.MIN_VALUE);
    System.out.println("min : " + min);
    return min;
  }

  public static int max(int[] nums) {
    int max = Arrays.stream(nums).max().orElse(Integer.MAX_VALUE);
    System.out.println("max : " + max);
    return max;
  }
}

```
> private MathArrayUtils() {} : MathArrayUtils 의 인스턴스를 생성하지 못하게 막는다.  

<br/>

## final 변수와 상수

```java
public class FinalLocalMain {
  public static void main(String[] args) {

    /** 상수의 값 초기화는 한 번만 가능하다. **/

    final int data1;
    data1 = 10;
//        data1 = 20; 컴파일 오류

    final int data2 = 10;
//        data2 = 20; 컴파일 오류

    method(10);
  }

  static void method(final int num) {
//        num = 20; 컴파일 오류
  }
}
```
> final 을 지역 변수에 설정한 경우 최초 한 번만 할당할 수 있다.  

<br/>

```java
public class ConstructorInit {
    
  final int value;

  public ConstructorInit(int value) {
    this.value = value;
  }

}
```
> final 을 멤버변수로 설정할 경우 생성자를 통해서 값을 초기화 해야한다.  

```java
public class FieldInit {
  public static final int CONST_VALUE = 10;
  final int value = 10;

//    public FieldInit(int value) {
//        this.value = value;
//    }
}
```
> static final 이 붙으면 관례로 대문자로 사용한다. (**상수 = static final 이 붙은 변수**)  
> final 이 붙은 멤버변수의 값이 초기화 되었다면 생성자로 값을 초기화 할 수 없다.  

<br/>

상수(Constant) : 변하지 않고, 항상 일정한 값을 갖는 수. 자바에서는 단 하나만 존재하는 변하지 않는 고정된 값을 뜻한다.  
* static final 사용  
* 대문자를 사용하고 _(언더스코어)로 한다.  
* static 변수를 직접 접근해서(값을 할당해서) 사용한다.  

#### final 변수와 참조

* final을 기본형 변수에 사용하면 값을 변경할 수 없다.  
* final을 참조형 변수에 사용하면 참조값을 변경할 수 없다. (주소값 변경 불가)  
  인스턴스 내 멤버변수의 값은 변경이 가능하다.  

<br/>

## 상속(Extends)

단일상속 : 자바는 다중 상속을 지원하지 않는다. 부모를 하나만 선택할 수 있다.  
다이아몬드 문제 : 똑같은 메소드명을 가진 A, B 클래스를 C 클래스가 다중 상속받았을 때, 어떤 부모의 메소드를 사용해야할 지 몰라 문제 발생.  

```java
// ElectricCar 는 Car 클래스를 상속 받은 상황.
ElectricCar electricCar = new ElectricCar();
```
> electricCar 인스턴스 생성시 **한 주소값**에 ElectricCar 인스턴스와 Car 인스턴스가 공존해 있다.  
> **상속 관계의 객체를 생성하면 그 내부에는 부모와 자식이 모두 생성된다.**  
> 상속 관계의 객체를 호출할 때, 대상 타입을 정해야하고 호출자 타입을 통해 대상 타입을 찾는다.  
> 현재 타입에서 기능을 찾지 못하면 상위 부모 타입으로 기능을 찾아서 실행한다.  

<br/>

메소드 오버라이딩 : 부모로부터 상속받은 메소드를 재정의한다.  

<br/>

## 다형성 ( Polymorphism )

* 한 객체가 여러 타입의 객체로 취급될 수 있는 능력  
* 부모는 자식을 담을 수 있다.  

```java
Parent poly = new Child(); // ( o )
Child poly = new Parent(); // ( x ) 컴파일 오류.
```
컴파일 오류 : 변수명 오타, 잘못된 클래스 이름 사용 등 자바 프로그램을 실행하기 전에 발생하는 오류.  
런타임 오류 : 프로그램이 실행되고 있는 시점에 발생하는 오류.  

* upcasting : 부모 타입으로 변경. 기본 생략 가능.  
* downcasting : 자식 타입으로 변경  

```java
Parent poly = new Child(); 
poly.parentMethod() // 사용 가능. 
poly.childMethod() // 사용 불가. 다운캐스팅을 하여 사용 가능. (부모타입 -> 자식타입 변경)

Parent poly = new Child();
Child child = (Child) poly;
child.childMethod();
( ( Child ) poly ).childMethod() // == 일시적 다운 캐스팅
```

* 업캐스팅이 안전한 이유  
  하위 타입 생성 시 상위 부모 타입은 모두 함께 생성되기 때문에 문제가 발생하지 않는다.  

* 다운캐스팅에 문제가 생길 수 있는 경우  
  반면 하위 타입으로 다운캐스팅 할 경우 기존 타입에 하위 타입이 없을 수도 있어 문제가 발생한다.  

```java
Parent poly = new Child();
Child poly1 = (Child) poly;
poly1.childMethod();
((Child) poly).childMethod(); // 일시적 다운캐스팅

Parent parent = new Parent();
Child child = (Child) parent; // ClassCastException 런타임 오류 : parent 인스턴스에는 child 자체가 존재하지 않는다.
child.childMethod();
```

#### instanceof 
* 다운 캐스팅으로 인해 생기는 문제점을 발생하지 않게하기 위해, 타입을 확인한다.  

```java
public static void main(String[] args) {
        Parent parent1 = new Parent();
        call(parent1);
        Parent parent2 = new Child();
        call(parent2);
    }

private static void call(Parent parent) {

//        JAVA16 이상인 경우
//        if (parent instanceof Child child) {
//            System.out.println("this is child instance");
//            child.childMethod();
//        }

  if (parent instanceof Child) {
      System.out.println("this is child instance");
      ((Child) parent).childMethod();
  } else {
      System.out.println("this is not child instance");
  }
}

new Parent() instanceof Parent // true
new Child() instanceof Parent // true
new Parent() instanceof Child // false
new Child() instanceof Child // true
```
> instanceof 로 확인 후 다운캐스팅 하는 게 안전하다.  

<br/>

```java
public static void main(String[] args) {

  Animal cat = new Cat();
  Animal dog = new Dog();
  Animal caw = new Caw();
  soundAnimal(cat);
  soundAnimal(dog);
  soundAnimal(caw);

  Animal[] animals = {cat, dog, caw};

  // iter
  for (Animal animal : animals) {
      animal.sound();
  }
  
}
public static void soundAnimal(Animal animal) {
    animal.sound();
}
```
> Animal 클래스는 다형성을 위해 만들어진 클래스이므로 Animal 클래스의 메소드를 직접 사용하는 일은 없다. (== 추상 클래스)  

#### 추상클래스

* 실제 생성되면 안되는 클래스. 실체 인스턴스 생성 불가.   
* 상속 목적으로 사용되며 부모클래스 역할을 한다.  
* 추상 메소드는 메소드 바디가 존재하면 안된다.  

```java
public abstract class AbstractAnimal {
    public abstract void sound();       // 자식이 무조건 override 를 해야한다.
    public void move() {                // 자식이 override 할 필요없다.
        System.out.println("animal is moving");
    }
}
```
> 추상메소드가 있는 클래스는 무조건 추상클래스가 되어야 한다.  
> 추상 클래스 덕분에 실수로 Animal 인스턴스를 생성할 근본적 문제를 방지해준다.  
> 추상 클래스 덕분에 실수로 부모클래스의 메소드를 override 하지 않았을 경우 생기는 문제를 방지해준다.   

#### 순수 추상클래스 (== 인터페이스)

* 모든 메소드가 추상 메소드인 클래스.  
* 부모타입으로 껍데기 역할만 제공한다.   
* 순수 추상클래스를 상속 받은 자식 클래스는 부모의 모든 메소드를 구현해야 한다.  

#### 인터페이스

* abstract 키워드 생략 가능.  
* 상속이라 하지 않고 구현이라 칭한다.   
* 인터페이스는 메소드 이름만 있는 설계도이고, 이 설계도가 어떻게 작동해야 하는지를 하위 클래스에서 모두 구현해야한다.   
* **인터페이스를 안정적으로 잘 설계하는 것은 매우 중요하다.**  

* 인터페이스를 사용해야하는 이유  
  **제약** : 자식 클래스가 부모 클래스의 모든 메소드를 override 하지 않았을 경우 생기는 문제를 미연에 방지한다.  
  **다중구현가능** : 자바에서 클래스 상속은 부모 하나만 가능하지만 인터페이스는 부모를 여러명 두는 다중 상속이 가능하다.  
  자바가 다중 상속 기능을 지원하지 않는 이유 : A 부모, B 부모 로 부터 상속을 받았을 경우 이름이 같은 메소드가 있을 때, 어느 부모의 메소드를 호출해야 할지 모른다.  

* 다형성의 본질  
  클라이언트를 변경하지 않고, 서버의 구현 기능을 유연하게 변경할 수 있다.   

#### OCP( Open-Closed Principle )

* Open for extension : 새로운 기능의 추가나 변경 사항이 생겼을 때, 기존 코드는 확장할 수 있어야 한다.  
* Closed for modification : 기존 코드는 수정되지 않아야 한다.  
**=> 기존 코드 수정 없이 새로운 기능을 추가할 수 있어야 한다.**  