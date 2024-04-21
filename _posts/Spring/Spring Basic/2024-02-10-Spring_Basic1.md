---
title: "[KYH] Spring Basic"
description: Spring Basic
date: 2024-02-10
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---


* 애자일 소프트웨어 개발 선언  
공정과 도구보다 **개인과 상호작용**을  
포괄적인 문서보다 **작동하는 소프트웨어**를   
계약 협상보다 **고객과의 협력**을   
계획을 따르기보다 **변화에 대응하기**를 가치 있게 여긴다.  

<br/>

### 좋은 객체 지향 설계의 5가지 원칙 ( SOLID )  

1. SRP ( Single Responsibility Principle ) 단일 책임 원칙   
  클래스는 단 하나의 기능만 가져야한다.  

2. OCP ( Open Closed Principle ) 개방 폐쇄 원칙  
  확장에는 열려있어야하며, 수정에는 닽혀있어야 한다.  
  [ 확장에 열려있다 ] : 큰 힘 들이지 않고 애플리케이션 기능을 확장한다.  
  [ 변경에 닫혀있다 ] : 새로운 변경 사항이 발생했을 때, 객체를 직접 수정하면 안된다.  

3. LSP ( Liskov Substitution Principle ) 리스코프 치환 원칙  
  서브 타입은 언제나 부모 타입으로 교체 가능해야 한다. ( 다형성 )    

4. ISP ( Interface Segregation Principle ) 인터페이스 분리 원칙  
  인터페이스를 각각 목적에 맞게 분리하자.  

5. DIP ( Dependency Inversion Principle ) 의존 역전 원칙  
  대상의 상위요소 ( 추상 클래스 or 인터페이스 )로 참조하자.  

<br/>

### 스프링컨테이너

* IOC 컨테이너 / DI 컨테이너  
  객체를 생성하고 관리하면서 의존관계를 연결해준다. ( AppConfig )  
  
```java
//스프링 컨테이너 생성
ApplicationContext applicationContext 
  = new AnnotationConfigApplicationContext(AppConfig.class);
```
ApplicationContext : 스프링 컨테이너이자 인터페이스  
XML 기반으로 만들 수 있고, 어노테이션 기반의 자바 설정 클래스로 만들 수 있다.  
AppConfig.class : 애노테이션 기반의 자바 설정 클래스로 만든 예시  
객체의 생성과 생명주기 관리, 의존성 주입을 담당한다.  
BeanFactory나 ApplicationContext를 스프링 컨테이너라 한다.  
  
스프링 컨테이너 생성 > 설정 정보를 참고하여 스프링 빈 등록 > 의존관계 설정
<img src="/assets/img/appconfig.jpg" width="600px">  
  
* AnnotationConfigApplicationContext > ApplicationContext(Interface) > BeanFactory(Interface)  
  ApplicationContext : BeanFactory 기능 + 부가 기능  
<img src="/assets/img/applicationContext.jpg" width="800px">  

<br/>

### 다양한 설정 형식 지원

1. 어노테이션 기반 자바 코드
  AnnotationConfigApplicationContext 클래스를 사용하면서 자바 코드로된 설정 정보를 넘기면 된다.  
2. XML 
  스프링 부트를 많이 사용하면서 XML 기반의 설정은 잘 사용하지 않는다.   
  GenericXmlApplicationContext 를 사용하면서 xml 설정 파일을 넘기면 된다.  

* 스프링 빈 설정 메타 정보 ( BeanDefinition )  
  설정 정보를 읽고 BeanDefinition을 생성한다. 스프링 컨테이너는 해당 메타정보를 기반으로 스프링 빈을 생성한다.  

<br/>

### 싱글톤 패턴

* 클래스의 인스턴스가 딱 한 개만 생성되는 것을 보장하는 디자인 패턴이다.
* private 생성자를 사용해서 외부에서 임의로 new 키워드를 사용하지 못하게 막아햐 한다. 
* 클라이언트의 요청이 올 때 마다 객체를 생성하는 것이 아니라 이미 만들어진 객체를 공유해서 효율적으로 사용할 수 있다. 
  
싱글톤 패턴 문제점  
  1. 클라이언트가 구체 클래스에 의존한다. ( DIP 위반 )  
  2. OCP 원칙 위반 가능성 높다.  
  3. 안티패턴이라 불리기도 한다.  
  
* 싱글톤 컨테이너  
  1. 스프링 컨테이너는 싱글톤 컨테이너 역할을 한다. ( 싱글톤 레지스트리 )  
  2. 스프링 컨테이너는 객체 인스턴스를 싱글톤으로 관리한다.  
<img src="/assets/img/singleTon.jpg" width="800px">  
  
* 싱글톤 방식의 주의점
  1. 여러 클라이언트가 하나의 같은 객체 인스턴스를 공유하기 때문에 싱글톤 객체는 무상태 ( stateless ) 로 설계해야 한다.  
  2. 특정 클라이언트에 의존적인 필드가 있으면 안된다. 필드 대신에 자바에서 공유되지 않는, 지역변수, 파라미터, ThreadLocal 등을 사용해야 한다.  
  
* @Configuration

```java
@Test
void configurationDeep() {
  ApplicationContext ac = new AnnotaionConfigApplicationContext(AppConfig.class);
  AppConfig bean = ac.getBean(AppConfig.class);
  bean.getClass(); // a.b.c.AppConfig$$EnhancerBySpringCGLIB$$bd479d70
}
```
> AnnotationConfigApplicationContext 에 파라미터로 넘긴 값은 스프링 빈으로 등록된다.  
> 순수한 클래스는 a.b.c.AppConfig로 출력되어야 한다.  
> 스프링이 CGLIB라는 바이트코드 조작 라이브러리를 사용해서 AppConfig 클래스를 상속받은 임의의 다른 클래스를 만들고, 그 다른 클래스를 스프링 빈으로 등록한 것이다. 그 임의의 다른 클래스가 바로 싱글톤이 보장되도록 해준다.  
> **즉, ```@Configuration``` 을 붙이면 바이트코드를 조작하는 CGLIB 기술을 사용해서 ```싱글톤을 보장```한다.**  
> 스프링 설정 정보는 항상 @Configuration 을 사용하자.  

<br/>

### 컴포넌트 스캔 ( @ComponentScan )

```java
@Configuration
@ComponentScan
public class AutoAppConfig { ... }
```
@ComponentScan 은 @Component 가 붙은 모든 클래스를 스프링 빈으로 등록한다.  
이때 스프링 빈의 기본 이름은 클래스명을 사용하되 맨 앞글자만 소문자를 사용한다.  
  
```java
@Autowired
public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
  this.memberRepository = memberRepository;
  this.discountPolicy = discountPolicy;
}
```
> ```@Autowired``` : 의존관계를 자동으로 주입해준다.  
> @Autowired 를 사용하면 생성자에서 여러 의존관계도 한번에 주입받을 수 있다. 생성자에 파라미터가 많아도 다 찾아서 자동으로 주입한다.  
  
* 탐색 위치와 기본 스캔 대상  
  예를 들어 a.b.service , a.b.repository 이런 구조로 되어 있다면,  
  a.b 프로젝트 시작 루트에 AppConfig 같은 메인 설정정보를 두고, @ComponentScan 어노테이션을 붙이고 basePackages 지정은 생략한다.  
  이렇게 하면 a.b를 포함한 하위는 모두 자동으로 컴포넌트 스캔의 대상이 된다.  
  
@Component : 컴포넌트 스캔에서 사용  
@Controller : 스프링 MVC 컨트롤러로 인식  
@Service : 스프링 비즈니스 로직에서 사용  
@Repository : 스프링 데이터 접근 계층으로 인식하고, 데이터 계층의 예외를 스프링 예외로 변환해준다.  
@Configuration : 스프링 설정 정보에서 사용하고 스프링 빈이 싱글톤을 유지하도록 추가 처리를 한다.  

<br/>

### 의존관계 자동 주입

1. 생성자 주입  
2. 수정자 주입 ( setter 주입 )  
3. 필드 주입  
4. 일반 메서드 주입  
  
* 생성자 주입을 해라!  
필드 주입은 외부에서 변경이 불가능해서 테스트 하기 힘들다.  
수정자 주입을 사용하면, setXxx 메서드를 public으로 열어두어야 한다. 누군가 실수로 변경할 수 도 있고, 변경하면 안되는 메서드를 열어두는 것은 좋은 설계 방법이 아니다.  
생성자 주입은 객체를 생성할 때 딱 1번만 호출되므로 이후에 호출되는 일이 없다. 따라서 불변하게 설계할 수 있다.  
프레임워크에 의존하지 않고, 순수한 자바 언어의 특징을 잘 살리는 방법이다.  
필수 값이 아닌 경우에는 수정자 주입 방식을 옵션으로 부여하자.  
  
* 필드주입 단점  
외부에서 접근이 불가능하지만 setter 로 접근을 해서 변경이 가능하다. 즉 불변하지 않다.    
DI 프레임워크에 의존한다.  
테스트 코드의 중요성이 부각됨에 따라 필드의 객체를 수정할 수 없는 필드 주입은 거의 사용되지 않게 되었다.  
그렇기에 애플리케이션의 실제 코드와 무관한 테스트 코드나 설정을 위해 불가피한 경우에만 이용하도록 하자.  
  
* final 키워드  
필드에 final 키워드를 붙여 생성자 주입을 한다.  
수정자 주입을 포함한 나머지 주입 방식은 모두 생성자 이후에 호출되므로, 필드에 final 키워드를 사용 할 수 없다. 오직 생성자 주입 방식만 final 키워드를 사용할 수 있다.  
  
* 롬복과 최신 트랜드  
롬복 라이브러리가 제공하는 @RequiredArgsConstructor 기능을 사용하면 final이 붙은 필드를 모아서 생성자를 자동으로 만들어준다.  
롬복이 자바의 애노테이션 프로세서라는 기능을 이용해서 컴파일 시점에 생성자 코드를 자동으로 생성해준다.  
  
* 롬북 설치  
1. Preferences(윈도우 File Settings) plugin lombok 검색 설치 실행 (재시작)  
2. Preferences Annotation Processors 검색 Enable annotation processing 체크 (재시작)  
3. 임의의 테스트 클래스를 만들고 @Getter, @Setter 확인  
  
* 조회 대상 빈이 2개 이상일 때 해결방법  
1. @Autowired 필드명 매치  
2. @Qualifier -> @Qualifier 끼리 매칭 -> 빈 이름 매칭  
빈 등록시 @Qualifier를 붙여 준다.  
3. @Primary 사용  
우선순위를 정하는 방법이다. @Autowired 시에 여러 빈이 매칭되면 @Primary 가 우선권을 가진다.  

```java 
// 1. @Autowired 필드명 매치  

// 기존 코드
@Autowired
private DiscountPolicy discountPolicy

// 변경 코드
@Autowired
private DiscountPolicy rateDiscountPolicy
```
<br/>

```java
// 2. @Qualifier

@Component
@Qualifier("mainDiscountPolicy")
public class RateDiscountPolicy implements DiscountPolicy { ... }
```
  
우선순위  
@Primary 는 기본값 처럼 동작하는 것이고, @Qualifier 는 매우 상세하게 동작한다. 스프링은 자동보다는 수동이, 넒은 범위의 선택권 보다는 좁은 범위의 선택권이 우선 순위가 높다. 따라서 여기서도 @Qualifier 가 우선권이 높다.  
  
* 업무 로직 빈: 웹을 지원하는 컨트롤러, 핵심 비즈니스 로직이 있는 서비스, 데이터 계층의 로직을 처리하는 리포지토리등이 모두 업무 로직이다. 보통 비즈니스 요구사항을 개발할 때 추가되거나 변경된다.  
* 기술 지원 빈: 기술적인 문제나 공통 관심사(AOP)를 처리할 때 주로 사용된다. 데이터베이스 연결이나, 공통 로그처리 처럼 업무 로직을 지원하기 위한 하부 기술이나 공통 기술들이다.  
  
**애플리케이션에 광범위하게 영향을 미치는 기술 지원 객체는 수동 빈으로 등록해서 딱! 설정 정보에 바로 나타나게 하는 것이 유지보수 하기 좋다.**  
  
<br/>

### 빈 생명주기 콜백

* 데이터베이스 커넥션 풀이나, 네트워크 소켓처럼 애플리케이션 시작 시점에 필요한 연결을 미리 해두고, 애플리케이션 종료 시점에 연결을 모두 종료하는 작업을 진행하려면, 객체의 초기화와 종료 작업이 필요하다.  
  
* 스프링 빈의 이벤트 라이프사이클  
스프링 컨테이너 생성 -> 스프링 빈 생성 -> 의존관계 주입 -> 초기화 콜백 -> 사용 -> 소멸전 콜백 -> 스프링 종료  
  
초기화 콜백: 빈이 생성되고, 빈의 의존관계 주입이 완료된 후 호출  
소멸전 콜백: 빈이 소멸되기 직전에 호출  
  
* 객체의 생성과 초기화를 분리하자.  
생성자는 필수 정보(파라미터)를 받고, 메모리를 할당해서 객체를 생성하는 책임을 가진다. 반면에 초기화는 이렇게 생성된 값들을 활용해서 외부 커넥션을 연결하는등 무거운 동작을 수행한다. 따라서 생성자 안에서 무거운 초기화 작업을 함께 하는 것 보다는 객체를 생성하는 부분과 초기화 하는 부분을 명확하게 나누는 것이 유지보수 관점에서 좋다. 물론 초기화 작업이 내부 값들만 약간 변경하는 정도로 단순한 경우에는 생성자에서 한번에 다 처리하는게 더 나을 수 있다.  
  
* 스프링 빈 생명주기 콜백을 지원하는 3가지 방법  
1. 인터페이스 ( InitializingBean, DisposableBean )  
2. 설정 정보에 초기화 메소드, 종료 메소드 지정  
3. @PostConstruct, @PreDestroy 애노테이션 지원  

```java
// 2. 설정 정보에 초기화 메소드, 종료 메소드 지정

@Configuration
static class LifeCycleConfig {
  @Bean(initMethod = "init", destroyMethod = "close")
  public NetworkClient networkClient() {
    NetworkClient networkClient = new NetworkClient();
    networkClient.setUrl("http://hello-spring.dev");
    return networkClient;
  }
}
```
> NetworkClient 생성자 호출 -> networkClient.setUrl("http://hello-spring.dev"); -> NetworkClient.init() 실행 -> NetworkClient.close() 실행  
  
```java
// 3. @PostConstruct, @PreDestroy 애노테이션 지원

public class NetworkClient {

  private String url;

  public NetworkClient() {
    System.out.println("생성자 호출, url = " + url);
  }

  public void setUrl(String url) {
    this.url = url;
  }

  //서비스 시작시 호출
  public void connect() {
    System.out.println("connect: " + url);
  }

  public void call(String message) {
    System.out.println("call: " + url + " message = " + message);
  }

  //서비스 종료시 호출
  public void disConnect() {
    System.out.println("close + " + url);
  }

  @PostConstruct
  public void init() {
    System.out.println("NetworkClient.init");
    connect();
    call("초기화 연결 메시지");
  }

  @PreDestroy
  public void close() {
    System.out.println("NetworkClient.close");
    disConnect();
  }
  
}

@Configuration
static class LifeCycleConfig {
  @Bean
  public NetworkClient networkClient() {
    NetworkClient networkClient = new NetworkClient();
    networkClient.setUrl("http://hello-spring.dev");
    return networkClient;
  }
}
```
  
* @PostConstruct , @PreDestroy 어노테이션을 언제 사용할까?  
빈이 생성된 후 특정한 설정을 해야 한다거나, DB에 초기 데이터를 채워야 하는 등의 작업을 할 때 사용된다.  
빈이 소멸되기 전에 리소스를 해제하거나, 연결을 종료하는 등의 작업을 할 때 사용한다.    
  
@PostConstruct , @PreDestroy 이 두 애노테이션을 사용하면 가장 편리하게 초기화와 종료를 실행할 수 있다.  
최신 스프링에서 가장 권장하는 방법이다.  
코드를 고칠 수 없는 외부 라이브러리를 초기화, 종료해야 하면 @Bean 의 initMethod , destroyMethod 를 사용하자.  

<br/>

### 빈 스코프

* 스프링 빈  
스프링 컨테이너의 시작과 함께 생성되어서 스프링 컨테이너가 종료될 때 까지 유지된다. 이것은 스프링 빈이 기본적으로 싱글톤 스코프로 생성되기 때문이다.  
  
* 다양한 스코프  
  
1. 싱글톤 : 기본 스코프, 스프링 컨테이너의 시작과 종료까지 유지되는 가장 넓은 범위의 스코프이다.  
  
2. 프로토타입 : 스프링 컨테이너는 프로토타입 빈의 생성과 의존관계 주입까지만 관여하고 더는 관리하지 않는 매우 짧은 범위의 스코프이다.  
싱글톤 스코프의 빈을 조회하면 스프링 컨테이너는 항상 같은 인스턴스의 스프링 빈을 반환한다. 반면에 프로토타입 스코프를 스프링 컨테이너에 조회하면 스프링 컨테이너는 항상 새로운 인스턴스를 생성해서 반환한다.  
스프링 컨테이너는 프로토타입 빈을 생성하고, 의존관계 주입, 초기화까지만 처리한다는 것이다. 그래서 @PreDestroy 같은 종료 메서드가 호출되지 않는다.  
그러므로 프로토타입 빈은 프로토타입 빈을 조회한 클라이언트가 관리해야 한다. 종료 메서드에 대한 호출도 클라이언트가 직접 해야한다.  
  
3. 웹 관련 스코프  
request : 웹 요청이 들어오고 나갈때 까지 유지되는 스코프. 각각의 HTTP 요청마다 별도의 빈 인스턴스가 생성되고, 관리된다.  
session : HTTP Session과 동일한 생명주기를 가지는 스코프      
application : 서블릿 컨텍스트( ServletContext )와 동일한 생명주기를 가지는 스코프   
websocket: 웹 소켓과 동일한 생명주기를 가지는 스코프  
  
```java
public class SingletonTest {
  @Test
  public void singletonBeanFind() {
    AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(SingletonBean.class);
    SingletonBean singletonBean1 = ac.getBean(SingletonBean.class);
    SingletonBean singletonBean2 = ac.getBean(SingletonBean.class);
    System.out.println("singletonBean1 = " + singletonBean1);
    System.out.println("singletonBean2 = " + singletonBean2);
    assertThat(singletonBean1).isSameAs(singletonBean2);
    ac.close(); //종료
  }

  @Scope("singleton")
  static class SingletonBean {
    @PostConstruct
    public void init() {
      System.out.println("SingletonBean.init");
    }
    @PreDestroy
    public void destroy() {
      System.out.println("SingletonBean.destroy");
    }
  }
}
// SingletonBean.init
// singletonBean1 = hello.core.scope.PrototypeTest$SingletonBean@54504ecd
// singletonBean2 = hello.core.scope.PrototypeTest$SingletonBean@54504ecd
// org.springframework.context.annotation.AnnotationConfigApplicationContext -
// Closing SingletonBean.destroy
```

<br/>

```java
public class PrototypeTest {
  @Test
  public void prototypeBeanFind() {
    AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(PrototypeBean.class);
    System.out.println("find prototypeBean1");
    PrototypeBean prototypeBean1 = ac.getBean(PrototypeBean.class);
    System.out.println("find prototypeBean2");
    PrototypeBean prototypeBean2 = ac.getBean(PrototypeBean.class);
    System.out.println("prototypeBean1 = " + prototypeBean1);
    System.out.println("prototypeBean2 = " + prototypeBean2);
    assertThat(prototypeBean1).isNotSameAs(prototypeBean2);
    ac.close(); //종료
  }
  @Scope("prototype")
  static class PrototypeBean {
    @PostConstruct
    public void init() {
      System.out.println("PrototypeBean.init");
    }
    @PreDestroy
    public void destroy() {
      System.out.println("PrototypeBean.destroy");
    }
  }
}
// find prototypeBean1
// PrototypeBean.init
// find prototypeBean2
// PrototypeBean.init
// prototypeBean1 = hello.core.scope.PrototypeTest$PrototypeBean@13d4992d
// prototypeBean2 = hello.core.scope.PrototypeTest$PrototypeBean@302f7971
// org.springframework.context.annotation.AnnotationConfigApplicationContext - Closing
```
> 싱글톤 빈에서 프로토타입 빈 사용 시 문제점  
> 스프링은 일반적으로 싱글톤 빈을 사용하므로, 싱글톤 빈이 프로토타입 빈을 사용하게 된다. 그런데 싱글톤 빈은 생성 시점에만 의존관계 주입을 받기 때문에, 프로토타입 빈이 새로 생성되기는 하지만, 싱글톤 빈과 함께 계속 유지된다.  
  
해결 방안 ( 항상 새로운 프로토타입 빈이 생성 )  
1. ObjectProvider  
2. JSR-330 Provider  
  
* ObjectProvider  
지정한 빈을 컨테이너에서 대신 찾아주는 DL(Dependency Lookup) 서비스를 제공하는 것.  
ObjectProvider == ObjectFactory + 편의기능 추가  
  
```java
@Autowired
private ObjectProvider<PrototypeBean> prototypeBeanProvider;
public int logic() {
  PrototypeBean prototypeBean = prototypeBeanProvider.getObject();
  prototypeBean.addCount();
  int count = prototypeBean.getCount();
  return count;
}
```
prototypeBeanProvider.getObject() 을 통해서 항상 새로운 프로토타입 빈이 생성된다.  
  
* 프로토타입 빈을 언제 사용할까?  
매번 사용할 때마다 의존관계 주입이 완료된 새로운 객체가 필요할 때 사용한다.  
싱글톤 빈으로 대부분의 문제를 해결할 수 있기 때문에 프로토타입 빈을 직접적으로 사용하는 일은 매우 드물다.  
  
* 웹 스코프  
웹 스코프는 웹 환경에서만 동작한다.  
웹 스코프는 프로토타입과 다르게 스프링이 해당 스코프의 종료시점까지 관리한다. 따라서 종료 메서드가 호출된다.  
  
빈 스코프 교안 나중에 다시 정리하자.
