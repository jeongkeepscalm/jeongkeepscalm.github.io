---
title: Custom Method Argument Not Valid Exception
description: 사용자 정의 예외처리
date: 2024-02-20T17:30:000
categories: [ Spring, Validation ]
tags: [ back-end, spring, method argument not valid exception, controller advice ]
---

- ```Bean Validation``` 이용중 request body를 이용하여 요청 파라미터를 검증 할때에 <br>
  에러 메세지를 field : error message 형태의 json 문자열로 리턴해주기 위한 설정이 필요 했음.

- 검증 대상이 될 Dto

```java

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {

  @NotNullEmail
  @IdDuplicateCheck(tableName = "customer", columnName = "customer_id")
  private String customerId;

  @NotBlank
  private String firstName;

  @NotBlank
  private String lastName;

  @NotBlank
  private String address;

  @NotBlank
  private String phone;

}
```

<br>

<h2> 테스트 컨트롤러 </h2>

```java

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/test")
public class TestController {

  private final CustomerService customerService;

  @PostMapping("/customer-dto-validator")
  public ResponseEntity<String> customDtoValidator(@Valid @RequestBody CustomerDto customerDto) {
    customerService.save(customerDto);
    log.info("customerDto = {}", customerDto);
    return ResponseEntity.ok("valid pass");
  }

}

```

<br>

<h2> RequestBody </h2>

- 여기서 ```customerId```는 이미 등록되어있는 id

```text
{
    "customerId":"johnDoe@gmail.com",
    "firstName":"john",
    "lastName":"doe",
    "address":"동작대로 xx길 xxx xx",
    "phone":"555-0101"
}
```

<br>

- 위와 같은 코드를 실행 시키면 customerId에서 아이디 중복이나기 때문에 BindingResult 의 값이 JSON 형태로 반환되어야함
  - 아이디 중복 체크 포스팅 : [아이디 중복 체크](https://angrypig123.github.io/posts/id_duplicate_check/){:target=\blank}

- 반환 텍스트

```text
{
    "timestamp": "2024-02-20T08:05:13.575+00:00",
    "status": 400,
    "error": "Bad Request",
    "trace": "...",
    "message": "Validation failed for object='customerDto'. Error count: 1",
    "errors": [
        {
            "codes": [
                "IdDuplicateCheck.customerDto.customerId",
                "IdDuplicateCheck.customerId",
                "IdDuplicateCheck.java.lang.String",
                "IdDuplicateCheck"
            ],
            "arguments": [
                {
                    "codes": [
                        "customerDto.customerId",
                        "customerId"
                    ],
                    "arguments": null,
                    "defaultMessage": "customerId",
                    "code": "customerId"
                },
                {
                    "arguments": null,
                    "defaultMessage": "customer_id",
                    "codes": [
                        "customer_id"
                    ]
                },
                {
                    "arguments": null,
                    "defaultMessage": "customer",
                    "codes": [
                        "customer"
                    ]
                }
            ],
            "defaultMessage": "존재하는 아이디 입니다.",
            "objectName": "customerDto",
            "field": "customerId",
            "rejectedValue": "johnDoe@gmail.com",
            "bindingFailure": false,
            "code": "IdDuplicateCheck"
        }
    ],
    "path": "/test/customer-dto-validator"
}
```

<br>

- 반환된 데이터에는 쓸만한 데이터가 모두 있지만 너무 많은게 탈이다. 원하는 메세지만 사용자화 시켜 사용할 수 있어야함.
  - 순서
    - 1 ] BindingResult 를 인자로 받는```CustomArgumentNotValidException``` 생성
    - 2 ] ```@RestControllerAdvice``` 생성
    - 3 ] ```@ExceptionHandler(CustomArgumentNotValidException.class)``` 생성
    - 4 ] ```CustomArgumentNotValidException``` 의 BindingResult 로 부터 메세지 바인딩 후 리턴
    - 5 ] 해당 기능을 사용할 컨트롤러에서 해당 예외를 터트려줘야함

<br>

<h2> CustomArgumentNotValidException </h2>

- RuntimeException 을 상속 받은후 컨트롤러에서 BindingResult 객체를 인자로 받아서 예외틑 터트린다.

```java

@Getter
public class CustomArgumentNotValidException extends RuntimeException {

  private final BindingResult bindingResult;

  public CustomArgumentNotValidException(BindingResult bindingResult) {
    this.bindingResult = bindingResult;
  }

}
```

<br>

<h2> @RestControllerAdvice </h2>

- 예외를 프로젝트 내에서 전적으로 처리하여 예외 처리를 공통화

```java

@Slf4j
@RestControllerAdvice
public class GlobalControllerAdvice {


}
```

<br>

<h2> @ExceptionHandler(CustomArgumentNotValidException.class) </h2>

- ```@RestControllerAdvice``` 에 예외 핸들러 추가
  - 이제 ```CustomArgumentNotValidException``` 발생시 해당 처리기를 통해 예외가 처리된다.

```java

@Slf4j
@RestControllerAdvice
public class GlobalControllerAdvice {

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler(CustomArgumentNotValidException.class)
  public void handleCustomArgumentNotValidExceptions(CustomArgumentNotValidException ex) {

  }

}
```

<br>

<h2> CustomArgumentNotValidException 바인딩 </h2>

- 예외가 발생하고 해당 예외가 포함하고 있는 ```BindingResult```를 통해 에러 메세지를 커스텀화 한다.
  - 간단하게 여기에서는 Map 형태로 key = field, value = error message 설정.

```java

@Slf4j
@RestControllerAdvice
public class GlobalControllerAdvice {

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler(CustomArgumentNotValidException.class)
  public Map<String, String> handleCustomArgumentNotValidExceptions(CustomArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
    for (FieldError fieldError : fieldErrors) {
      errors.put(fieldError.getField(), fieldError.getDefaultMessage());
    }
    log.info("errors = {}", errors);
    return errors;
  }

}
```

<br>

<h2> 테스트 컨트롤러 </h2>

- 글 맨 처음에 설명했던 테스트 컨트롤러를 이용해서 값을 검증할 때 BindingResult 처리부분 추가.

- 수정된 컨트롤러
  - ```BindingResult``` 를 인자로 받고, 에러 검증을 하는 코드, 예외를 발생시키는 코드가 추가됨.

```java
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/test")
public class TestController {

    private final CustomerService customerService;

    @PostMapping("/customer-dto-validator")
    public ResponseEntity<String> customDtoValidator(@Valid @RequestBody CustomerDto customerDto, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new CustomArgumentNotValidException(bindingResult);
        } else {
            customerService.save(customerDto);
            log.info("customerDto = {}", customerDto);
            return ResponseEntity.ok("valid pass");
        }

    }

}
```

요청 결과

![postman_test](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/5e786046-9cde-40c4-96b2-5e6a5bae13cc)

<br>

<h2> 테스트 코드 </h2>

- 설명 생략

```java
@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ValidatorTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private LocalValidatorFactoryBean validator;

    private CustomerDto customerDto;

    @BeforeEach
    void beforeEach() {
        customerDto =
                CustomerDto.builder()
                        .customerId("johnDoe@gmail.com")
                        .firstName("john")
                        .lastName("doe")
                        .address("동작대로 xx길 xxx xx")
                        .phone("555-0101")
                        .build();
    }

    @BeforeEach
    void afterEach() {
        customerDto =
                CustomerDto.builder()
                        .customerId("johnDoe@gmail.com")
                        .firstName("john")
                        .lastName("doe")
                        .address("동작대로 xx길 xxx xx")
                        .phone("555-0101")
                        .build();

        customerRepository.deleteCustomerByCustomerId(customerDto.getCustomerId());

    }

    @Test
    @Order(1)
    void id_duplicated_validator() {
        Set<ConstraintViolation<CustomerDto>> validated = validator.validate(customerDto);
        Assertions.assertEquals(0, validated.size());
        customerService.save(customerDto);
        validated = validator.validate(customerDto);
        Assertions.assertEquals(1, validated.size());
        ConstraintViolation<CustomerDto> violation = validated.iterator().next();
        String errorMessage = violation.getMessage();
        Assertions.assertEquals(messageSource.getMessage("validation.duplicated.id", null, Locale.KOREA), errorMessage);
    }

    @Test
    @Order(2)
    void validator_integrated_test_valid_pass() throws Exception {
        ResultActions resultActions = customerDtoValidatorRequest(customerDto);
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        String responseBody = resultActions.andReturn().getResponse().getContentAsString();
        Assertions.assertEquals("valid pass", responseBody);
    }

    @Test
    @Order(3)
    void validator_integrated_test_valid_fail_case1_emptyId() throws Exception {
        String notNullEmail = messageSource.getMessage("validation.not.null.email", null, Locale.getDefault());
        customerDto.setCustomerId("");
        ResultActions resultActions = customerDtoValidatorRequest(customerDto);
        resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());
        resultActions.andExpect(MockMvcResultMatchers.jsonPath("$.customerId", Is.is(notNullEmail)));
    }

    @Test
    @Order(4)
    void validator_integrated_test_valid_fail_case2_duplicateId() throws Exception {
        CustomerDto save = customerService.save(customerDto);
        Assertions.assertNotNull(save);
        String duplicateId = messageSource.getMessage("validation.duplicated.id", null, Locale.getDefault());
        ResultActions resultActions = customerDtoValidatorRequest(customerDto);
        resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());
        resultActions.andExpect(MockMvcResultMatchers.jsonPath("$.customerId", Is.is(duplicateId)));
    }

    private ResultActions customerDtoValidatorRequest(CustomerDto customerDto) throws Exception {
        String req = objectMapper.writeValueAsString(customerDto);
        return mockMvc.perform(
                MockMvcRequestBuilders
                        .post("/test/customer-dto-validator")
                        .content(req)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
        ).andDo(MockMvcResultHandlers.print());
    }

}
```

<h2> 결과 </h2>

![test_result](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/d453a3fa-eb48-40dd-b1b8-d3fe6d8b7193)
