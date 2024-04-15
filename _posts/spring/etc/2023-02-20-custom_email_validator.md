---
title: Custom Email Validator
description: 사용자 정의 email validator
date: 2024-02-20T00:30:000
categories: [ Spring, Validation ]
tags: [ back-end, spring, email validation ]
---

<h2> @Email </h2>

- 기존 ```@Email``` 의 문제
  - 해당 검증기를 구현하고있는 ```EmailValidator.class```안에 isValid 부분에서 ```if(value == null) return true;```<br>
    부분이 email이 등록 안되어 있을때에 검증기가 통과됨. 개발중인 서비스에서 사용하려는 ```@Email```은 PK로 작용해야 하기 때문에 커스텀 필요

- 문제가된 ```EmailValidator.class``` 코드

```java
public class EmailValidator extends AbstractEmailValidator<Email> {

  private static final Log LOG = LoggerFactory.make(MethodHandles.lookup());

  private java.util.regex.Pattern pattern;

  @Override
  public void initialize(Email emailAnnotation) {
    super.initialize(emailAnnotation);

    Pattern.Flag[] flags = emailAnnotation.flags();
    int intFlag = 0;
    for (Pattern.Flag flag : flags) {
      intFlag = intFlag | flag.getValue();
    }

    // we only apply the regexp if there is one to apply
    if (!".*".equals(emailAnnotation.regexp()) || emailAnnotation.flags().length > 0) {
      try {
        pattern = java.util.regex.Pattern.compile(emailAnnotation.regexp(), intFlag);
      } catch (PatternSyntaxException e) {
        throw LOG.getInvalidRegularExpressionException(e);
      }
    }
  }

  @Override
  public boolean isValid(CharSequence value, ConstraintValidatorContext context) {

    if (value == null) {  //  해당 부분
      return true;    //  해당 부분
    }  //  해당 부분

    boolean isValid = super.isValid(value, context);
    if (pattern == null || !isValid) {
      return isValid;
    }

    Matcher m = pattern.matcher(value);
    return m.matches();
  }
}
```

<br>

<h2> Custom @Email </h2>

- ```@NotNullEmail``` 검증기를 생성
  - 1 ] ```@Email``` : 코드를 그대로 긁어서 해당 검증 부분만 변경
  - 2 ] 검증기 등록
  - 3 ] 테스트용 ExceptionHandler 생성, 및 테스트 코드 작성.

<br>

<h2> Custom @NotNullEmail : @interface 클래스 </h2>

```java

@Documented
@Constraint(validatedBy = {NotNullEmailValidator.class})
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
@Retention(RUNTIME)
@Repeatable(List.class)
public @interface NotNullEmail {
  String message() default "{jakarta.validation.constraints.Email.message}";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  String regexp() default ".*";

  Pattern.Flag[] flags() default {};

  @Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
  @Retention(RUNTIME)
  @Documented
  public @interface List {
    NotNullEmail[] value();
  }

}
```

<br>

<h2> NotNullEmailValidator </h2>

```java

@Slf4j
public class NotNullEmailValidator extends AbstractEmailValidator<NotNullEmail> {

  private java.util.regex.Pattern pattern;

  @Override
  public void initialize(NotNullEmail emailAnnotation) {
    super.initialize(emailAnnotation);

    Pattern.Flag[] flags = emailAnnotation.flags();
    int intFlag = 0;
    for (Pattern.Flag flag : flags) {
      intFlag = intFlag | flag.getValue();
    }

    if (!".*".equals(emailAnnotation.regexp()) || emailAnnotation.flags().length > 0) {
      try {
        pattern = java.util.regex.Pattern.compile(emailAnnotation.regexp(), intFlag);
      } catch (PatternSyntaxException e) {
        log.error("patternSyntaxException = ", e);
      }
    }
  }

  @Override
  public boolean isValid(CharSequence value, ConstraintValidatorContext context) {
    if (value == null || value == "") {
      return false;
    }

    boolean isValid = super.isValid(value, context);
    if (pattern == null || !isValid) {
      return isValid;
    }

    Matcher m = pattern.matcher(value);
    return m.matches();
  }

}
```

<br>

<h2> 테스트 컨트롤러 </h2>

- ```@PostMapping("/validator")``` : 테스트용 handler
- ```TestReq.class``` : 검증기 테스트용 req 생성
- ```handleValidationExceptions()``` : 메세지 검증용 핸들러

```java

@RestController
public class ValidatorTestController {

  @PostMapping("/validator")
  public ResponseEntity<String> addUser(@Valid @RequestBody TestReq testReq) {
    return ResponseEntity.ok("valid ok");
  }

  @Getter
  @Setter
  @ToString
  @NoArgsConstructor
  @AllArgsConstructor
  public static class TestReq {
    @NotNullEmail(message = "is not null!!")
    private String email;
  }

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public Map<String, String> handleValidationExceptions(
    MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    return errors;
  }

}
```

<br>

<h2> 테스트 코드 </h2>

- ```isBadRequest()``` : HttpStatus 검증
- ```is("is not null!!")``` : 검증 메세지 확인

```java

@SpringBootTest
@AutoConfigureMockMvc
public class ValidatorTest {

  @Autowired
  ValidatorTestController validatorTestController;

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  public void custom_email_validator_test() throws Exception {
    ValidatorTestController.TestReq testReq = new ValidatorTestController.TestReq("");
    String req = objectMapper.writeValueAsString(testReq);
    mockMvc.perform(MockMvcRequestBuilders.post("/validator")
        .content(req)
        .contentType(MediaType.APPLICATION_JSON_VALUE))
      .andExpect(MockMvcResultMatchers.status().isBadRequest())
      .andExpect(MockMvcResultMatchers.jsonPath("$.email", Is.is("is not null!!")));
  }
}
```

![custom_email_validator](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/7296ffd8-c41e-4467-a8c0-720000213b0b)
