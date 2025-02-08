---
title: "[Spring] mvc-advanced"
description: "[Spring] mvc-advanced"
date: 2025-02-08
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

# 동시성 문제

- 여러 쓰레드가 동시에 같은 인스턴스의 필드 값을 변경하면서 발생하는 문제

<br>
<hr>

# 쓰레드 로컬

- 해당 쓰레드만 접근할 수 있는 특별한 저장소  
  <img src="/assets/img/spring/advanced/threadLocal.png" width="500px" />

<br>
<hr>

# 템플릿 메소드 패턴(Template Method Pattern)

- 특징 및 장점
  - 변하지 않는 코드를 템플릿화하여 사용하는 방식
  - 일부 변하는 부분을 별도로 호출해서 해결
  - 부모 클래스에 변하지 않는 템플릿을 두고, 변하는 부분을 자식 클래스에 두어서 상속을 사용해서 문제를 해결
  - `SRP:` 변경 지점을 하나로 모아서 변경에 쉽게 대처할 수 있는 구조
- 단점
  - 상속을 받아 사용하기에 부모 클래스에 완전히 의존
  - 좋지 않은 설계(부모의 기능을 모두 사용하지 않는데, 부모를 알아야 한다.)
  - 익명 내부 클래스 사용으로 인한 코드 복잡도 증가

<details>
<summary><span style="color:orange" class="point"><b>Basic Code</b></span></summary>
<div markdown="1">

```java
@Slf4j
public abstract class AbstractTemplate {
    public void execute() {
        long startTime = System.currentTimeMillis();
        //비즈니스 로직 실행
        call(); //상속
        //비즈니스 로직 종료
        long endTime = System.currentTimeMillis();
        long resultTime = endTime - startTime;
        log.info("resultTime={}", resultTime);
    }
    protected abstract void call();
}

@Slf4j
public class SubClassLogic1 extends AbstractTemplate {
    @Override
    protected void call() {
        log.info("비즈니스 로직1 실행");
    }
}

@Slf4j
public class SubClassLogic2 extends AbstractTemplate {
    @Override
    protected void call() {
        log.info("비즈니스 로직2 실행");
    }
}

@Test
void templateMethodV1() {
		AbstractTemplate template1 = new SubClassLogic1();
		template1.execute();
		AbstractTemplate template2 = new SubClassLogic2();
		template2.execute();
}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>익명 내부 클래스 사용</b></span></summary>
<div markdown="1">

```java
@Test
    void templateMethodV2() {
        AbstractTemplate template1 = new AbstractTemplate() {
            @Override
            protected void call() {
                log.info("비즈니스 로직1 실행");
            }
        };
        log.info("클래스 이름1={}", template1.getClass());
        template1.execute();
        
        AbstractTemplate template2 = new AbstractTemplate() {
            @Override
            protected void call() {
                log.info("비즈니스 로직1 실행");
            }
        };
        log.info("클래스 이름2={}", template2.getClass());
        template2.execute();
    }

```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>부모 클래스가 되는 템플릿</b></span></summary>
<div markdown="1">

```java
public abstract class AbstractTemplate<T> {

    private final LogTrace trace;
    public AbstractTemplate(LogTrace trace) {
        this.trace = trace;
    }

    public T execute(String message) {
        TraceStatus status = null;
        try {
            status = trace.begin(message);

            // 로직 호출
            T result = call();

            trace.end(status);
            return result;
        } catch (Exception e) {
            trace.exception(status, e);
            throw e;
        }
    }

    protected abstract T call();
}


@RestController
@RequiredArgsConstructor
public class OrderControllerV4 {

    private final OrderServiceV4 orderService;
    private final LogTrace trace;

    @GetMapping("/v4/request")
    public String request(String itemId) {
        AbstractTemplate<String> template = new AbstractTemplate<>(trace) {
            @Override
            protected String call() {
                orderService.orderItem(itemId);
                return "ok";
            }
        };
        return template.execute("OrderController.request()");

    }
}
```

</div>
</details>

<br>
<hr>

# 전략 패턴(Strategy Pattern)

- 특징
  - 템플릿 메소드 패턴과 비슷한 역할을 하면서 상속의 단점을 제거
  - `Context`: 변하지 않는 템플릿 역할
  - `Strategy(Interface)`: 변하는 알고리즘 역할
  - 스프링에서 의존관계 주입에서 사용하는 방식이 전략 패턴을 사용한 것이다.

<details>
<summary><span style="color:orange" class="point"><b>필드에 전략을 보관하는 방식</b></span></summary>
<div markdown="1">

```java
public interface Strategy {
    void call();
}

/*
	 필드에 전략을 보관하는 방식
	 Context 와 Strategy 를 조립한 이후에는 전략을 변경하기가 번거롭다.
 */
@Slf4j
public class ContextV1 {

    private Strategy strategy;

    public ContextV1(Strategy strategy) {
        this.strategy = strategy;
    }

    public void execute() {
        long startTime = System.currentTimeMillis();
        //비즈니스 로직 실행
        strategy.call(); //위임
        //비즈니스 로직 종료
        long endTime = System.currentTimeMillis();
        long resultTime = endTime - startTime;
        log.info("resultTime={}", resultTime);
    }

}

@Slf4j
public class StrategyLogic1 implements Strategy{
    @Override
    public void call() {
        log.info("비즈니스 로직1 실행");
    }
}

@Slf4j
public class StrategyLogic2 implements Strategy{
    @Override
    public void call() {
        log.info("비즈니스 로직2 실행");
    }
}

@Slf4j
public class ContextV1Test {

    @Test
    void strategyV0() {
        logic1();
        logic2();
    }

    private void logic1() {
        long startTime = System.currentTimeMillis();
        //비즈니스 로직 실행
        log.info("비즈니스 로직1 실행");
        //비즈니스 로직 종료
        long endTime = System.currentTimeMillis();
        long resultTime = endTime - startTime;
        log.info("resultTime={}", resultTime);
    }

    private void logic2() {
        long startTime = System.currentTimeMillis();
        //비즈니스 로직 실행
        log.info("비즈니스 로직2 실행");
        //비즈니스 로직 종료
        long endTime = System.currentTimeMillis();
        long resultTime = endTime - startTime;
        log.info("resultTime={}", resultTime);
    }

    /**
     * 전략 패턴 적용
     */
    @Test
    void strategyV1() {
        Strategy strategyLogic1 = new StrategyLogic1();
        ContextV1 context1 = new ContextV1(strategyLogic1);
        context1.execute();
        Strategy strategyLogic2 = new StrategyLogic2();
        ContextV1 context2 = new ContextV1(strategyLogic2);
        context2.execute();
    }


    /**
     * 전략 패턴 익명 내부 클래스1
     */
    @Test
    void strategyV2() {
        Strategy strategyLogic1 = new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직1 실행");
            }
        };
        log.info("strategyLogic1={}", strategyLogic1.getClass());
        ContextV1 context1 = new ContextV1(strategyLogic1);
        context1.execute();
        Strategy strategyLogic2 = new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직2 실행");
            }
        };
        log.info("strategyLogic2={}", strategyLogic2.getClass());
        ContextV1 context2 = new ContextV1(strategyLogic2);
        context2.execute();
    }


    /**
     * 전략 패턴 익명 내부 클래스2
     */
    @Test
    void strategyV3() {
        ContextV1 context1 = new ContextV1(new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직1 실행");
            }
        });
        context1.execute();
        ContextV1 context2 = new ContextV1(new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직2 실행");
            }
        });
        context2.execute();
    }

    /**
     * 전략 패턴, 람다
     */
    @Test
    void strategyV4() {
        ContextV1 context1 = new ContextV1(() -> log.info("비즈니스 로직1 실행"));
        context1.execute();
        ContextV1 context2 = new ContextV1(() -> log.info("비즈니스 로직2 실행"));
        context2.execute();
    }
}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>전략을 파라미터로 전달받는 방식</b></span></summary>
<div markdown="1">

```java
/*
	전략을 파라미터로 전달 받는 방식
	
	* 템플릿 콜백 패턴	 
		다른 코드의 인수로서 넘겨주는 실행 가능한 코드
		execute() 매개변수가 Callback interface로만 변경되면 callback 콜백 패턴이다.
 */
@Slf4j
public class ContextV2 {
    public void execute(Strategy strategy) {
        long startTime = System.currentTimeMillis();
        //비즈니스 로직 실행
        strategy.call(); //위임
        //비즈니스 로직 종료
        long endTime = System.currentTimeMillis();
        long resultTime = endTime - startTime;
        log.info("resultTime={}", resultTime);
    }
}

@Slf4j
public class ContextV2Test {

    /**
     * 전략 패턴 적용
     * Context 와 Strategy 를 '선 조립 후 실행'하는 방식이 아니라 Context 를 실행할 때 마다 전략을 인수로 전달한다.
     */
    @Test
    void strategyV1() {
        ContextV2 context = new ContextV2();
        context.execute(new StrategyLogic1());
        context.execute(new StrategyLogic2());
    }

    /**
     * 전략 패턴 익명 내부 클래스
     */
    @Test
    void strategyV2() {
        ContextV2 context = new ContextV2();
        context.execute(new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직1 실행");
            }
        });
        context.execute(new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직2 실행");
            }
        });
    }

    /**
     * 전략 패턴 익명 내부 클래스2, 람다
     */
    @Test
    void strategyV3() {
        ContextV2 context = new ContextV2();
        context.execute(() -> log.info("비즈니스 로직1 실행"));
        context.execute(() -> log.info("비즈니스 로직2 실행"));
    }
}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>콜백 패턴</b></span></summary>
<div markdown="1">

```java
public class TraceTemplate {

    private final LogTrace trace;
    public TraceTemplate(LogTrace logTrace) {
        this.trace = logTrace;
    }

    public <T> T execute(String message, TraceCallback<T> callback) {
        TraceStatus status = null;
        try {
            status = trace.begin(message);
            T result = callback.call();
            trace.end(status);
            return result;
        } catch (Exception e) {
            trace.exception(status, e);
            throw e;
        }
    }

}


@RestController
public class OrderControllerV5 {

    private final OrderServiceV5 orderService;
    private final TraceTemplate template;

    public OrderControllerV5(OrderServiceV5 orderService, LogTrace trace) {
        this.orderService = orderService;
        this.template = new TraceTemplate(trace);
    }

    @GetMapping("/v5/request")
    public String request(String itemId) {

        return template.execute("OrderController.request()", () -> {
           orderService.orderItem(itemId);
            return "ok";
        });

        /*
            익명 내부 클래스

            return template.execute("OrderController.request()", new TraceCallback<String>() {
                @Override
                public String call() {
                    orderService.orderItem(itemId);
                    return "ok";
                }
            });
        */
    }
}

@Configuration
public class LogTraceConfig {

    @Bean
    public LogTrace logTrace() {
        // return new FieldLogTrace();
        /*
            FieldLogTrace
                싱글톤으로 등록된 스프링 빈
                해당 객체의 인스턴스는 애플리케이션에 1개만 존재하게 된다. 
                해당 인스턴스를 여러 쓰레드가 동시에 접근할 경우 "동시성 문제 발생!"
         */

        /**
         * LogTrace 인터페이스의 구현체로 ThreadLocalLogTrace 를 사용하겠다.
         */
        return new ThreadLocalLogTrace();
    }

}

@Service
public class OrderServiceV5 {

    private final OrderRepositoryV5 orderRepository;
    private final TraceTemplate template;

    public OrderServiceV5(OrderRepositoryV5 orderRepository, LogTrace trace) {
        this.orderRepository = orderRepository;
        this.template = new TraceTemplate(trace);
    }

    public void orderItem(String itemId) {
        template.execute("OrderService.orderItem()", () -> {
            orderRepository.save(itemId);
            return null;
        });
    }

}

@Repository
public class OrderRepositoryV5 {

    private final TraceTemplate template;
    public OrderRepositoryV5(LogTrace trace) {
        this.template = new TraceTemplate(trace);
    }

    public void save(String itemId) {

        template.execute("OrderRepository.save()", () -> {
            // 저장 로직
            if (itemId.equals("ex")) {
                throw new IllegalStateException("예외 발생!");
            }
            sleep(1000);
            return null;
        });

    }

    private void sleep(int millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

</div>
</details>

<br>
<hr>

# 프록시 패턴 & 데코레이터 패턴

- <img src="/assets/img/spring/advanced/proxy1.png" width="500px">
- 서버와 프록시가 같은 인터페이스를 사용한다.
  - 클라이언트는 서버에게 요청한 것인지, 프록시에게 요청한 것인지 조차 몰라야 한다. 
  - <img src="/assets/img/spring/advanced/proxy2.png" width="500px">
  
- 프록시 주요 기능
  - 접근 제어: `프록시 패턴`
    - 권한에 따른 접근 차단
    - 캐싱
    - 지연 로딩
  - 부가 기능 추가: `데코레이터 패턴`
    - 예) 요청 값이나, 응답 값을 중간에 변형
    - 예) 실행 시간을 측정해서 추가 로그를 남긴다.
  
<details>
<summary><span style="color:orange" class="point"><b>프록시 패턴(접근 제어)</b></span></summary>
<div markdown="1">

```java
public interface Subject {
    String operation();
}

@Slf4j
public class RealSubject implements Subject {

    @Override
    public String operation() {
        log.info("실제 객체 호출");
        sleep(1000);
        return "data";
    }

    private void sleep(int millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}

public class ProxyPatternClient {

    private Subject subject;
    public ProxyPatternClient(Subject subject) {
        this.subject = subject;
    }
    public void execute() {
        subject.operation();
    }
}

@Slf4j
public class CacheProxy implements Subject {

    private Subject target;
    private String cacheValue;
    public CacheProxy(Subject target) {
        this.target = target;
    }

    @Override
    public String operation() {
        log.info("프록시 호출");
        if (cacheValue == null) {
            cacheValue = target.operation();
        }
        return cacheValue;
    }
}

public class ProxyPatternTest {

    @Test
    void noProxyTest() {
        Subject realSubject = new RealSubject();
        ProxyPatternClient client = new ProxyPatternClient(realSubject);
        client.execute();
        client.execute();
        client.execute();
        /*
            실제 객체 호출 (1초)
            실제 객체 호출 (1초)
            실제 객체 호출 (1초)
         */
    }

    @Test
    void cacheProxyTest() {
        Subject realSubject = new RealSubject();
        Subject cacheProxy = new CacheProxy(realSubject);
        ProxyPatternClient client = new ProxyPatternClient(cacheProxy);
        client.execute();
        client.execute();
        client.execute();
        /*
            프록시 호출
            실제 객체 호출    (1초)
            프록시 호출      (즉시 호출)
            프록시 호출      (즉시 호출)
         */
    }

}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>데코레이터 패턴(부가 기능 추가)</b></span></summary>
<div markdown="1">

```java
public interface Component {
    String operation();
}

@Slf4j
public class RealComponent implements Component{
    @Override
    public String operation() {
        log.info("RealComponent 실행");
        return "data";
    }
}

@Slf4j
public class MessageDecorator implements Component {

    private Component component;
    public MessageDecorator(Component component) {
        this.component = component;
    }

    @Override
    public String operation() {
        log.info("MessageDecorator 실행");
        String result = component.operation();
        String decoResult = "***" + result + "***";
        log.info("MessageDecorator 꾸미기 적용 전={}, 적용 후={}", result, decoResult);
        return decoResult;
    }
}

@Slf4j
public class TimeDecorator implements Component {
    private Component component;

    public TimeDecorator(Component component) {
        this.component = component;
    }

    @Override
    public String operation() {
        log.info("TimeDecorator 실행");
        long startTime = System.currentTimeMillis();
        String result = component.operation();
        long endTime = System.currentTimeMillis();
        long resultTime = endTime - startTime;
        log.info("TimeDecorator 종료 resultTime={}ms", resultTime);
        return result;
    }

}

@Slf4j
public class DecoratorPatternClient {

    private Component component;

    public DecoratorPatternClient(Component component) {
        this.component = component;
    }

    public void execute() {
        String result = component.operation();
        log.info("result={}", result);
    }

}

@Slf4j
public class DecoratorPatternTest {

    @Test
     void noDecorator() {
        Component realComponent = new RealComponent();
        DecoratorPatternClient client = new DecoratorPatternClient(realComponent);
        client.execute();
    }

    @Test
    void decorator1() {
        Component realComponent = new RealComponent();
        Component messageDecorator = new MessageDecorator(realComponent);
        DecoratorPatternClient client = new DecoratorPatternClient(messageDecorator);
        client.execute();
    }

    @Test
    void decorator2() {
        Component realComponent = new RealComponent();
        Component messageDecorator = new MessageDecorator(realComponent);
        Component timeDecorator = new TimeDecorator(messageDecorator);
        DecoratorPatternClient client = new DecoratorPatternClient(timeDecorator);
        client.execute();
    }

}
```

</div>
</details>

<br>

***⭐​ 정리***  
프록시를 사용하고 해당 프록시가 접근 제어가 목적이라면 프록시 패턴이고, 새로운 기능을 추가하는 것이 목적이라면 데코레이터 패턴이 된다.  

<br>

### 인터페이스 기반 프록시 - 적용

<img src="/assets/img/spring/advanced/proxy3.png" width="500px" />
<img src="/assets/img/spring/advanced/proxy4.png" width="500px" />

<details>
<summary><span style="color:orange" class="point"><b>인터페이스가 있는 구현 클래스에 적용</b></span></summary>
<div markdown="1">

```java
/**
 * 이전 OrderRepositoryImpl 에 추가해야했었던 로직을 프록시를 사용하여 분리한다.
 */
@RequiredArgsConstructor
public class OrderRepositoryInterfaceProxy implements OrderRepositoryV1 {

    private final OrderRepositoryV1 target;
    private final LogTrace logTrace;

    @Override
    public void save(String itemId) {
        TraceStatus status = null;
        try {
            status = logTrace.begin("OrderRepository.save()");
            //target 호출
            target.save(itemId);
            logTrace.end(status);
        } catch (Exception e) {
            logTrace.exception(status, e);
            throw e;
        }
    }
}

@RequiredArgsConstructor
public class OrderServiceInterfaceProxy implements OrderServiceV1 {

    private final OrderServiceV1 target;
    private final LogTrace logTrace;

    @Override
    public void orderItem(String itemId) {
        TraceStatus status = null;
        try {
            status = logTrace.begin("OrderService.orderItem()");
            //target 호출
            target.orderItem(itemId);
            logTrace.end(status);
        } catch (Exception e) {
            logTrace.exception(status, e);
            throw e;
        }
    }

}

@RequiredArgsConstructor
public class OrderControllerInterfaceProxy implements OrderControllerV1 {

    private final OrderControllerV1 target;
    private final LogTrace logTrace;

    @Override
    public String request(String itemId) {
        TraceStatus status = null;
        try {
            status = logTrace.begin("OrderController.request()");
            //target 호출
            String result = target.request(itemId);
            logTrace.end(status);
            return result;
        } catch (Exception e) {
            logTrace.exception(status, e);
            throw e;
        }
    }

    @Override
    public String noLog() {
        return target.noLog();
    }

}
```

```java
@Configuration
public class InterfaceProxyConfig {

    @Bean
    public OrderControllerV1 orderController(LogTrace logTrace) {
        OrderControllerV1Impl controllerImpl = new
                OrderControllerV1Impl(orderService(logTrace));
        return new OrderControllerInterfaceProxy(controllerImpl, logTrace);
    }
    @Bean
    public OrderServiceV1 orderService(LogTrace logTrace) {
        OrderServiceV1Impl serviceImpl = new
                OrderServiceV1Impl(orderRepository(logTrace));
        return new OrderServiceInterfaceProxy(serviceImpl, logTrace);
    }
    @Bean
    public OrderRepositoryV1 orderRepository(LogTrace logTrace) {
        OrderRepositoryV1Impl repositoryImpl = new OrderRepositoryV1Impl();
        return new OrderRepositoryInterfaceProxy(repositoryImpl, logTrace);
    }

}

@Import(InterfaceProxyConfig.class)
@SpringBootApplication(scanBasePackages = "hello.proxy.app") // 주의
public class ProxyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProxyApplication.class, args);
	}

	@Bean
	public LogTrace logTrace() {
		return new ThreadLocalLogTrace();
	}

}
```

</div>
</details>

### 구체 클래스 기반 프록시

- 인터페이스가 없는 구체 클래스에 프록시 적용(클래스를 상속받아 프록시 클래스 사용)

<details>
<summary><span style="color:orange" class="point"><b>구체 클래스 기반 프록시 - 예제</b></span></summary>
<div markdown="1">

```java
@Slf4j
public class ConcreteLogic {

    public String operation() {
        log.info("ConcreteLogic 실행");
        return "data";
    }

}

@Slf4j
public class TimeProxy extends ConcreteLogic {

    private ConcreteLogic realLogic;

    public TimeProxy(ConcreteLogic realLogic) {
        this.realLogic = realLogic;
    }

    @Override
    public String operation() {
        log.info("TimeDecorator 실행");
        long startTime = System.currentTimeMillis();
        String result = realLogic.operation();
        long endTime = System.currentTimeMillis();
        long resultTime = endTime - startTime;
        log.info("TimeDecorator 종료 resultTime={}", resultTime);
        return result;
    }
}

public class ConcreteClient {

    private ConcreteLogic concreteLogic;
    public ConcreteClient(ConcreteLogic concreteLogic) {
        this.concreteLogic = concreteLogic;
    }
    public void execute() {
        concreteLogic.operation();
    }

}

public class ConcreteProxyTest {

    @Test
    void noProxy() {
        ConcreteLogic concreteLogic = new ConcreteLogic();
        ConcreteClient client = new ConcreteClient(concreteLogic);
        client.execute();
    }

    @Test
    void addProxy() {
        ConcreteLogic concreteLogic = new ConcreteLogic();
        TimeProxy timeProxy = new TimeProxy(concreteLogic);
        ConcreteClient client = new ConcreteClient(timeProxy);
        client.execute();
    }

}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>구채 클래스 기반 프록시 - 적용</b></span></summary>
<div markdown="1">

```java
/* 
  서비스 프록시만 예시로 보여줌
*/
@RequiredArgsConstructor
public class OrderServiceInterfaceProxy implements OrderServiceV1 {

    private final OrderServiceV1 target;
    private final LogTrace logTrace;

    @Override
    public void orderItem(String itemId) {
        TraceStatus status = null;
        try {
            status = logTrace.begin("OrderService.orderItem()");
            //target 호출
            target.orderItem(itemId);
            logTrace.end(status);
        } catch (Exception e) {
            logTrace.exception(status, e);
            throw e;
        }
    }

}

@Configuration
public class ConcreteProxyConfig {

    @Bean
    public OrderControllerV2 orderControllerV2(LogTrace logTrace) {
        OrderControllerV2 controllerImpl = new
                OrderControllerV2(orderServiceV2(logTrace));
        return new OrderControllerConcreteProxy(controllerImpl, logTrace);
    }
    @Bean
    public OrderServiceV2 orderServiceV2(LogTrace logTrace) {
        OrderServiceV2 serviceImpl = new
                OrderServiceV2(orderRepositoryV2(logTrace));
        return new OrderServiceConcreteProxy(serviceImpl, logTrace);
    }
    @Bean
    public OrderRepositoryV2 orderRepositoryV2(LogTrace logTrace) {
        OrderRepositoryV2 repositoryImpl = new OrderRepositoryV2();
        return new OrderRepositoryConcreteProxy(repositoryImpl, logTrace);
    }

}
```

</div>
</details>

<br>
<hr>

# 동적 프록시 기술


