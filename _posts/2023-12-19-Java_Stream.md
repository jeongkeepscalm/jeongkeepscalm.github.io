---
layout: post
title: Java_Stream
date: 2023-12-19 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: javaStream.png # Add image post (optional)
tags: [Java] # add tag
---

<br/>

## IntStream 

```java
int[] intArr = {1, 2, 3, 4, 5};
// IntStream intStream = Stream.of(intArr);
IntStream intStream = Arrays.stream(intArr);
System.out.println("intStream.sum() : " + intStream.sum());
System.out.println("intStream.count() : " + intStream.count());
System.out.println("intStream.average() : " + intStream.average());
```
> IntStream 은 sum(), count(), average(), min(), max() 등 숫자 관련 함수를 제공한다. <br/>

<br/>
<hr>
<br/>

## Sort

```java
Stream<Student> studentStream = Stream.of(
        new Student("ojg",3,300),
        new Student("ldn",1,200),
        new Student("sns",2,100),
        new Student("ees",2,150),
        new Student("gxx",3,290),
        new Student("dwz",3,180)
);

// 반별로 정렬
// studentStream.sorted(Comparator.comparing(Student::getBan).reversed() 
studentStream.sorted(Comparator.comparing((Student s) -> s.getBan()).reversed() // 람다로 변경.
        .thenComparing(Comparator.naturalOrder())) // 기본 정렬
        .forEach(System.out::println);
```

<br/>
<hr>
<br/>

## Optional 

```java
Optional<String> optStr = Optional.of("abcde");
Optional<Integer> optInt = optStr.map(String::length);

System.out.println("optStr : "+optStr.get()); // abcde
System.out.println("optInt : "+optInt.get()); // 5

int result1 = Optional.of("123").filter(x -> x.length() > 0).map(Integer::parseInt).get();
int result2 = Optional.of("").filter(x -> x.length() > 0).map(Integer::parseInt).orElse(-1); // 필터를 타지 않는다.

System.out.println("result1 : "+result1); // 123
System.out.println("result2 : "+result2); // -1

Optional.of("456").map(Integer::parseInt).ifPresent(x-> System.out.printf("result3 : %s%n",x)); // 456

OptionalInt optInt1 = OptionalInt.of(0); // 0 저장.
OptionalInt optInt2 = OptionalInt.empty(); // 빈 객체 저장.

System.out.println(optInt1); // OptionalInt[0]
System.out.println(optInt2); // OptionalInt.empty

System.out.println(optInt1.isPresent()); // true
System.out.println(optInt2.isPresent()); // false

System.out.println(optInt1.getAsInt()); // 0
System.out.println(optInt1.equals(optInt2)); // false           
```

<br/>
<hr>
<br/>

#### 1,2,3,4,5,6을 담고 있는 리스트를 만들고 역순 정렬 

```java
// 1
List<Integer> list =  Arrays.asList(1, 2, 3, 4, 5, 6);
Collections.sort(list, (a, b) -> b.compareTo(a));
// 2
List<Integer> list = List.of(1, 2, 3, 4, 5, 6).stream().sorted((a, b) -> b - a).collect(Collectors.toList());
```

<br/>
<hr>
<br/>

#### 1~100숫자를 리스트에 담고 2와 3의 배수를 제거하고 남은 수에 곱하기 2

```java
List<Integer> list = IntStream.rangeClosed(0, 100)
        .filter(v -> v % 2 != 0 && v % 3 != 0)
        .mapToObj(v -> v * 2)
        .collect(Collectors.toList());
```

<br/>
<hr>
<br/>

#### 3,1,6,7,2,3,6 정수 원소를 가진 리스트를 만들고 중복 제거 후, 정렬 한 뒤 리스트로 만들기   

```java
List.of(3, 1, 6, 7, 2, 3, 6).stream().distinct().sorted().collect(Collectors.toList());
```

<br/>
<hr>
<br/>

#### 스트림으로 로또번호 만들어서 리스트 만들기

```java
// 1
IntStream ints = new Random().ints(1, 46);
List list = ints.distinct().limit(6).sorted().boxed().collect(Collectors.toList());
// 2
List<Integer> list = new Random().ints(6, 1, 46).boxed().collect(Collectors.toList());
```
> box() : IntStream 을 Stream<Integer> 로 변환

<br/>
<hr>
<br/>

#### "dd", "aaa", "CC", "cc", "b" 원소를 리스트에 담고 스트림으로 병렬처리하고 각 문자열의 합을 출력  

```java
int sum = List.of("dd", "aaa", "CC", "cc", "b").stream().parallel().mapToInt(v -> v.length()).sum();
```

<br/>
<hr>
<br/>

#### 1~10 홀수만 스트림으로 출력   

```java
// 1
List list = IntStream.iterate(1, v -> v+2).limit(5).boxed().collect(Collectors.toList());
// 2
List<Integer> list2 = IntStream.rangeClosed(1, 10).filter(v -> v % 2 != 0).boxed().collect(Collectors.toList());
```

<br/>
<hr>
<br/>

#### 파일배열에 확장자를 가져오고 중복제거한 후 대문자로 바꿔라 

```java
File[] fileArr = {new File("Ex1.java")
                , new File("Ex1.bak")
                , new File("Ex2.java")
                , new File("Ex1")
                , new File("Ex1.txt")};

List list = Stream.of(fileArr).map(v -> v.getName())
        .filter(v -> v.indexOf(".") != -1)
        .map(v -> v.substring(v.indexOf(".") + 1))
        .map(String::toUpperCase)
        .distinct()
        .collect(Collectors.toList());

List<String> list = Arrays.stream(fileArr)
        .map(File::getName)
        .map(fileName -> {
            int index = fileName.lastIndexOf(".");
            return index == -1 ? "" : fileName.substring(index + 1);
        })
        .distinct()
        .filter(v -> !v.equals(""))
        .map(v -> v.toUpperCase())
        .collect(Collectors.toList());
``` 

<br/>
<hr>
<br/>

#### 소문자로 바꾸고 중복제거해서 단어 출력 

```java
String[] lineArr = {"Believe or not It is true", "Do or do not There is no try"};
List<String> list = Arrays.stream(lineArr).flatMap(v -> Stream.of(v.split(" +")))
        .peek(v -> System.out.println(v))
        .map(String::toLowerCase) // .map(v -> v.toLowerCase())
        .distinct()
        .collect(Collectors.toList());
```

<br/>
<hr>
<br/>



