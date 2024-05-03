---
title: "[KYH] Spring MVC 1"
description: "[KYH] Spring MVC 1"
date: 2024-05-02
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

## Servlet 이란?

설정된 URL과 매핑시켜 클라이언트의 요청에 대한 응답을 할 수 있다. 

#### Servlet 등록

- @ServletComponentScan: 등록된 서블릿을 찾는다.    
- @WebServlet(name = "hello", urlPatterns = "/test"): 서블릿 이름과 URL을 설정하여 서블릿 등록.  
  해당 객체는 HttpServlet 를 상속받아 service 메소드를 override 하여 비지니스 로직을 구현한다. 
  
<img src="/assets/img/innerTomcat.png" width="600px">  
  
<img src="/assets/img/wasResReq.png" width="600px">  
  
### HttpServletRequest 역할

1. 서블릿은 HTTP 메시지를 편리하게 사용할 수 있도록 HTTP 요청 메시지를 파싱하여 그 결과를 HttpServletRequest 객체에 담아서 제공한다.  
2. HTTP 요청이 끝날 때 까지 유지되는 임시저장소 기능을 제공한다.  
  - request.setAttribute(name, value)  
  - request.getAttribute(name)
3. 세션 관리 기능  
  - request.getSession(create: true)  
  
```HttpServletRequest, HttpServletResponse```: **HTTP 요청/응답 메시지를 편리하게 사용하도록 도와주는 객체이다.**  
  

- HttpServletRequest 내 HTTP 메시지의 start_line, header 정보 출력
```java
@WebServlet(name = "requestHeaderServlet", urlPatterns = "/request-header")
public class RequestHeaderServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

        printStartLine(req);
        printHeaders(req);
        printHeaderUtils(req);
        printEtc(req);

        res.getWriter().write("ok");

    }

    // Start-Line 정보 조회
    private void printStartLine(HttpServletRequest request) {

        System.out.println("--- REQUEST-LINE - start ---");
        System.out.println("request.getMethod() = " + request.getMethod()); // GET
        System.out.println("request.getProtocol() = " + request.getProtocol()); // HTTP/1.1
        System.out.println("request.getScheme() = " + request.getScheme()); // http
        System.out.println("request.getRequestURL() = " + request.getRequestURL());// http://localhost:8080/request-header
        System.out.println("request.getRequestURI() = " + request.getRequestURI());// request-header
        System.out.println("request.getQueryString() = " + request.getQueryString());
        System.out.println("request.isSecure() = " + request.isSecure()); // false: https 사용 유무
        System.out.println("--- REQUEST-LINE - end ---");
        System.out.println();

    }

    // Header 모든 정보 조회
    private void printHeaders(HttpServletRequest request) {

        System.out.println("--- Headers - start ---");
        /**
             Enumeration<String> headerNames = request.getHeaderNames();
             while (headerNames.hasMoreElements()) {
                 String headerName = headerNames.nextElement();
                 System.out.println(headerName + ": " + request.getHeader(headerName));
             };
        */

        request.getHeaderNames().asIterator()
                .forEachRemaining(headerName -> System.out.println(headerName + ": " + request.getHeader(headerName)));
        System.out.println("--- Headers - end ---");
        System.out.println();

    }

    // Header 편리한 조회
    private void printHeaderUtils(HttpServletRequest request) {
        System.out.println("--- Header 편의 조회 start ---");

        System.out.println("[Host 편의 조회]");
        System.out.println("request.getServerName() = " + request.getServerName()); // localhost
        System.out.println("request.getServerPort() = " + request.getServerPort()); // 8080
        System.out.println();

        System.out.println("[Accept-Language 편의 조회]");
        request.getLocales().asIterator()
                .forEachRemaining(locale -> System.out.println("locale = " + locale));
        System.out.println("request.getLocale() = " + request.getLocale());
        System.out.println();

        System.out.println("[cookie 편의 조회]");
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                System.out.println(cookie.getName() + ": " + cookie.getValue());
            }
        }
        System.out.println();

        System.out.println("[Content 편의 조회]");
        System.out.println("request.getContentType() = " + request.getContentType()); // null
        System.out.println("request.getContentLength() = " + request.getContentLength()); // -1
        System.out.println("request.getCharacterEncoding() = " + request.getCharacterEncoding()); // UTF-8
        System.out.println("--- Header 편의 조회 end ---");
        System.out.println();
    }

    //기타 정보
    private void printEtc(HttpServletRequest request) {

        System.out.println("--- 기타 조회 start ---");
        System.out.println("[Remote 정보]");
        System.out.println("request.getRemoteHost() = " + request.getRemoteHost()); // 0:0:0:0:0:0:0:1
        System.out.println("request.getRemoteAddr() = " + request.getRemoteAddr()); // 0:0:0:0:0:0:0:1
        System.out.println("request.getRemotePort() = " + request.getRemotePort()); //
        System.out.println();

        System.out.println("[Local 정보]");
        System.out.println("request.getLocalName() = " + request.getLocalName()); // 0:0:0:0:0:0:0:1
        System.out.println("request.getLocalAddr() = " + request.getLocalAddr()); // 0:0:0:0:0:0:0:1
        System.out.println("request.getLocalPort() = " + request.getLocalPort()); // 8080
        System.out.println("--- 기타 조회 end ---");
        System.out.println();

    }
}
```

## HTTP 요청 데이터

```HTTP 요청 메시지```: 클라이언트에서 서버로 데이터를 전달할 때 사용.  

HTTP 요청 메시지 전달하는 3가지 방법  
1. GET(쿼리 파라미터)
  - URL의 쿼리 파라미터에 데이터를 포함해서 전달한다. 
  - 메시지 바디 x 
  - 예) 검색, 페이징, 필터 등..
2. POST(HTML Form)
  - content-type: application/x-www-form-urlencoded
  - 메시지 바디에 쿼리 파라미터 형식으로 전달.
  - 예) 회원 가입, 상품 주문 등..
3. HTTP 메시지 바디  
  - HTTP API 에서 주로 사용, JSON, XML, TEXT
  
### GET 쿼리 파라미터

- 쿼리 파라미터 조회 메소드  
```java
String username = request.getParameter("username"); // 단일 파라미터 조회
Enumeration<String> parameterNames = request.getParameterNames(); // 파라미터 이름들 모두 조회
  parameterNames.asIterator().forEachRemaining(v -> {})
Map<String, String[]> parameterMap = request.getParameterMap(); // 파라미터를 Map으로 조회
String[] usernames = request.getParameterValues("username"); // 복수 파라미터 조회
```
> 파라미터 이름이 중복일 때 request.getParameter() 를 사용하면 request.getParameterValues() 의 첫
번째 값을 반환한다.  

### Post HTML Form

- POST 방식으로 HTML Form 전송 시 생성되는 HTTP Message
  요청 URL: http://localhost:8080/request-param  
  content-type: application/x-www-form-urlencoded  
  message body: username=hello&age=20  
  
- application/x-www-form-urlencoded 형식은 GET방식의 쿼리파라미터 형식과 같기에, HttpServletRequest 내 파라미터 조회 메소드를 그대로 사용하면 된다.  
  => request.getParameter() 는 GET URL 쿼리 파라미터 형식도 지원하고, POST HTML Form 형식도 둘 다 지원한다.  

### API 메시지 바디

HTTP Message Body에 직접 데이터를 담아 요청한다.  
HTTP API에서 주로 사용하며, JSON, XML, TEXT 형식이고 주로 ```JSON```을 사용한다.   

```java
@WebServlet(name = "requestBodyJsonServlet", urlPatterns = "/request-body-json")
public class RequestBodyJsonServlet extends HttpServlet {

  private ObjectMapper objectMapper = new ObjectMapper();

  @Override
  protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    ServletInputStream inputStream = request.getInputStream(); // inputStream 은 byte 코드를 반환
    String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8); // byte -> UTF_8

    System.out.println("messageBody = " + messageBody); // 클라이언트에서 메시지 바디를 통해 서버로 데이터를 넘김.

    HelloData helloData = objectMapper.readValue(messageBody, HelloData.class); 
    System.out.println("helloData.username = " + helloData.getUserName());
    System.out.println("helloData.age = " + helloData.getAge());
    response.getWriter().write("ok");

  }

}
```
> Jackson, Gson: JSON 변환 라이브러리    
> Spring Boot 는 기본으로 Jackson(ObjectMapper) 라이브러리를 제공한다.  
> ObjectMapper.readValue(String, Object): Json 형식의 데이터를 읽어 특정 객체로 반환한다.  

### HttpServletResponse 역할

1. HTTP 응답 메시지 생성  
  - HTTP 응답코드 지정
  - 헤더 생성
  - 바디 생성
2. 편의 기능 제공
  - Content-Type, 쿠키, Redirect  
  
```java
@WebServlet(name = "responseHeaderServlet", urlPatterns = "/response-header")
public class ResponseHeaderServlet extends HttpServlet {
  @Override
  protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    // [status-line]: 응답코드 지정
    response.setStatus(HttpServletResponse.SC_OK); // 200

    // [response-headers]: 헤더 설정
    response.setHeader("Content-Type", "text/plain;charset=utf-8");
    response.setHeader("Cache-Control", "no-cache, no-store, mustrevalidate");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("my-header","hello");

    //[Header 편의 메서드]
    content(response); // SET 컨텐츠 속성
    cookie(response); // 쿠키 생성 후 추가.
    redirect(response); // 리다이렉트 기능

    //[message body]
    PrintWriter writer = response.getWriter();
    writer.println("ok");
  }

  private void content(HttpServletResponse response) {

    //Content-Type: text/plain;charset=utf-8
    //Content-Length: 2
    //response.setHeader("Content-Type", "text/plain;charset=utf-8");
    response.setContentType("text/plain");
    response.setCharacterEncoding("utf-8");
    //response.setContentLength(2); // (생략시 자동 생성)

  }

  private void cookie(HttpServletResponse response) {
    //Set-Cookie: myCookie=good; Max-Age=600;
    //response.setHeader("Set-Cookie", "myCookie=good; Max-Age=600");
    Cookie cookie = new Cookie("myCookie", "good");
    cookie.setMaxAge(600); // 600초
    response.addCookie(cookie);
  }

  private void redirect(HttpServletResponse response) throws IOException {
    //Status Code 302
    //Location: /basic/hello-form.html
    //response.setStatus(HttpServletResponse.SC_FOUND); //302
    //response.setHeader("Location", "/basic/hello-form.html");
    response.sendRedirect("/basic/hello-form.html");
  }
  
}
```

### HttpServletResponse - HTML 응답

```java
@WebServlet(name = "responseHtmlServlet", urlPatterns = "/response-html")
public class ResponseHtmlServlet extends HttpServlet {
  @Override
  protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    //Content-Type: text/html;charset=utf-8
    response.setContentType("text/html");
    response.setCharacterEncoding("utf-8");

    PrintWriter writer = response.getWriter();
    writer.println("<html>");
    writer.println("<body>");
    writer.println(" <div>안녕?</div>");
    writer.println("</body>");
    writer.println("</html>");
  }
  
}
```

### HttpServletResponse - JSON 응답

```java
@WebServlet(name = "responseJsonServlet", urlPatterns = "/response-json")
public class ResponseJsonServlet extends HttpServlet {
  private ObjectMapper objectMapper = new ObjectMapper();
  @Override
  protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    //Content-Type: application/json
    response.setHeader("content-type", "application/json");
    response.setCharacterEncoding("utf-8");

    HelloData data = new HelloData();
    data.setUserName("kim");
    data.setAge(20);

    //{"username":"kim","age":20}
    String result = objectMapper.writeValueAsString(data);
    response.getWriter().write(result);
  }
  
}
```
> HTTP 응답으로 JSON을 반환할 때는 content-type을 application/json 로 지정해야 한다.  
> objectMapper.writeValueAsString(): 객체를 JSON 문자로 변환  

## 서블릿으로 웹 애플리케이션 만들기

참고링크: <https://github.com/jeongkeepscalm/KYH_SpringMVC_1/tree/master/src/main/java/hello/servlet/web/servlet>  
  
### 템플릿 엔진이란?

HTML과 데이터를 결합하여 최종적으로 사용자에게 보여질 뷰를 생성(VIEW 렌더링 최적화)  
HTML 문서에서 필요한 곳만 코드를 적용해서 동적으로 변경할 수 있는 기능을 제공한다.  
(JSP, Thymleaf, Freemarker, Velocity 등..)  

### 템플릿 엔진이 나온 이유 (서블릿의 단점)

서블릿과 자바 코드만으로 HTML을 만들 수 있지만 매우 복잡하고 비효율적일 뿐더러, 동적 HTML 문서를 만들 수는 없다.  

## JSP

```jsp

<!-- save.jsp -->
<%@ page import="hello.servlet.domain.member.MemberRepository" %>
<%@ page import="hello.servlet.domain.member.Member" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
  // request, response 사용 가능
  MemberRepository memberRepository = MemberRepository.getInstance();
  System.out.println("save.jsp");
  String username = request.getParameter("username");
  int age = Integer.parseInt(request.getParameter("age"));
  Member member = new Member(username, age);
  System.out.println("member = " + member);
  memberRepository.save(member);
%>
<html>
<head>
  <meta charset="UTF-8">
  </head>
<body>
  성공
  <ul>
  <li>id=<%=member.getId()%></li>
  <li>username=<%=member.getUsername()%></li>
  <li>age=<%=member.getAge()%></li>
  </ul>
  <a href="/index.html">메인</a>
</body>
</html>

<!-- members.jsp -->
<%@ page import="java.util.List" %>
<%@ page import="hello.servlet.domain.member.MemberRepository" %>
<%@ page import="hello.servlet.domain.member.Member" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
  MemberRepository memberRepository = MemberRepository.getInstance();
  List<Member> members = memberRepository.findAll();
%>
<html>
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
  <a href="/index.html">메인</a>
  <table>
    <thead>
      <th>id</th>
      <th>username</th>
      <th>age</th>
    </thead>
    <tbody>
      <%
        for (Member member : members) {
        out.write(" <tr>");
        out.write(" <td>" + member.getId() + "</td>");
        out.write(" <td>" + member.getUsername() + "</td>");
        out.write(" <td>" + member.getAge() + "</td>");
        out.write(" </tr>");
        }
      %>
    </tbody>
  </table>
</body>
</html>
```
> <%@ page contentType="text/html;charset=UTF-8" language="java" %>: 첫 줄은 ```JSP문서```라는 뜻이다. JSP 문서는 이렇게 시작해야 한다.  
> ```JSP는 서버 내부에서 서블릿으로 변환된다.```  
> <% ~~ %>: 자바 코드 입력 가능  
> <%= ~~ %>: 자바 코드 출력 가능  
  
### 서블릿과 JSP의 한계

- ```서블릿의 한계```  
  - 뷰(View)화면을 위한 HTML을 만드는 작업이 자바 코드에 섞여서 지저분하고 복잡하다.  

- ```JSP의 한계```
  - 비지니스 로직과 뷰 영역이 한 화면에 공존하여 복잡하며 유지보수하기가 어렵다.  
  
## MVC 패턴  

- 비즈니스 로직 처리와 뷰 렌더링의 역할을 Controller 와 View 영역으로 나눈다.  
  (JSP 같은 뷰 템플릿은 화면을 렌더링하는데 최적화 되어 있어 해당 업무만 담당하는 것이 효과적이다.)  
- ```컨트롤러```: HTTP 요청을 받아서 파라미터를 검증하고, 비즈니스 로직을 실행한다. 그리고 뷰에 전달할 결과 데이터를
조회해서 모델에 담는다.  
- ```모델```: 뷰에 출력할 데이터를 담아둔다. 뷰가 필요한 데이터를 모두 모델에 담아서 전달해주는 덕분에 뷰는 비즈니스 로
직이나 데이터 접근을 몰라도 되고, 화면을 렌더링 하는 일에 집중할 수 있다.  
- ```뷰```: 모델에 담겨있는 데이터를 사용해서 화면을 그리는 일에 집중한다. 여기서는 HTML을 생성하는 부분을 말한다.  
  
<img src="/assets/img/mvcPattern.png" width="600px">  
  
## MVC Pattern 적용

- Model은 HttpServletRequest 객체를 사용한다.  

```java
@WebServlet(name = "mvcMemberFormServlet", urlPatterns = "/servlet-mvc/members/ new-form")
public class MvcMemberFormServlet extends HttpServlet {
  @Override
  protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String viewPath = "/WEB-INF/views/new-form.jsp";
    RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
    dispatcher.forward(request, response);
  }
}
```
> dispatcher.forward(): 다른 서블릿이나 JSP로 이동할 수 있는 기능이다. 서버 내부에서 다시 호출이 발생한다.  
> /WEB-INF: 이 경로안에 JSP가 있으면 외부에서 직접 JSP를 호출할 수 없다. 우리가 기대하는 것은 항상 컨트롤러를 통해서 JSP를 호출하는 것이다.  
  
### redirect vs forward

> 리다이렉트는 실제 클라이언트(웹 브라우저)에 응답이 나갔다가, 클라이언트가 redirect 경로로 다시 요청한다. 따라서 클라이언트가 인지할 수 있고, URL 경로도 실제로 변경된다.  
> 반면에 포워드는 서버 내부에서 일어나는 호출이기 때문에 클라이언트가 전혀 인지하지 못한다.  
  
  
```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:forEach var="item" items="${members}">
  <tr>
    <td>${item.id}</td>
    <td>${item.username}</td>
    <td>${item.age}</td>
  </tr>
</c:forEach>

<ul>
  <li>id=${member.id}</li>
  <li>username=${member.username}</li>
  <li>age=${member.age}</li>
</ul>
```
> taglib 사용 (<c:forEach>)  
> ${}: JSP는 해당 문법을 제공하는데, 이 문법을 사용하면 request의 attribute에 담긴 데이터를 편리하게 조회 가능하다.  
  
## Front Controller

- 컨트롤러 호출 전에 먼저 공통 기능을 처리한다.  
