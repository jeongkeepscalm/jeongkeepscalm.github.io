---
title: "[JAVA] Lambda"
description: "[JAVA] Lambda"
date: 2025-08-02
categories: [ Java, Java Basic ]
tags: [ Java, Java Basic, kyh ]
---

### 람다

- 익명 클래스 사용의 보일러플레이트 코드를 크게 줄이고, 간결한 코드로 생산성과 가독성을 높일 수 있다.
	- 보일러플레이트 코드: 반복적으로 작성해야 하는 고정된 형식의 코드
- 대부분의 익명 클래스는 람다로 대체할 수 있다.
- 람다를 사용할 때 new 키워드를 사용하지 않지만, 람다도 익명 클래스처럼 인스턴스가 생성된다.
- 함수형 인터페이스에만 할당 가능
	- 함수형 인터페이스: 정확히 하나의 추상 메서드를 가지는 인터페이스
	- 단일 추상 메서드: SAM(Single Abstract Method)

<br>
<hr>

### 고차함수

- 함수를 인자로 받거나 함수를 반환하는 메소드
- 함수를 다루는 추상화 수준이 더 높다는 데에서 유래

```java
// 함수형 프로그래밍

public class FirstClassCitizenMain {

  public static void main(String[] args) {
    // 함수를 변수에 담는다
    Function<Integer, Integer> func = x -> x * 2;
    // 함수를 인자로 전달
    applyFunction(10, func);
    // 함수를 반환
    getFunc().apply(10);
  }

  // 고차 함수: 함수를 인자로 받음
  public static Integer applyFunction(Integer input, Function<Integer,
  Integer> func) {
    return func.apply(input);
  }

  // 고차 함수: 함수를 반환
  public static Function<Integer, Integer> getFunc() {
    return x -> x * 2;
  }
}
```

<br>
<hr>

- `명령형 프로그래밍`
  - 프로그램이 수행해야 할 각 단계와 처리 과정을 상세하게 기술하여, 어떻게 결과에 도달할지를 명시한다.
- `선언적 프로그래밍` 
  - 원하는 결과나 상태를 기술하며, 그 결과를 얻기 위한 내부 처리 방식은 추상화되어 있어 개발자가 무엇을 원하는지에 집중할 수 있게 한다.
  - Lambda: 내부반복

<br>
<hr>

- 익명 클래스
  - 컴파일 시 실제로 OuterClass$1.class 와 같은 클래스 파일이 생성된다. 일반적인 클래스와 같은 방식으로 작동한다. 해당 클래스 파일을 JVM에 불러서 사용하는 과정이 필요하다.
- 람다
  - 컴파일 시점에 별도의 클래스 파일이 생성되지 않는다. 자바를 실행하는 실행 시점에 동적으로 필요한 코드를 처리한다
  - 내부적으로 invokeDynamic 을 활용하여 별도의 클래스 파일이 아닌, 런타임 시점에 동적으로 람다 인스턴스를 생성한다.

- 언제 어떤 것을 사용할까?
  - 복잡한 인터페이스 구현(메서드가 여러 개)이 필요하거나, 상태를 유지해야 하는 경우는 익명 클래스를 사용한다.
  - 간결성과 함수형 방식이 필요한 경우(함수형 인터페이스 하나만 구현)에는 람다가 훨씬 직관적이며, 코드량을 줄일 수 있다.

<br>
<hr>

### 메소드 참조

- 메서드 참조의 필요성
  - 람다에서 이미 정의된 메서드를 단순히 호출하기만 하는 경우, 메서드 참조로 더 간결하게 표현할 수 있다.
  - 코드 중복을 줄이고 가독성을 높여주며, 유지보수 측면에서도 편리하다.
  - 간결성, 가독성, 유연성, 재사용성

- 메서드 참조의 4가지 유형
  - 정적 메서드 참조: 클래스명::메서드명
  - 특정 객체의 인스턴스 메서드 참조: 객체명::메서드명
  - 생성자 참조: 클래스명::new
  - 임의 객체의 인스턴스 메서드 참조: 클래스명::메서드명
    - 클래스명으로 지정한 첫 번째 매개변수가 곧 호출 대상 객체가 된다.

<br>
<hr>

### 정리

1. 스트림(Stream)이란?
  - 자바 8부터 추가된 데이터 처리 추상화 도구로, 컬렉션/배열 등의 요소들을 일련의 단계(파이프라인)로 연결해 가공, 필터링, 집계할 수 있다. 
  - 내부 반복(forEach 등)을 지원해, "어떻게 반복할지"보다는 "무엇을 할지"에 집중하는 선언형 프로그래밍 스타일을 구현한다.
2. 중간 연산(Intermediate Operation)과 최종 연산(Terminal Operation)
  - 중간 연산: filter , map , distinct , sorted , limit 등. 스트림을 변환하거나 필터링하는 단계. 지연(Lazy) 연산이라서 실제 데이터 처리는 최종 연산을 만나기 전까지 미뤄진다.
  - 최종 연산: forEach , toList , count , min , max , reduce , collect 등. 스트림 파이프라인을 종료하며 실제 연산을 수행해 결과를 반환한다. 한 번 최종 연산을 수행하면 스트림은 소멸되므로, 재사용할 수 없다.
3. 지연 연산(Lazy Evaluation)
  - 스트림은 중간 연산 시점에 곧바로 처리하지 않고, 내부에 "어떤 연산을 할 것인지"만 저장해둔다. 최종 연산이 호출되는 순간에야 중간 연산들을 한 번에 적용하여 결과를 만든다. 덕분에 단축 평가(Short-Circuit) 같은 최적화가 가능하다. 예를 들어 findFirst() , limit() 등으로 불필요한 연산을 건너뛸 수 있다.
4. 파이프라인(pipeline)과 일괄 처리(batch) 비교
  - 모든 요소를 한 번에 처리하고, 그 결과를 모아서 다음 단계로 넘어가는 방식을 일괄 처리라고 한다. 자바 스트림은 요소 하나를 filter → 통과 시 바로 map → … → 최종 연산으로 넘기는 식의 파이프라인 방식으로 동작한다. 파이프라인 구조와 지연 연산 덕분에, 필요 이상의 연산을 줄이고 메모리 효율도 높일 수 있다.
5. 기본형 특화 스트림(IntStream, LongStream, DoubleStream)
  - 박싱/언박싱 오버헤드를 줄이고, 합계, 평균, 최솟값, 최댓값, 범위 생성 같은 숫자 처리에 특화된 메서드를제공한다.
  - 일반 스트림보다 루프가 매우 큰 상황에서 성능상 이점이 있을 수 있고, range() , rangeClosed() 를 통해 반복문 없이 손쉽게 범위를 다룰 수도 있다.
6. Collector와 Collectors
  - collect 최종 연산을 통해 스트림 결과를 리스트나 맵, 통계 정보 등 원하는 형태로 모을 수 있다. 
  - Collectors 클래스는 toList , toSet , groupingBy , partitioningBy , mapping ,averagingInt 같은 다양한 수집용 메서드를 제공한다.특히 groupingBy 나 partitioningBy 에 다운 스트림 컬렉터를 지정하면, "그룹별 합계, 평균, 최대/최솟값, 여러 형태로 다시 매핑" 등 복합적인 요구사항을 한 번에 처리할 수 있다.

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5);
Stream<Integer> stream = numbers.stream()
  .filter(n -> {
  System.out.println("filter: " + n);
  return n % 2 == 0;
  });
// 아직 출력된 것이 없음 (중간 연산만 설정된 상태)
// 최종 연산을 호출할 때 실제 동작 시작
List<Integer> evens = stream.toList();
// 여기서야 filter가 실제로 동작하며 콘솔에 filter 로그가 찍힘
```
> 최종 연산이 실행될 때 한 번에 연산 수행: 필요없는 연산을 미리 실행 x. 계산 효율 상승

<br>
<hr>

### 단일 스트림 vs 멀티 스레드

- 단일 스트림: 코드가 간단하지만, 한 번에 하나의 스레드만 실행되어 시간이 오래 걸린다.
- 멀티스레드: 여러 스레드를 직접 생성해 병렬로 작업을 처리할 수 있으나, 스레드 생성, 관리, 예외 처리 등이 복잡해진다.

### 스레드 풀(ExecutorService)

- 스레드를 직접 생성, 제어하는 대신, 자바가 제공하는 스레드 풀을 활용하여 멀티스레드를 더 쉽게 사용할 수 있다. 
- submit(Callable) 과 Future 를 통해 작업을 비동기로 처리하고, 결과를 손쉽게 받아올 수 있다.

### Fork/Join 패턴, Fork/Join 프레임워크

- 큰 작업을 잘게 분할(Fork) 한 뒤 여러 스레드가 병렬로 처리하고, 최종 결과를 합치기(Join) 하는 전형적인 병렬 처리 패턴이다.
- 자바의 Fork/Join 프레임워크( ForkJoinPool , RecursiveTask , RecursiveAction )는 이러한 패턴을 편리하게 지원한다.
- 작업 훔치기(Work-Stealing) 알고리즘을 통해 각 스레드가 할당받은 작업이 없으면, 다른 스레드의 큐에 있는 작업을 훔쳐서 효율적으로 분산 처리한다. 
- CPU 바운드 작업(계산 집약적)일 때 최적의 효과를 낸다.

### 자바 병렬 스트림

- parallel(): 내부적으로 Fork/Join 공용 풀을 사용하여 병렬처리한다.
- 공용 풀을 공유하므로 I/O 대기 작업이나 동시 요청이 많아지는 상황에서 병목 현상 발생할 수 있다.
- CPU 바운드(계산 집약적) 작업에만 사용하는 것이 권장된다.
- I/O 바운드 작업(DB 조회, 외부 API 호출 등)은 오랜 대기 시간이 발생하므로, 제한된 스레드만 쓰는 Fork/Join 공용 풀과 궁합이 좋지 않다.

### I/O 바운드 작업일 경우 

- I/O 바운드 작업처럼 대기가 긴 경우에는 전용 스레드 풀(ExecutorService)을 만들어 사용하는 것을 권장한다.
스레드 풀의 크기, 스레드 생성 정책, 큐 타입 등을 상황에 맞게 튜닝할 수 있어 확장성과 안정성이 높아진다.

<br>
<hr>

## 합성함수 

```java
public static void main(String[] args) {

    Function<Integer, Integer> square = x -> x * x;
    Function<Integer, Integer> add = x -> x + 1;

    // (2 + 1) * (2 + 1) =  9
    Function<Integer, Integer> newFunc1 = square.compose(add);
    System.out.println("newFunc1 결과: " + newFunc1.apply(2));

    // 2 * 2 + 1 = 5
    Function<Integer, Integer> newFunc2 = square.andThen(add);
    System.out.println("newFunc2 결과: " + newFunc2.apply(2));
}

public static void main(String[] args) {

    Function<String, Integer> parseInt = Integer::parseInt;
    Function<Integer, Integer> square = x -> x * x;
    Function<Integer, String> toString = x -> "결과: " + x;

    // compose 혹은 andThen으로 합성하기
    // parseInt -> square -> toString 순서로 하고 싶다면 andThen()을 사용
    Function<String, String> finalFunc = parseInt
            .andThen(square)
            .andThen(toString);

    // 문자열 "5"를 입력하면 파싱-> 제곱-> 문자열 출력 순서
    String result1 = finalFunc.apply("5");
    System.out.println(result1); // "결과: 25"
    String result2 = finalFunc.apply("10");
    System.out.println(result2); // "결과: 100"

    // 또 다른 조합으로 사용 가능
    Function<String, Integer> stringToSquareFunc = parseInt
            .andThen(square);
    Integer result3 = stringToSquareFunc.apply("5");
    System.out.println("result3 = " + result3);
}
```


- 소스코드: <https://github.com/jeongkeepscalm/java-lambda/tree/master/src> 