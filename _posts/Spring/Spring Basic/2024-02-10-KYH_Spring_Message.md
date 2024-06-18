---
title: "[KYH] Spring Message"
description: Spring Message
date: 2024-06-18
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

# 메시지 관리 기능 사용

```java
@Bean
public MessageSource messageSource() {
  ResourceBundleMessageSource ms = new ResourceBundleMessageSource();
  ms.setBasenames("messages", "errors");
  ms.setDefaultEncoding("utf-8");
  return ms;
}
```
> `basenames`  
>   설정 파일 이름 지정  
>   messages로 지정하면, messages.properties 파일을 읽어 사용  
>   파일 위치: **/resources/messages.properties**  
>   여러 파일을 한번에 지정 가능(ms.setBasenames("messages", "errors");)  

<br/>

- 스프링 부트는 MessageSource를 자동으로 스프링 빈으로 등록한다.  
- 스프링 부트 메시지 소스 설정
  - application.properties
  - **spring.messages.basename=messages,config.i18n.messages**
- 스프링 부트 메시지 소스 기본 값
  - spring.messages.basename=messages
  - 기본값이 messages이므로 messages_en.properties, messages_kr.properties, messages.properties 파일을 등록하면 자동으로 인식한다.  

<br/>
<hr>

# Message Source Test

```properties
# messages.properties
hello=안녕
hello.name=안녕 {0}

# messages_en.properties
hello=hello
hello.name=hello {0}
```

```java
@SpringBootTest
public class MessageSourceTest {

  @Autowired
  MessageSource ms;

  @Test
  void helloMessage() {
    /* locale 정보가 없으면 basename 에서 설정한 기본 이름 메시지 파일을 조회 */
    String result = ms.getMessage("hello", null, null);
    Assertions.assertThat(result).isEqualTo("안녕");
  }

  @Test
  void helloMessageArgs() {
    /* 매개변수 사용 */
    String result = ms.getMessage("hello.name", new Object[]{new String("김춘배")}, null);
    Assertions.assertThat(result).isEqualTo("안녕 김춘배");
  }

  @Test
  void notFoundMessageCode() {
    /* 메시지가 없는 경우 NoSuchMessageException 발생 */
    Assertions.assertThatThrownBy(() -> ms.getMessage("no_code", null, null))
            .isInstanceOf(NoSuchMessageException.class);
  }

  @Test
  void notFoundMessageCodeDefaultMessage() {
    /* 지정된 메시지가 없어도 기본 메시지를 설정하여 활용 가능 */
    String result = ms.getMessage("no_code", null, "Default Message :::", null);
    Assertions.assertThat(result).isEqualTo("Default Message :::");
  }

   @Test
  void defaultLanguage() {
    /*
    * locale 정보가 없음(null)
    *   -> 시스템 기본 locale이 ko_KR 이므로 messages_ko.properties 조회
    *   -> 조회 실패
    *   -> messages.properties
    * */
    Assertions.assertThat(ms.getMessage("hello", null, null)).isEqualTo("안녕");

    /* locale 정보가 있지만, message_ko 가 없으므로 messages 를 사용 */
    Assertions.assertThat(ms.getMessage("hello", null, Locale.KOREA)).isEqualTo("안녕");
  }

  @Test
  void EnglishLanguage() {
    Assertions.assertThat(ms.getMessage("hello", null, Locale.ENGLISH)).isEqualTo("hello");
  }

}
```

<br/>
<hr>

# Thymeleaf Message 적용: #{...}

- 렌더링 전  
  - <code><div th:text="#{label.item}"></h2></code>  
- 렌더링 후  
  - <code><div>상품</h2></code>  
  
- 파라미터 추가
  - hello.name=안녕 {0}
  - <p th:text="#{hello.name(${item.itemName})}"></p>

<br/>
<hr> 

# 웹 브라우저의 언어 설정 값을 변경

- 크롬 브라우저 → 설정 → 언어 변경
  -  HTTP 요청 헤더 내 Accept-Language 속성의 값이 변경된다.

<br/>
<hr>

# LocaleResolver

- 스프링은 Locale 선택 방식 변경할 수 있도록 LocaleResolver 인터페이스 제공
- 스프링 부트는 AcceptHeaderLocaleResolver 인터페이스를 사용해서 Accept-Language를 활용한다.

```java
public interface LocaleResolver {

  Locale resolveLocale(HttpServletRequest request);

  void setLocale(HttpServletRequest request
    , @Nullable HttpServletResponseresponse
    , @Nullable Locale locale);
    
}
```