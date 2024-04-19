---
title: Stream API
description: Stream API
date: 2023-12-19
categories: [ java, dataProcessing ]
tags: [ java, dataProcessing, streamAPI ]
---

## Stream Pipeline(구조)

- Source (소스): 컬렉션, 배열 등
- Intermediate Operations(중간 처리): 0개 이상의 filter, map 등의 중간처리
- Terminal Operation(종결 처리): Collect, reduce 등

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

## allMatch, anyMatch

```java
boolean b = Arrays.asList(-3, 23, 66, -7, 88).stream().allMatch(v -> v > 0); // false
boolean b2 = Arrays.asList(-3, 23, 66, -7, 88).stream().anyMatch(v -> v > 0); // true
```

<br/>

## reduce ( 이전 값과 연관 )
```java
String greetings[] = { "hi", "hello", "안녕", "안녕하세요" };

// 람다식으로 직접 구현
System.out.println(Arrays.stream(greetings).reduce("", (s1, s2) -> {
  System.out.println(s1 + " : "+s2);
  if (s1.getBytes().length >= s2.getBytes().length) return s1; // 가장 긴 문자열 하나만 리턴한다.
  else return s2;
}));
```
> reduce("", ...) : 빈 문자로 초깃값 설정

<br/>

```java
Stream<Integer> numbers = Stream.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
// numbers.reduce((x, y) -> (x + y)).ifPresent(s -> System.out.println("sum : " + s));
numbers.reduce(Integer::sum).ifPresent(s -> System.out.println("sum2 : " + s));
```

<br/>

## collect

- Collector: 인터페이스
- Collectors: 클래스 ( Collector 인터페이스 구현 )
- collect(): 최종연산 ( 그룹별로 다루기위해 사용 )

## joining

```java
String[] stringArr = {"aaa", "bbb", "ccc", "ddd", "eee"};
String joined = Arrays.stream(stringArr).collect(Collectors.joining(","));
List<String> list = Arrays.stream(joined.split(",")).collect(Collectors.toList());
List<String> list2 = Arrays.stream(joined.split(",")).map(v -> "(" + v + ")").collect(Collectors.toList());

System.out.println(list);  // [aaa, bbb, ccc, ddd, eee]
System.out.println(list2); // [(aaa), (bbb), (ccc), (ddd), (eee)]
```

<br/>

## 기본문제

```java
// [문제 1] 1,2,3,4,5,6을 담고 있는 리스트를 만들고 역순 정렬 
// 1
List<Integer> list =  Arrays.asList(1, 2, 3, 4, 5, 6);
Collections.sort(list, (a, b) -> b.compareTo(a));
// 2
List<Integer> list = List.of(1, 2, 3, 4, 5, 6).stream().sorted((a, b) -> b - a).collect(Collectors.toList());

// [문제 2] 1~100숫자를 리스트에 담고 2와 3의 배수를 제거하고 남은 수에 곱하기 2
List<Integer> list = IntStream.rangeClosed(0, 100)
        .filter(v -> v % 2 != 0 && v % 3 != 0)
        .mapToObj(v -> v * 2)
        .collect(Collectors.toList());

// [문제 3] 3,1,6,7,2,3,6 정수 원소를 가진 리스트를 만들고 중복 제거 후, 정렬 한 뒤 리스트로 만들기
List.of(3, 1, 6, 7, 2, 3, 6).stream().distinct().sorted().collect(Collectors.toList());

// [문제 4] 스트림으로 로또번호 만들어서 리스트 만들기
// 1
IntStream ints = new Random().ints(1, 46);
List list = ints.distinct().limit(6).sorted().boxed().collect(Collectors.toList());
// 2
List<Integer> list = new Random().ints(6, 1, 46).boxed().collect(Collectors.toList());
// box() : IntStream 을 Stream<Integer> 로 변환

// [문제 5] "dd", "aaa", "CC", "cc", "b" 원소를 리스트에 담고 스트림으로 병렬처리하고 각 문자열의 합을 출력  
int sum = List.of("dd", "aaa", "CC", "cc", "b").stream().parallel().mapToInt(v -> v.length()).sum();

// [문제 6] 1~10 홀수만 스트림으로 출력 
// 1
List list = IntStream.iterate(1, v -> v+2).limit(5).boxed().collect(Collectors.toList());
// 2
List<Integer> list2 = IntStream.rangeClosed(1, 10).filter(v -> v % 2 != 0).boxed().collect(Collectors.toList());

// [문제 7] 파일배열에 확장자를 가져오고 중복제거한 후 대문자로 바꿔라 
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

// [문제 8] 소문자로 바꾸고 중복제거해서 단어 출력 
String[] lineArr = {"Believe or not It is true", "Do or do not There is no try"};
List<String> list = Arrays.stream(lineArr).flatMap(v -> Stream.of(v.split(" +"))) //  " +" : 하나 이상의 공백 (정규식)
        .peek(v -> System.out.println(v))
        .map(String::toLowerCase) // .map(v -> v.toLowerCase())
        .distinct()
        .collect(Collectors.toList());
```

<br/>

## 코드 활용

```java
// filter
List<CmmnDetailCode> chpList = chbrList.stream().filter(x -> "00".equals(x.getCode().substring(2, x.getCode().length()))
        && !"0000".equals(x.getCode())
        && !x.getCode().matches(".*[a-zA-Z].*")
)
.collect(Collectors.toList());

List<CodeDetail> collect = codeList.stream().filter(i -> i.getCode().startsWith("00", 2)).collect(Collectors.toList()); 

// groupingBy
Map<String, List<LectureHistoryResponseVO>> groupedByCategory = lectureList.stream().collect(Collectors.groupingBy(LectureHistoryResponseVO::getCategoryNo));
Collection<List<LectureHistoryResponseVO>> categoryList = groupedByCategory.values();

// sort
List<CoreAttachFileVO> fileResult = coreAttachFileService.selectAttachFileList(coreAttachFileVO).stream().sorted(Comparator.comparing(CoreAttachFileVO::getRegDt)).collect(Collectors.toList());

// forEach
list.stream().forEach(x -> x.setReStatus( x.getReStatus().equals("Y") ? "완료" : "대기"));

// sum
reception = lssVOS.stream().mapToInt(item -> Integer.parseInt(item.getReception())).sum();

```