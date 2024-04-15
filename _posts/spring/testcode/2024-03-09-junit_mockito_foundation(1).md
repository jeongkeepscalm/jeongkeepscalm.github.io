---
title: Junit, Mockito (1)
description: 테스트 코드 기초
date: 2024-03-09T21:00:000
categories: [ Spring, Test Code ]
tags: [ back-end, java, spring, test code, mockito ]
---

<br>

<h2> 격리된 service layer 테스트 </h2>

- ```@SpringBootTest```를 이용한 프로젝트를 ```build```하여 테스트를 하는 방식이아닌 특정 ```service layer```만 떼어 내서 테스트 하는 방법

<br>


<h2> 테스트할 서비스 코드 </h2>

- ```ServiceLayerTestService```
  - ```RandomNumber``` Component에서 selectNumber() 메소드를 통해 전달받은 값의 짝수일 때 ```true```를 반환하는 서비스
  - ```@SpringBootTest``` 어노테이션을 사용하지 않고 해당 서비스를 테스트 하려면 어떻게 해야 할까?

```java

public interface ServiceLayerTestService {
  boolean checkEvenNumber();
}

@Service
@RequiredArgsConstructor
public class ServiceLayerTestServiceImpl implements ServiceLayerTestService {

  private final RandomNumber randomNumber;

  @Override
  public boolean checkEvenNumber() {
    return randomNumber.selectNumber() % 2 == 0;
  }

}

```

<br>

- ```RandomNumber```

```java
public interface RandomNumber {
  int selectNumber();
}

@Component
public class RandomNumberImpl implements RandomNumber {
  @Override
  public int selectNumber() {
    return new Random().nextInt();
  }
}
```

<br>

<h2> 테스트 코드 </h2>

- ```ServiceLayerTest```
  - ```@ExtendWith(MockitoExtension.class)```
    - ```Mock``` 객체를 생성하고 테스트 할 수 있게 해주는 어노테이션(
      - [참고](https://www.baeldung.com/mockito-junit-5-extension){:target="\_blank"})
    - ```@Mock``` : 테스트 대상이 되는 빈에 설정되어있는 의존성을 가짜로 주입해주는 어노테이션
      - 해당 서비스에서는 ```RandomNumber``` 컴포넌트가 서비스를 실행하는데 필요함으로 ```@Mock```으로 설정
    - ```@InjectMocks``` : 실제 테스트 대상이되는 서비스
      - 주입시켜 주는 부분에서 테스트 대상이 되는 객체를 Interface로 설정하면 테스트 진행이 안됨 실제로 구현하고 있는 구현체를 설정 해준다.
    - ```when(randomNumber.selectNumber()).thenReturn(10)``` : 가짜로 주입된 ```RandomNumber``` 컴포넌트에서 실행될 메소드의 값을 정해준다.
      테스트 대상이되는 서비스에서 ```randomNumber.selectNumber()```가 실행되면 ```10```을 리턴해주는 설정.
    - ```verify(randomNumber).selectNumber()``` : 실제로 ```randomNumber``` 컴포넌트에서 ```selectNumber()``` 메소드가 서비스 내에서 실행 됐는지
      검증해주는 메소드
    - ```verify(randomNumber, times(1)).selectNumber()``` : 해당 메소드의 실행 횟수를 검증해주는 메소드

```java

@ExtendWith(MockitoExtension.class)
public class ServiceLayerTest {

  @InjectMocks    //  interface 는 주입이 안됨! impl 로 테스트
  private ServiceLayerTestServiceImpl serviceLayerTestService;

  @Mock
  private RandomNumber randomNumber;

  @Test
  void even_test() {
    when(randomNumber.selectNumber()).thenReturn(10);
    Assertions.assertTrue(serviceLayerTestService.checkEvenNumber());
  }

  @Test
  void even_verity_test() {
    when(randomNumber.selectNumber()).thenReturn(10);
    Assertions.assertTrue(serviceLayerTestService.checkEvenNumber());
    verify(randomNumber).selectNumber();    //  selectNumber() 메소드가 실행 되었는지 테스트
    verify(randomNumber, times(1)).selectNumber();  //  times() 호출 횟수 검증.
  }

}
```

<br>

<h2> 테스트 결과 </h2>

![test_result](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/733c6bcb-276e-4127-8972-3603a2cc2439)

