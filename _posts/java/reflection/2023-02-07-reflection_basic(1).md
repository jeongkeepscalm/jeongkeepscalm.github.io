---
title: Reflection(1)
description: 리플렉션
date: 2024-02-07
categories: [ Java, Reflection ]
tags: [ java, reflection ]
---

[정리_코드](https://github.com/AngryPig123/reflection/tree/basic){:target="_blank"}

> Class<?> clazz : 클래스의 정보를 담고있는 클래스
> > - clazz.getSimpleName() : 클래스의 이름을 가져온다
> > - clazz.getPackageName() : 패키지의 이름을 가져온다
> > - clazz.getInterfaces() : implements하고 있는 인터페이스 목록을 가져온다
> > - clazz.isArray() : 배열인지 확인한다.
> > - clazz.isPrimitive : 원시 타입인지 확인한다.
> > - clazz.isEnum() : Enum 타입인지 확인한다.
> > - clazz.interface() : 인터페이스인지 확인한다
> > - clazz.anonyMous() : 익명 클래스인지 확인한다.
> > - Class.forName(String className) : 클래스의 경로를 인자로 넘겨 클래스를 가져온다. <br> nested 클래스의 경우 $ 표시를 이용해 접근할 수 있다.

<br>

> 예제 코드

```java
package ch1;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class Main {

  public static void main(String[] args) throws ClassNotFoundException {
    Class<String> stringClass = String.class;
    Map<String, Integer> mapObject = new HashMap<>();
    Class<?> hashMapClass = mapObject.getClass();
    Class<?> squareClass = Class.forName("ch1.Main$Square");
    printClassInfo(stringClass, hashMapClass, squareClass, Collection.class, boolean.class, int[][].class, Color.class);
  }

  private static void printClassInfo(Class<?>... classes) {

    for (Class<?> clazz : classes) {
      System.out.println(
        String.format(
          "class name : %s, class package name : %s",
          clazz.getSimpleName(),  //  클래스 이름
          clazz.getPackageName()  //  패키지 이름
        )
      );
      Class<?>[] implementedInterfaces = clazz.getInterfaces();   //  인터페이스 목록 가져오기
      for (Class<?> implementedInterface : implementedInterfaces) {
        System.out.println(
          String.format(
            "class %s implements : %s",
            clazz.getSimpleName(),
            implementedInterface.getSimpleName()    //  인터페이스 이름.
          )
        );
      }

      //  각각 타입 체크
      System.out.println("is array : " + clazz.isArray());
      System.out.println("is primitive : " + clazz.isPrimitive());
      System.out.println("is enum : " + clazz.isEnum());
      System.out.println("is interface : " + clazz.isInterface());
      System.out.println("is anonymous : " + clazz.isAnonymousClass());
      System.out.println();
    }

  }

  public static class Square implements Drawable {
    @Override
    public int getNumberOfCorners() {
      return 4;
    }
  }

  private static interface Drawable {
    int getNumberOfCorners();
  }

  private enum Color {
    BLUE, RED, GREEN
  }

}
```

<br>

> 실행 결과

```text
class name : String, class package name : java.lang
class String implements : Serializable
class String implements : Comparable
class String implements : CharSequence
class String implements : Constable
class String implements : ConstantDesc
is array : false
is primitive : false
is enum : false
is interface : false
is anonymous : false

class name : HashMap, class package name : java.util
class HashMap implements : Map
class HashMap implements : Cloneable
class HashMap implements : Serializable
is array : false
is primitive : false
is enum : false
is interface : false
is anonymous : false

class name : Square, class package name : ch1
class Square implements : Drawable
is array : false
is primitive : false
is enum : false
is interface : false
is anonymous : false

class name : Collection, class package name : java.util
class Collection implements : Iterable
is array : false
is primitive : false
is enum : false
is interface : true
is anonymous : false

class name : boolean, class package name : java.lang
is array : false
is primitive : true
is enum : false
is interface : false
is anonymous : false

class name : int[][], class package name : java.lang
class int[][] implements : Cloneable
class int[][] implements : Serializable
is array : true
is primitive : false
is enum : false
is interface : false
is anonymous : false

class name : Color, class package name : ch1
is array : false
is primitive : false
is enum : true
is interface : false
is anonymous : false
```
