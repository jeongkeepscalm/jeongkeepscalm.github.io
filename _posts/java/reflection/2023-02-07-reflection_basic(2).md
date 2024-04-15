---
title: Reflection(2)
description: 리플렉션
date: 2024-02-07
categories: [ Java, Reflection ]
tags: [ java, reflection, reflection constructors ]
---

[정리_코드](https://github.com/AngryPig123/reflection/tree/basic){:target="_blank"}

> Class<?> clazz : 클래스의 정보를 담고있는 클래스
> > - clazz.getDeclaredConstructors() : 선언되어 있는 모든 생성자를 가져온다.

<br>

> Person class

```java
    public static class Person {

  private final Address address;
  private final String name;
  private final int age;

  public Person() {
    this.name = "anonymous";
    this.age = 0;
    this.address = null;
  }

  public Person(String name) {
    this.name = name;
    this.age = 0;
    this.address = null;
  }

  public Person(String name, int age) {
    this.name = name;
    this.age = age;
    this.address = null;
  }

  public Person(Address address, String name, int age) {
    this.name = name;
    this.age = age;
    this.address = address;
  }

  @Override
  public String toString() {
    return "Person{" +
      "address=" + address +
      ", name='" + name + '\'' +
      ", age=" + age +
      '}';
  }

}
```

<br>

> Address class

```java
public static class Address {
  private String street;
  private int number;

  public Address(String street, int number) {
    this.street = street;
    this.number = number;
  }

  @Override
  public String toString() {
    return "Address{" +
      "street='" + street + '\'' +
      ", number=" + number +
      '}';
  }

}
```

<br>

> 클래스의 생성자들의 정보를 가져오는 코드

```java
public static void printConstructorData(Class<?> clazz) {
  Constructor<?>[] constructors = clazz.getDeclaredConstructors();    //  클래스에 정의된 모든 생성자를 가져온다.

  System.out.printf("class %s has %d declared constructors%n", clazz.getSimpleName(), constructors.length);

  for (int i = 0; i < constructors.length; i++) { //  정의된 생성자의 수 만큼 for 문을 돌린다.

    Class<?>[] parameterTypes = constructors[i].getParameterTypes();    //  생성자에 선언된 파라미터를 가져온다.

    List<String> parameterTypeNames =
      Arrays.stream(parameterTypes)
        .map(Class::getSimpleName)
        .toList();

    System.out.println(parameterTypeNames);

  }

}
```

```text
class Person has 4 declared constructors
[Address, String, int]
[String, int]
[String]
[]
```

<br>

> 클래스의 정보와 생성자 인수를 받아 반환해주는 메소드

```java
    public static <T> T createInstanceWithArguments(Class<T> clazz, Object... objects) throws InvocationTargetException, InstantiationException, IllegalAccessException {
        for (Constructor<?> constructor : clazz.getDeclaredConstructors()) {    //  선언된 생성자를 가져온다.
            if (constructor.getParameterTypes().length == objects.length) { //  생성자의 필드 수와 인자의 길이를 비교해서 맞는 생성자 클래스를 반환한다, getParameterTypes(), getTypeParameters() * 주의
                return (T) constructor.newInstance(objects);
            }
        }
        System.out.println("not found");
        return null;
    }
```

<br>

> 실행 코드

```java
    public static void main(String[] args) throws InvocationTargetException, InstantiationException, IllegalAccessException {

//        printConstructorData(Person.class); //  생성자 목록 확인

        Person noArgumentConstructors = createInstanceWithArguments(Person.class);
        System.out.println(noArgumentConstructors);

        Address address = createInstanceWithArguments(Address.class, "동작구", 104);
        System.out.println(address);

        Person allArgumentConstructors = createInstanceWithArguments(Person.class, address, "홍길동", 20);
        System.out.println(allArgumentConstructors);

    }
```

```text
  Person{address=null, name='anonymous', age=0}
  Address{street='동작구', number=104}
  Person{address=Address{street='동작구', number=104}, name='홍길동', age=20}
```
