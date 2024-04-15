---
title: Junit, Mockito (2)
description: 테스트 코드 기초
date: 2024-03-10T13:00:000
categories: [ Spring, Test Code ]
tags: [ back-end, java, spring, test code, mockito, controller layer ]
---

<br>


<h2> 통합 테스트가 아닌 controller layer만 분리하여 테스트 </h2>

- ```controller layer```에서 처리되는 값을 검증하기 위한 테스트
  - ex ) http status, model, view, response body 등등....

<br>

<h2> 테스트 컨트롤러 </h2>

- 많이 사용되는 요청과 응답을 케이스별로 정리
  - 요청 파라미터가 없을 때
  - ```@RequestParam``` 으로 값을 받을 때
  - ```@PathVariable``` 로 값을 받을 때
  - ```@ModelAttribute```로 값을 받을 때
  - ```@RequestBody```로 값을 받을 때
  - 파일 데이터를 값으로 받을 때
  - 리턴하는 값이 JSON형태일 때 어떻게 값을 검증하는지.

```java

@Getter
@Setter
public class TestReq {
  private String id;
  private String password;

  public TestReq() {
  }

  public TestReq(String id, String password) {
    this.id = id;
    this.password = password;
  }
}

@Controller
@RequestMapping(path = "/controller")
public class IntegratedController {

  private final RandomUtil randomUtil;

  @Autowired
  public IntegratedController(RandomUtil randomUtil) {
    this.randomUtil = randomUtil;
  }

  @GetMapping(path = "/get-no-parameter")
  public String getController1(Model model) {
    model.addAttribute("message", "hello mockito!");
    randomModelAttributeSet(model);
    return "/controller/get";
  }

  @GetMapping(path = "/get-request-param")
  public String getController2(@RequestParam("param") String param, Model model) {
    model.addAttribute("message", "hello mockito!");
    randomModelAttributeSet(model);
    model.addAttribute("param", param);
    return "/controller/get";
  }

  @GetMapping(path = "/get-request-param/{id}")
  public String getController3(@PathVariable("id") String id, Model model) {
    model.addAttribute("message", "hello mockito!");
    randomModelAttributeSet(model);
    model.addAttribute("pathVariable", id);
    return "/controller/get";
  }

  @PostMapping(path = "/post-x-www-form-urlencoded")
  public String postController1(@ModelAttribute("testReq") TestReq testReq, Model model) {
    model.addAttribute("message", "hello mockito!");
    randomModelAttributeSet(model);
    model.addAttribute("testReq", testReq);
    return "/controller/post";
  }

  @PostMapping(path = "/post-request-body")
  public String postController2(@RequestBody TestReq testReq, Model model) {
    model.addAttribute("message", "hello mockito!");
    randomModelAttributeSet(model);
    model.addAttribute("testReq", testReq);
    return "/controller/post";
  }

  @PostMapping(path = "/post-multipart-file/{id}")
  public String postController2(
    @PathVariable("id") String id,
    @RequestParam("file") MultipartFile multipartFile,
    Model model
  ) {
    model.addAttribute("message", "hello mockito!");
    randomModelAttributeSet(model);
    model.addAttribute("multipartFile", multipartFile);
    model.addAttribute("id", id);
    return "/controller/post";
  }

  @ResponseBody
  @PostMapping(path = "/rest-api-response_check")
  public TestReq postController3(
  ) {
    return new TestReq("홍길동", "12345");
  }


  private void randomModelAttributeSet(Model model) {
    model.addAttribute("uuid", randomUtil.randomUUID());
    model.addAttribute("integer", randomUtil.randomIntegerNumber());
  }

}
```

<br>

<h2> 테스트 기본 설정 코드 </h2>

```java

@ExtendWith(MockitoExtension.class)
@WebMvcTest(
  controllers = {
    IntegratedController.class
  }
)
@AutoConfigureMockMvc
public class ControllerTestFoundation {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private RandomUtil randomUtil;

  private static final ObjectMapper objectMapper = new ObjectMapper();

  @BeforeEach
  void beforeEach() {
    defaultModelValueSetup();
  }

  private void defaultModelValueSetup() {
    when(randomUtil.randomUUID()).thenReturn("random-uuid");
    when(randomUtil.randomIntegerNumber()).thenReturn(10);
  }

}
```

<h2> ExtendWith </h2>

- ```@ExtendWith(MockitoExtension.class)```
  - ```controller layer``` 가 의존하고 있는 ```bean```을 모킹해주는 어노테이션을 사용 가능하게 해줌.
    - [참고](https://angrypig123.github.io/posts/junit_mockito_foundation(1)/){:target="\_blank"}

<br>


<h2> WebMvcTest </h2>

- ```@WebMvcTest``` : 애플리케이션의 ```controller layer```만을 테스트할 때 사용
  - ```controllers``` 에 테스트한 컨트롤러를 설정할 수 있음. 설정하지 않을시 모든 컨트롤러를 대상으로함
  - ```excludeAutoConfiguration, excludeFilters```해당 설정을 하면 제외하고싶은 필터, 기본 설정을 무시할 수 있다.
    - ```excludeAutoConfiguration = SecurityAutoConfiguration.class``` 이런 설정을 추가하면 ```security```를 무시할 수 있음.
  - ```@SpringBootTest```의 차이점 : ```@SpringBootTest```는 전체 레이어를 대상으로 테스르할 때 사용

<br>

<h2> private MockMvc mockMvc </h2>

- 테스트 코드에서 컨트롤러에 요청을 보내고 리턴받는 값들을 검증할 수 있게 해주는 클래스

<br>

<h2> MockBean </h2>

- ```@MockBean```
  - 컨트롤러 레이어에서 의존하고있는 ```bean```을 테스트 가능할 수 있도록 가짜 ```bean```을 만들어 주입해주는 어노테이션
    - 해당 테스트 에서는 ```private final RandomUtil randomUtil``` <= 이거에 해당

<br>

<h2> @BeforeEach </h2>

- ```@BeforeEach```
  - 각각의 ```@Test```를 실행전에 실행되는 메소드, 해당 설정을 함으로써 테스트에 필요한 값이나 설정을 테스트마다 동일하게 할 수 있다.

<br>

<h2> defaultModelValueSetup() </h2>

- 테스트 컨트롤러가 의존하고 있는 계층의 값들에 가짜 값을 주입하는 코드
  - ```private RandomUtil randomUtil``` 해당 서비스에서 제공해주는 값들을 ```stubbing``` 해주는 코드

<h2> controller_get_no_parameter </h2>

- 요청 파라미터가 없는 컨트롤러 테스트

```java

@Test
@DisplayName("view 리턴 컨트롤러 - get no parameter")
void controller_get_no_parameter() throws Exception {
  MvcResult mvcResult = mockMvc.perform(
      get("/controller/get-no-parameter")
    )
    .andExpect(status().isOk())
    .andReturn();

  ModelAndView modelAndView = mvcResult.getModelAndView();
  Assertions.assertNotNull(modelAndView);

  Map<String, Object> model = modelAndView.getModel();
  Assertions.assertNotNull(model.get("message"));
  Assertions.assertNotNull(model.get("uuid"));
  Assertions.assertNotNull(model.get("integer"));

  String viewName = modelAndView.getViewName();
  Assertions.assertEquals("/controller/get", viewName);

}
```

<br>

<h2> controller_get_request_param() </h2>

- 요청 파라미터를 ```url query string``` 으로 받는 컨트롤러 테스트
  - 요청 url 뒤에 ```url/param={param}``` 형식으로 값을 바인딩하고 다음 인자에 바인딩될 값을 설정

```java

@Test
@DisplayName("view 리턴 컨트롤러 - get - request param")
void controller_get_request_param() throws Exception {
  MvcResult mvcResult = mockMvc.perform(
      get("/controller/get-request-param?param={param}", "param")
    )
    .andExpect(status().isOk())
    .andReturn();

  ModelAndView modelAndView = mvcResult.getModelAndView();
  Assertions.assertNotNull(modelAndView);

  Map<String, Object> model = modelAndView.getModel();
  Assertions.assertNotNull(model.get("message"));
  Assertions.assertNotNull(model.get("uuid"));
  Assertions.assertNotNull(model.get("integer"));
  Assertions.assertNotNull(model.get("param"));

  String viewName = modelAndView.getViewName();
  Assertions.assertEquals("/controller/get", viewName);

}
```

<br>

<h2> controller_get_path_variable() </h2>

- ```@PathVariable```로 값을 받는 컨트롤러 테스트
  - 테스트 형식이 ```url query string``` 방식과 거의 동일하다

```java

@Test
@DisplayName("view 리턴 컨트롤러 - get - path variable")
void controller_get_path_variable() throws Exception {
  MvcResult mvcResult = mockMvc.perform(
      get("/controller/get-request-param/{id}", "pathVariable")
    )
    .andExpect(status().isOk())
    .andReturn();

  ModelAndView modelAndView = mvcResult.getModelAndView();
  Assertions.assertNotNull(modelAndView);

  Map<String, Object> model = modelAndView.getModel();
  Assertions.assertNotNull(model.get("message"));
  Assertions.assertNotNull(model.get("uuid"));
  Assertions.assertNotNull(model.get("integer"));
  Assertions.assertEquals("pathVariable", model.get("pathVariable"));

  String viewName = modelAndView.getViewName();
  Assertions.assertEquals("/controller/get", viewName);

}
```

<br>


<h2> controller_post_x_www_form_urlencoded() </h2>

- 요청 값을 ```x-www-form-urlencoded``` 형태로 받는 컨트롤러 테스트
  - ```perform()``` 메소드 안에서 요청 url을 설정한 다음에 ```.param()```을 이용해서 값 셋팅.
  - ```.params()``` 를 이용해서 ```MultiValueMap<String, String> params``` 형식으로 보낼 수도 있음.

```java

@Test
@DisplayName("view 리턴 컨트롤러 - post - x-www-form-urlencoded")
void controller_post_x_www_form_urlencoded() throws Exception {
  MvcResult mvcResult = mockMvc.perform(
      post("/controller/post-x-www-form-urlencoded")
        .param("id", "홍길동")
        .param("password", "12345")
    )
    .andExpect(status().isOk())
    .andReturn();

  ModelAndView modelAndView = mvcResult.getModelAndView();
  Assertions.assertNotNull(modelAndView);

  Map<String, Object> model = modelAndView.getModel();
  Assertions.assertNotNull(model.get("message"));
  Assertions.assertNotNull(model.get("uuid"));
  Assertions.assertNotNull(model.get("integer"));

  Assertions.assertNotNull(model.get("testReq"));

  Assertions.assertInstanceOf(TestReq.class, model.get("testReq"));   //  타입 체크
  TestReq testReq = (TestReq) model.get("testReq");
  Assertions.assertEquals("홍길동", testReq.getId());
  Assertions.assertEquals("12345", testReq.getPassword());

  String viewName = modelAndView.getViewName();
  Assertions.assertEquals("/controller/post", viewName);

}
```

<br>

<h2> controller_post_request_body() </h2>

- 요청 파라미터가 ```Json```일 때 컨트롤러 테스트
  - ```ObjectMapper```를 이용하여 전달할 값을 ```JSON```형태로 만든 후 테스트 이후 전달받은 값이 잘 바인딩 되었는지까지 검증

```java

@Test
@DisplayName("view 리턴 컨트롤러 - post - request body")
void controller_post_request_body() throws Exception {

  TestReq req = new TestReq("홍길동", "12345");

  MvcResult mvcResult = mockMvc.perform(
      post("/controller/post-request-body")
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(objectMapper.writeValueAsString(req))
    )
    .andExpect(status().isOk())
    .andReturn();

  ModelAndView modelAndView = mvcResult.getModelAndView();
  Assertions.assertNotNull(modelAndView);

  Map<String, Object> model = modelAndView.getModel();
  Assertions.assertNotNull(model.get("message"));
  Assertions.assertNotNull(model.get("uuid"));
  Assertions.assertNotNull(model.get("integer"));

  Assertions.assertNotNull(model.get("testReq"));

  Assertions.assertInstanceOf(TestReq.class, model.get("testReq"));   //  타입 체크

  TestReq testReq = (TestReq) model.get("testReq");
  Assertions.assertEquals("홍길동", testReq.getId());
  Assertions.assertEquals("12345", testReq.getPassword());

  String viewName = modelAndView.getViewName();
  Assertions.assertEquals("/controller/post", viewName);

}
```

<br>

<h2>controller_post_multipart_file()</h2>

- ```MultipartFile```를 요청값으로 받는 컨트롤러 테스트
  - ```MultipartFile```을 모킹해주는 객체 ```MockMultipartFile``` 선언 후 테스트
  - 파일 데이터와 다른 데이터를 같이 보낼 수 있다.

```java

@Test
@DisplayName("view 리턴 컨트롤러 - post - multipart file form data")
void controller_post_multipart_file() throws Exception {

  MockMultipartFile file = new MockMultipartFile(
    "file", // 파일 파라미터 이름
    "test.txt", // 파일 이름
    "text/plain", // 파일 타입
    "Hello, World!".getBytes() // 파일 내용
  );

  MvcResult mvcResult = mockMvc.perform(
      multipart("/controller/post-multipart-file/{id}", "id")
        .file(file)
    )
    .andExpect(status().isOk())
    .andReturn();

  ModelAndView modelAndView = mvcResult.getModelAndView();
  Assertions.assertNotNull(modelAndView);

  Map<String, Object> model = modelAndView.getModel();
  Assertions.assertNotNull(model.get("message"));
  Assertions.assertNotNull(model.get("uuid"));
  Assertions.assertNotNull(model.get("integer"));
  Assertions.assertNotNull(model.get("multipartFile"));
  Assertions.assertNotNull(model.get("id"));

  String viewName = modelAndView.getViewName();
  Assertions.assertEquals("/controller/post", viewName);

}
```

<br>

<h2> rest_controller_response_body_value() </h2>

- ```Json``` 형태로 반환되는 ```response```값을 검증하는 테스트
  - ```jsonPath```를 이용하여 검증 가능

```java
    @Test
    @DisplayName("rest api 컨트롤러 - response body 값 검증")
    void rest_controller_response_body_value() throws Exception {
        mockMvc.perform(
                        post("/controller/rest-api-response_check")
                )
                .andExpect(jsonPath("$.id").value("홍길동"))
                .andExpect(jsonPath("$.password").value("12345"));

    }
```

<br>

<h2> 테스트 결과 </h2>

![test_result](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/a7a61b95-c299-44ce-a42f-7e619644ee0d)



