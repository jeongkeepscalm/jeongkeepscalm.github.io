---
title: Spring Security, Authentication Success handler
description: Spring Security
date: 2024-02-24T22:30:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, authentication success handler ]
---

<h2> AuthenticationSuccessHandler </h2>

- 인증에 성공했을 때 어떤 동작을 취할것인지 설정하는 핸들러

<br>

<h2> CustomSuccessHandler </h2>

```java

@Slf4j
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
    response.sendRedirect("/main");
  }
}
```

<br>

<h2> SecurityConfiguration </h2>

```java

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AngrySecurityConfiguration {

  //    ...

  @Bean
  public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
    httpSecurity(http)
      .authorizeHttpRequests(
        //    ...
      )
      .formLogin(formLogin -> formLogin
        .successHandler(customAuthenticationSuccessHandler)
      )
      .httpBasic(withDefaults());

    return http.build();
  }

  private HttpSecurity httpSecurity(HttpSecurity http) throws Exception {
    //    ...
  }


  @Bean
  public PasswordEncoder passwordEncoder() {
    //    ...
  }

}
```

<br>

<h2> MainController </h2>

```java

@Slf4j
@Controller
@RequestMapping(path = "/main")
public class MainController {

  @GetMapping
  public String defaultMain(Authentication authentication, Model model) {
    authenticationPrintHelper(authentication);
    String name = authentication.getName();
    String greeting = String.format("%s님 반갑습니다", name);
    model.addAttribute("greeting", greeting);
    return "/main/index";
  }

  private void authenticationPrintHelper(Authentication authentication) {
    String name = authentication.getName();
    log.info("name = {}", name);
  }

}
```

<br>

<h2> /main/index.html </h2>

```html
<!doctype html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>

<header>
  <p th:text="${greeting}"></p>
</header>

</body>
</html>
```

![success_handler](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/6496a917-f76f-495e-8e2c-0aabfdf914b5)

<br>

<h2> 테스트 </h2>

```java

@SpringBootTest
@AutoConfigureMockMvc
public class MainControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void main_greeting_test() throws Exception {

    MvcResult mvcResult = mockMvc.perform(
        get("/main")
          .with(httpBasic("guest@gmail.com", "1q2w3e4r!"))
      )
      .andExpect(status().isOk())
      .andReturn();

    ModelAndView modelAndView = mvcResult.getModelAndView();
    Assertions.assertNotNull(modelAndView);

    String viewName = modelAndView.getViewName();
    Assertions.assertEquals("/main/index", viewName);

    Map<String, Object> model = modelAndView.getModel();
    Assertions.assertNotNull(model.get("greeting"));

  }

}
```

![test_success](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/d6b50d18-ffbc-41c2-9537-fea1d6338cd1)
