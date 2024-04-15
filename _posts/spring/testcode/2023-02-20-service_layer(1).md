---
title: Service Layer 테스트 코드
description: 테스트 코드, 서비스 계층
date: 2024-02-20T05:00:000
categories: [ Spring, Test Code ]
tags: [ back-end, spring, test code, mockito, service layer, stubbing ]
---

<h2> 서비스 계층 테스트 </h2>

- 서비스 계층 테스트가 유용한 이유.
  - 서비스 레이어에서는 직접적으로 Spring 에 접근하여 테스트할 필요 없이 <br>
    코드의 비지니스 로직만을 테스트 할 수 있게 해야 하기 때문에 ```@SpringBootTest```나 ```@DataJpaTest```<br>
    와 같은 테스트 실행시 build 에 시간이 오래 소요되는 작업을 스킵할 수 있음.
  - 수행되는 속도가 빠름으로 내가 만든 로직을 만들어가면서 계속 테스트할 수 있음.
  - 유지보수성, 테스트 용이성, 확장성을 증가 시킬 수 있음.

<br>

<h2> @ExtendWith(MockitoExtension.class) </h2>

- ```Mockito```를 테스트 클래스에서 사용하게 해줌.
- ```Mock```, ```Stub``` 객체를 생성할 수 있게 해줌

<br>

<h2> @Mock </h2>

- 가짜 구현체를 선언하게 해줌
- 가짜 구현체를 통해 특정 행위를 Stubbing 하고 값을 return 받는것처럼 꾸며줌
- 테스트의 대상이 되는 객체의 의존성 주입을 위한 선언
  - 예를 들어 ```AService``` 가 의존하고 있는 ```ARepository``` 가 있다고 할때 ```ARepository``` 를 ```@Mock``` 한다.

<br>

<h2> @InjectMocks </h2>

- 가짜 구현체를 선언하게 해줌
- 테스트의 대상이 되는 객체 선언
  - 예를 들어 ```AService``` 가 의존하고 있는 ```ARepository``` 가 있다고 할때 ```AService``` 를 ```@InjectMocks``` 한다.

<br>

<h2> @BeforeEach </h2>

- 각각의 테스트가 실행되기 전 항상 실행되게 하는 어노테이션, 테스트 오브젝트간 독립성 유지를 위해 사용한다. ```@AfterEach```도 있다.

<br>

<h2> when().thenReturn(); </h2>

- ```when(customerRepository.save(any(Customer.class))).thenReturn(customerDto.toEntity())```
  - 위의 코드는 ```when(...)``` 이 일어나면 ```thenReturn(...)```를 반환한다는 선언 이걸 stubbing 라고 한다.

<br>

<h2> 테스트 예시가될 Service 코드와 메소드 </h2>

- 진짜로 서비스 코드의 로직을 실행시키는지 테스트를 하기 위해 로직이 실행된 후 phone 값을 임의로 변경.

```java

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
  private final CustomerRepository customerRepository;

  @Override
  public CustomerDto save(CustomerDto customerDto) {
    Customer save = customerRepository.save(customerDto.toEntity());
    log.info("save entity = {}", save);
    save.setPhone("mock test!!!");
    return save.toDto();
  }
}
```

<br>

<h2> 테스트 코드 </h2>

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.spring.example.jpa.dto.CustomerDto;
import org.spring.example.jpa.entity.Customer;
import org.spring.example.jpa.service.CustomerServiceImpl;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@Slf4j
@ExtendWith(MockitoExtension.class)
public class RepositoryTest {

  @Mock
  private CustomerRepository customerRepository;

  @InjectMocks
  private CustomerServiceImpl customerService;

  private CustomerDto customerDto;

  @BeforeEach
  void setUp() {
    customerDto =
      CustomerDto.builder()
        .customerId("johnDoe@gmail.com")
        .firstName("john")
        .lastName("doe")
        .address("동작대로 xx길 xxx xx")
        .phone("555-0101")
        .build();
  }

  @Test
  void customer_save_ok_1() {
    when(customerRepository.save(any(Customer.class))).thenReturn(customerDto.toEntity());
    CustomerDto save = customerService.save(new CustomerDto());
    Assertions.assertNotNull(save);
    Assertions.assertNotEquals(customerDto.getPhone(), save.getPhone());
    Assertions.assertEquals(save.getPhone(), "mock test!!!");
  }

}
```

<br>

- 첫번째 필드 : 실제로 테스트의 대상이 되는 Service에 필요한 의존성을 ```@Mock``` 한다.

```java

@Mock
private CustomerRepository customerRepository;
```

- 두번째 필드 : 실제로 테스트의 대상이 되는 Service를 설정한다.

```java

@InjectMocks
private CustomerServiceImpl customerService;
```

- 세번째 필드 : subbing 될 객체를 전역 변수로 빼놓는다.(테스트 하기 쉽게 하기 위함.)

```java
private CustomerDto customerDto;
```

- ```void setUp()``` : 테스트 실행전 초기화 작업을 위해 설정, 해당 값을 stubbing에 사용할 예정.

```java

@BeforeEach
void setUp() {
  customerDto =
    CustomerDto.builder()
      .customerId("johnDoe@gmail.com")
      .firstName("john")
      .lastName("doe")
      .address("동작대로 xx길 xxx xx")
      .phone("555-0101")
      .build();

  //  public Customer toEntity() {
  //    return Customer.builder()
  //      .customerId(customerId)
  //      .firstName(firstName)
  //      .lastName(lastName)
  //      .address(address)
  //      .phone(phone)
  //      .build();
  //  }

}
```

<br>

- ```void customer_save_ok_1()``` : 실제 테스트가 될 코드

- ```when(customerRepository.save(any(Customer.class))).thenReturn(customerDto.toEntity())```
  - when 인자 값으로 ```customerRepository.save(any(Customer.class))```가 실행되면 <br>
    thenReturn 인자 값을 선언된 객체를 반환한다. 해당 테스트에서는 ```Customer``` 반환.
    - ```any(Class<T> type)``` : 인자값으로 받을 클래스 타입 설정. 타입만 맞으면 thenReturn 을 보장하겠다는 표현.


- ```CustomerDto save = customerService.save(new CustomerDto());```
  - when에 설정한 대로 클래스 타입만 맞춘 후 thenReturn 되는 stubbing 객체를 반환받음.


- 기타 검증을 위한 코드
  - ```Assertions.assertNotNull(save);```
    - 객체가 잘 리턴 되었는지 확인
  - ```Assertions.assertNotEquals(customerDto.getPhone(), save.getPhone());```
    - 실제 서비스로직을 작동 시켰는지 확인, save 메소드 안에서 phone 값을 바꾸엇음으로 해당 검증은 통과되어야한다.
  - ```Assertions.assertEquals(save.getPhone(),"mock test!!!");```
    - 값이 바뀐것만으로는 못 믿겠으니까 실제 값을 비교

![test](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/aa032ee5-0a4b-4790-b380-9bb7328a64d6)

- 테스트 결과
  - Spring boot 안에 설정된 서비스를 실행시키는 테스트지만 실행 시간이 2.3초정도로 매우 짧다.
    - 콘솔을 확인해보면 Spring Bean 들을 전혀 안긁어옴.
  - 테스트 통과.
