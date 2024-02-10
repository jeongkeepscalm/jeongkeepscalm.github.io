---
layout: post
title: spring_basic
date: 2024-02-10 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: spring.jpg # Add image post (optional)
tags: [Spring] # add tag
---


* 애자일 소프트웨어 개발 선언  
공정과 도구보다 **개인과 상호작용**을  
포괄적인 문서보다 **작동하는 소프트웨어**를   
계약 협상보다 **고객과의 협력**을   
계획을 따르기보다 **변화에 대응하기**를 가치 있게 여긴다.  

<br/>
<hr>
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
<hr>
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
<hr>
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
<hr>
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
AnnotationConfigApplicationContext 에 파라미터로 넘긴 값은 스프링 빈으로 등록된다.  
순수한 클래스는 a.b.c.AppConfig로 출력되어야 한다.  
스프링이 CGLIB라는 바이트코드 조작 라이브러리를 사용해서 AppConfig 클래스를 상속받은 임의의 다른 클래스를 만들고, 그 다른 클래스를 스프링 빈으로 등록한 것이다. 그 임의의 다른 클래스가 바로 싱글톤이 보장되도록 해준다.  
**즉, @Configuration 을 붙이면 바이트코드를 조작하는 CGLIB 기술을 사용해서 싱글톤을 보장한다.**  
스프링 설정 정보는 항상 @Configuration 을 사용하자.  
  
<br/>
<hr>
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
@Autowired : 의존관계를 자동으로 주입해준다.  
@Autowired 를 사용하면 생성자에서 여러 의존관계도 한번에 주입받을 수 있다. 생성자에 파라미터가 많아도 다 찾아서 자동으로 주입한다.  
  
* 탐색 위치와 기본 스캔 대상  
예를 들어 a.b.service , a.b.repository 이런 구조로 되어 있다면,  
a.b 프로젝트 시작 루트에 AppConfig 같은 메인 설정정보를 두고, @ComponentScan 어노테이션을 붙이고 basePackages 지정은 생략한다.  
이렇게 하면 a.b를 포함한 하위는 모두 자동으로 컴포넌트 스캔의 대상이 된다.  
  
@Component : 컴포넌트 스캔에서 사용  
@Controller : 스프링 MVC 컨트롤러로 인식  
@Service : 스프링 비즈니스 로직에서 사용  
@Repository : 스프링 데이터 접근 계층으로 인식하고, 데이터 계층의 예외를 스프링 예외로 변환해준다.  
@Configuration : 스프링 설정 정보에서 사용하고 스프링 빈이 싱글톤을 유지하도록 추가 처리
를 한다.  
  
<br/>
<hr>
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
  
* final 키워드
필드에 final 키워드를 붙여 생성자 주입을 한다.  
수정자 주입을 포함한 나머지 주입 방식은 모두 생성자 이후에 호출되므로, 필드에 final 키워드를 사용 할 수 없다. 오직 생성자 주입 방식만 final 키워드를 사용할 수 있다.  

롬복과 최신 트랜드 부터






































