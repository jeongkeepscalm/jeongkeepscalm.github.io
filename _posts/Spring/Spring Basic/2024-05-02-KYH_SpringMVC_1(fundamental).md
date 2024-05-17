---
title: "[KYH] Spring MVC 1 (fundamental)"
description: "[KYH] Spring MVC 1 (fundamental)"
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
  
<details>
<summary><span style="color:yellow" class="point"><b>HttpServletRequest 내 HTTP 메시지의 start_line, header 정보 출력</b></span></summary>
<div markdown="1"> 

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

</div>
</details>

<br/>
<hr>

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

<details>
<summary><span style="color:yellow" class="point"><b>Content-Type, 쿠키, Redirect</b></span></summary>
<div markdown="1">      

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

</div>
</details>

### HttpServletResponse

<details>
<summary><span style="color:yellow" class="point"><b>HTML 응답</b></span></summary>
<div markdown="1">      

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

</div>
</details>

### HttpServletResponse

<details>
<summary><span style="color:yellow" class="point"><b>JSON 응답</b></span></summary>
<div markdown="1">      

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

</div>
</details>

<br/>
<hr>

## 서블릿으로 웹 애플리케이션 만들기

참고링크: <https://github.com/jeongkeepscalm/KYH_SpringMVC_1/tree/master/src/main/java/hello/servlet/web/servlet>  
  
### 템플릿 엔진이란?

HTML과 데이터를 결합하여 최종적으로 사용자에게 보여질 뷰를 생성(VIEW 렌더링 최적화)  
HTML 문서에서 필요한 곳만 코드를 적용해서 동적으로 변경할 수 있는 기능을 제공한다.  
(JSP, Thymleaf, Freemarker, Velocity 등..)  

### 템플릿 엔진이 나온 이유 (서블릿의 단점)

서블릿과 자바 코드만으로 HTML을 만들 수 있지만 매우 복잡하고 비효율적일 뿐더러, 동적 HTML 문서를 만들 수는 없다.  

### 서블릿과 JSP의 한계

- ```서블릿의 한계```  
  - 뷰(View)화면을 위한 HTML을 만드는 작업이 자바 코드에 섞여서 지저분하고 복잡하다.  

- ```JSP의 한계```
  - 비지니스 로직과 뷰 영역이 한 화면에 공존하여 복잡하며 유지보수하기가 어렵다.  

<br/>
<hr>

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

<br/>
<hr>

## MVC 프레임워크 만들기  

#### FrontController

<img src="/assets/img/frontController1.png" width="600px">  
  
<img src="/assets/img/frontController2.png" width="600px">  
  
- FrontController 패턴 특징  
  이전에는 여러 서블릿으로 클라이언트의 요청을 받았다면, 프론트 컨트롤러 서블릿 하나로 클라이언트의 요청을 받는다.  
  프론트 컨트롤러가 요청에 맞는 컨트롤러를 찾아서 호출한다.  
  공통 처리 가능하다.  
  프론트 컨트롤러를 제외한 나머지 컨트롤러는 서블릿을 사용하지 않아도 된다.  
  
- 스프링 웹 MVC와 프론트 컨트롤러
  스프링 웹 MVC의 ```DispatcherServlet``` 이 ```FrontController 패턴```으로 구현되어 있다.  
  
<img src="/assets/img/v5.png" width="600px">  
  
> 어댑터 패턴을 사용해서 프론트 컨트롤러가 다양한 방식의 컨트롤러를 처리할 수 있도록 한다.  
> 어댑터 패턴을 사용하여 V3방식 / V4방식을 선택하여 사용할 수 있게 한다.   
  
<details>
<summary><span style="color:yellow" class="point"><b>MVC Pattern V5</b></span></summary>
<div markdown="1">  

```java
public class ModelView {

  private String viewName;
  private Map<String, Object> model = new HashMap<>();

  public ModelView(String viewName) {
    this.viewName = viewName;
  }

  public String getViewName() {
    return viewName;
  }

  public void setViewName(String viewName) {
    this.viewName = viewName;
  }

  public Map<String, Object> getModel() {
    return model;
  }

  public void setModel(Map<String, Object> model) {
    this.model = model;
  }

}
```

<br/>

```java
public class MyView {

  private String viewPath;

  public MyView(String viewPath) {
    this.viewPath = viewPath;
  }

  public void render(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
    dispatcher.forward(request, response);
  }

  public void render(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    modelToRequestAttribute(model, request);
    RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
    dispatcher.forward(request, response);

  }
  private void modelToRequestAttribute(Map<String, Object> model, HttpServletRequest request) {
    model.forEach((key, value) -> request.setAttribute(key, value));
  }

}
```

<br/>

```java
public interface MyHandlerAdapter {
  boolean supports(Object handler);
  ModelView handle(HttpServletResponse request, HttpServletResponse response, Object handler) throws ServletException, IOException;
}
```
> ```boolean supports(Object handler)```  
> handler는 컨트롤러를 의미한다.   
> 어댑터가 해당 컨트롤러를 처리할 수 있는지 판단하는 메소드이다.  
> ```ModelView handle(HttpServletRequest request, HttpServletResponse response, Object handler)```  
> 어댑터는 실제 컨트롤러를 호출하고 그 결과로 ModelView 를 반환한다.  
> 실제 컨트롤러가 ModelView를 반환하지 못하면, 어댑터가 ModelView를 직접 생성해서라도 반환해야 한다.  
> 이전에는 프론트 컨트롤러가 실제 컨트롤러를 호출했지만 이제는 이 어댑터를 통해서 실제 컨트롤러가 호출된다.  
  
<br/>

```java
public class ControllerV3HandlerAdapter implements MyHandlerAdapter {

  /**
   * supports: 컨트롤러를 처리하는 어뎁터
   */
  @Override
  public boolean supports(Object handler) {
    return (handler instanceof ControllerV3);
  }

  @Override
  public ModelView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws ServletException, IOException {
    ControllerV3 controller = (ControllerV3) handler;
    Map<String, String> paramMap = createParamMap(request);
    ModelView mv = controller.process(paramMap);
    return mv;
  }

  private Map<String, String> createParamMap(HttpServletRequest request) {
    Map<String, String> paramMap = new HashMap<>();
    request.getParameterNames().asIterator().forEachRemaining(v -> paramMap.put(v, request.getParameter(v)));
    return paramMap;
  }

}
```

<br/>

```java
public class ControllerV4HandlerAdapter implements MyHandlerAdapter {

  /**
   * supports(): handler 가 ControllerV4 인 경우에만 처리하는 어댑터
   */
  @Override
  public boolean supports(Object handler) {
    return (handler instanceof ControllerV4);
  }
  @Override
  public ModelView handle(HttpServletRequest request, HttpServletResponse response, Object handler) {

    /**
     * handler 를 ControllerV4로 캐스팅 하고, paramMap, model 을 만들어서 해당 컨트롤러를 호출
     * viewName 반환
     */
    ControllerV4 controller = (ControllerV4) handler;
    Map<String, String> paramMap = createParamMap(request);
    Map<String, Object> model = new HashMap<>();
    String viewName = controller.process(paramMap, model);

    // 어댑터 변환
    ModelView mv = new ModelView(viewName);
    mv.setModel(model);
    return mv;

  }

  private Map<String, String> createParamMap(HttpServletRequest request) {
    Map<String, String> paramMap = new HashMap<>();
    request.getParameterNames().asIterator().forEachRemaining(v -> paramMap.put(v, request.getParameter(v)));
    return paramMap;
  }

}
```

<br/>

```java
@WebServlet(name = "frontControllerServletV5", urlPatterns = "/front-controller/v5/*")
public class FrontControllerServletV5 extends HttpServlet {

  // 매핑 정보의 값이 ControllerV3 , ControllerV4 같은 인터페이스에서 아무 값이나 받을 수 있는 Object 로 변경
  private final Map<String, Object> handlerMappingMap = new HashMap<>();

  private final List<MyHandlerAdapter> handlerAdapters = new ArrayList<>();
  public FrontControllerServletV5() {
    initHandlerMappingMap();    // 핸들러 매핑 초기화
    initHandlerAdapters();      // 어댑터 초기화
  }
  private void initHandlerMappingMap() {
    // V3
    handlerMappingMap.put("/front-controller/v5/v3/members/new-form", new MemberFormControllerV3());
    handlerMappingMap.put("/front-controller/v5/v3/members/save", new MemberSaveControllerV3());
    handlerMappingMap.put("/front-controller/v5/v3/members", new MemberListControllerV3());

    // V4 추가
    handlerMappingMap.put("/front-controller/v5/v4/members/new-form", new MemberFormControllerV4());
    handlerMappingMap.put("/front-controller/v5/v4/members/save", new MemberSaveControllerV4());
    handlerMappingMap.put("/front-controller/v5/v4/members", new MemberListControllerV4());
  }

  private void initHandlerAdapters() {
    handlerAdapters.add(new ControllerV3HandlerAdapter());
    handlerAdapters.add(new ControllerV4HandlerAdapter()); // V4 추가
  }

  @Override
  protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    // 핸들러 매핑( handler: MemberFormControllerV3 || MemberSaveControllerV3 || MemberListControllerV3 )
    Object handler = getHandler(request);

    if (handler == null) {
      response.setStatus(HttpServletResponse.SC_NOT_FOUND);
      return;
    }

    MyHandlerAdapter adapter = getHandlerAdapter(handler); // ControllerV3HandlerAdapter 반환
    ModelView mv = adapter.handle(request, response, handler); // 어댑터 호출
    MyView view = viewResolver(mv.getViewName());
    view.render(mv.getModel(), request, response);

  }

  // 핸들러 매핑
  private Object getHandler(HttpServletRequest request) {
    String requestURI = request.getRequestURI();
    return handlerMappingMap.get(requestURI);
  }

  // 핸들러를 처리할 수 있는 어댑터 조회
  private MyHandlerAdapter getHandlerAdapter(Object handler) {
    for (MyHandlerAdapter adapter : handlerAdapters) {
      if (adapter.supports(handler)) {
        return adapter;
      }
    }
    throw new IllegalArgumentException("handler adapter를 찾을 수 없습니다. handler=" + handler);
  }

  private MyView viewResolver(String viewName) {
    return new MyView("/WEB-INF/views/" + viewName + ".jsp");
  }

}
```

</div>
</details>
  
정리  
- v1: 프론트 컨트롤러를 도입  
  기존 구조를 최대한 유지하면서 프론트 컨트롤러를 도입  
- v2: View 분류  
  단순 반복 되는 뷰 로직 분리  
- v3: Model 추가  
  서블릿 종속성 제거  
  뷰 이름 중복 제거  
- v4: 단순하고 실용적인 컨트롤러  
  v3와 거의 비슷  
  구현 입장에서 ModelView를 직접 생성해서 반환하지 않도록 편리한 인터페이스 제공  
- v5: 유연한 컨트롤러  
  어댑터 도입  
  어댑터를 추가해서 프레임워크를 유연하고 확장성 있게 설계  
  
참고 링크 : <https://github.com/jeongkeepscalm/KYH_SpringMVC_1/tree/master/src/main/java/hello/servlet/web/frontController>  

<br/>
<hr>

## Spring MVC

<img src="/assets/img/springMVC1.png" width="600px">  

<br/>

<img src="/assets/img/springMVC2.png" width="600px">  

<br/>

> 직접 만든 프레임워크 ->   스프링 MVC 비교  
> FrontController ->      DispatcherServlet  
> handlerMappingMap ->    HandlerMapping  
> MyHandlerAdapter ->     HandlerAdapter  
> ModelView ->            ModelAndView  
> viewResolver ->         ViewResolver  
> MyView ->               View  
  
**- 스프링 MVC의 핵심: 디스패쳐 서블릿(Front Controller)**  
  DispatcherServlet 도 부모 클래스에서 HttpServlet 을 상속 받아서 사용하고, 서블릿으로 동작한다.  
  ( DispatcherServlet > FrameworkServlet > HttpServletBean > HttpServlet )  
  스프링 부트는 DispatcherServlet을 서블릿으로 자동으로 등록하면서 모든 경로(urlPatterns="/")에 대하여 매핑힌다.  
  모든 클라이언트의 요청을 받아 요청에 맞은 컨트롤러를 찾아 호출한다.  
  
- 요청 흐름  
  1. 서블릿이 호출되면 HttpServlet 이 제공하는 service() 가 호출된다. 
  2. 스프링 MVC는 DispatcherServlet 의 부모인 FrameworkServlet 에서 service()를 오버라이드 해뒀다. 
  3. FrameworkServlet.service() 를 시작으로 여러 메소드가 호출되면서 DispatcherServlet.doDispatch()가 호출된다.  
  
<details>
<summary><span style="color:yellow" class="point"><b>DispatcherServlet.doDispatch()</b></span></summary>
<div markdown="1">      

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {

  HttpServletRequest processedRequest = request;
  HandlerExecutionChain mappedHandler = null;
  ModelAndView mv = null;

  // 1. 핸들러 조회
  mappedHandler = getHandler(processedRequest);
  if (mappedHandler == null) {
    noHandlerFound(processedRequest, response);
    return;
  }

  // 2. 핸들러 어댑터 조회 - 핸들러를 처리할 수 있는 어댑터
  HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

  // 3. 핸들러 어댑터 실행 -> 4. 핸들러 어댑터를 통해 핸들러 실행 -> 5. ModelAndView 반환
  mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
  processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);

}

private void processDispatchResult(HttpServletRequest request, HttpServletResponse response, HandlerExecutionChain mappedHandler, ModelAndView mv, Exception exception) throws Exception {
  // 뷰 렌더링 호출
  render(mv, request, response);
}

protected void render(ModelAndView mv, HttpServletRequest request, HttpServletResponse response) throws Exception {

  View view;

  String viewName = mv.getViewName();

  // 6. 뷰 리졸버를 통해서 뷰 찾기, 7. View 반환
  view = resolveViewName(viewName, mv.getModelInternal(), locale, request);

  // 8. 뷰 렌더링
  view.render(mv.getModelInternal(), request, response);

}
```

</div>
</details>
  
- 동작 순서  
  1. ```핸들러 조회```: ```HandlerAdapter```를 통해 URL에 매핑된 핸들러(컨트롤러)를 조회
  2. ```HandlerAdapter 조회```: 핸들러를 실행할 수 있는 핸들러 어댑터를 조회
  3. ```HandlerAdapter 실행```
  4. ```핸들러 실행```: 핸들러 어댑터가 실제 핸들러를 실행
  5. ```ModelAndView 반환```: 핸들러 어댑터는 핸들러가 반환하는 정보를 ModelAndView로 변환해서 반환
  6. ```viewResolver 호출```: 뷰 리졸버를 찾고 실행
  7. ```View 반환```: 뷰 리졸버는 뷰의 논리 이름을 물리 이름으로 바꾸고, 렌더링 역할을 담당하는 뷰 객체를 반환
  8. ```뷰 렌더링```: 뷰를 통해서 뷰를 렌더링한다.  

- 요청 흐름정리  
요청  
-> FrameworkServlet.service() 호출( HttpServlet.service() )  
-> DispatcherServlet.doDispatch()이 호출됨  
-> 핸들러 조회 -> 핸들러 어댑터 조회 -> 핸들러 어댑터 실행 -> 핸들러 실행 -> ModelAndView 반환 -> viewResolver 호출 -> View 반환 -> 뷰 렌더링  
  
### HttpRequestHandler
  
HttpRequestHandler: 서블릿과 가장 유사한 형태의 핸들러  

```java
public interface HttpRequestHandler {
  void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException;
}

@Component("/springmvc/request-handler")
public class MyHttpRequestHandler implements HttpRequestHandler {
  @Override
  public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    System.out.println("MyHttpRequestHandler.handleRequest");
  }
}
```
> ```핸들러 매핑으로 핸들러 조회```  
> 1. HandlerMapping 으로 핸들러(컨트롤러) 조회  
> 2. BeanNameUrlHandlerMapping 이 실행되어 핸들러인 MyHttpRequestHandler 를 반환  
> ```핸들러 어댑터 조회```  
> 1. HandlerAdapter 의 supports()를 순서대로 호출  
> 2. HttpRequestHandlerAdapter 가 HttpRequestHandler 인터페이스를 지원하므로 대상이 된다.  
> ```핸들러 어댑터 실행```  
> 1. 디스패처 서블릿이 조회한 HttpRequestHandlerAdapter 를 실행하면서 핸들러 정보도 함께 넘겨준다.  
> 2. HttpRequestHandlerAdapter 는 핸들러인 MyHttpRequestHandler 를 내부에서 실행하고, 그 결과를
반환한다.  
  
**정리 - MyHttpRequestHandler 핸들러매핑, 어댑터**  
MyHttpRequestHandler 를 실행하면서 사용된 객체는 다음과 같다.  
- HandlerMapping = BeanNameUrlHandlerMapping  
- HandlerAdapter = HttpRequestHandlerAdapter  

### ViewResolver

```java
@Component(value = "/springmvc/old-controller")
public class OldController implements Controller {
  @Override
  public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
    System.out.println("OldController.handleRequest");
    return new ModelAndView("new-form");
    // return new ModelAndView("/WEB-INF/views/new-form.jsp"); 권장 x
  }
}
```
> 스프링 부트는 InternalResourceViewResolver 라는 뷰리졸버를 자동으로 등록하는데,  
> 이 때 application.properties 에 등록한 spring.mvc.view.prefix, spring.mvc.view.suffix 설정 정보를 사용해서 등록한다.  
  
- 스프링 부트가 자동 등록하는 뷰 리졸버  
  BeanNameViewResolver: 빈 이름으로 뷰를 찾아서 반환  
  InternalResourceViewResolver: JSP를 처리할 수 있는 뷰를 반환  
  
1. 핸들러 어댑터 호출: 핸들러 어댑터를 통해 new-form이라는 논리 뷰 이름을 획득  
2. ViewResolver 호출  
  new-form이라는 뷰 이름으로 viewResolver를 순서대로 호출한다.   
  BeanNameViewResolver 는 new-form 이라는 이름의 스프링 빈으로 등록된 뷰를 찾아야하는데 없다.   
  InternalResourceViewResolver가 호출된다.   
3. InternalResourceViewResolver  
  이 뷰 리졸버는 InternalResourceView를 반환하고  
4. 뷰 - InternalResourceView  
  InternalResourceView 는 JSP처럼 forward()를 호출해서 처리할 수 있는 경우에 사용한다.  
5. view.rander()  
  view.rander() 가 호출되고 InternalResourceView 는 forward()를 사용해서 JSP를 실행한다.  
  
참고  
- 다른 뷰는 실제 뷰를 렌더링하지만, JSP의 경우 forward() 통해서 해당 JSP로 이동(실행)해야 렌더링이 된다. JSP를 제외한 나머지 뷰 템플릿들은 forward() 과정 없이 바로 렌더링 된다.  
- Thymeleaf 뷰 템플릿을 사용하면 ThymeleafViewResolver 를 등록해야 한다. 최근에는 라이브러리만 추
가하면 스프링 부트가 이런 작업도 모두 자동화해준다.  

<br/>
<hr>

## 스프링 MVC - 시작하기

스프링이 제공하는 컨트롤러는 ```애노테이션 기반```으로 동작한다. (매우 유연하고 실용적)  
@RequestMapping 기반의 애노테이션 컨트롤러  

### @RequestMapping

가장 우선순위가 높은 핸들러 매핑과 핸들러 어댑터는 ```RequestMappingHandlerMapping``` ,
```RequestMappingHandlerAdapter``` 이다.  
@RequestMapping의 앞글자를 따서 만든 이름인데, 이것이 바로 지금 스프링에서 주로 사용하는 애노테이션 기반의 컨트롤러를 지원하는 매핑과 어댑터이다.  

다음으로: <https://jeongkeepscalm.github.io/posts/KYH_SpringMVC_1(applied)/>  

