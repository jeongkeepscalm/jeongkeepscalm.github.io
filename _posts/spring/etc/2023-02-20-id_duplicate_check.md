---
title: 아이디 중복 체크와 bean validation
description: bean validation
date: 2024-02-20T09:30:000
categories: [ Spring, Validation ]
tags: [ back-end, spring, id duplicate check, controller advice ]
---

- 과거에 작성한 코드를 보다 보니 테이블에서 pk에 해당하는 데이터가 존재 하는지 판단해야하는 <br>
  검증 로직들이 항상 서비스 코드마다 들어가 있음.

예를 들면 아래와 같은 코드들임

```java
@Override
public MemberDto getMemberDetail(Long id){
  return memberRepository
  .findById(id)
  .orElseThrow(()->new ResourceNotFoundException("Member","id",id))
  .toDto();
  }
```

해당 코드를 더 자세히 파헤쳐보면 아래와 같이 @ControllerAdvice 를 통해 예외 메세지를 반환하고 있음.

```java

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorDetails> handlerResourceNotFoundException(
    ResourceNotFoundException exception,
    WebRequest webRequest
  ) {
    return new ResponseEntity<>(
      ErrorDetails.builder()
        .timeStamp(THIS_LOCAL_DATE_TIME)
        .message(exception.getMessage())
        .details(webRequest.getDescription(false))  //  에러 발생지를 알려준다.
        .build()
      , HttpStatus.NOT_FOUND);
  }   //  해당 리소스가 없을때 예외를 반환한다. ex) detail 페이지 등등....
}
```

그러다 문득 Bean Validation 을 사용 하여 요청 파라미터에 대한 검증을 실시할 때 <br>
DB에 직접 접근 해서 해당 처리도 같이 할 수 없을지 굼긍 해졌음.

아이디어는 ```@IdDuplicateCheck``` 와 같은 어노테이션을 만들고 어노테이션 파라미터로 tableName, columnName, field value 를<br>
받아서 검증기를 만들고 해당 검증기에서 JdbcTemplate 를 이용해서 카운팅을 통한 처리를 하는것임.

- 생성 목록
  - ```@IdDuplicateCheck```
  - ```IdDuplicateCheckValidator```

<br>

<h2> @IdDuplicateCheck </h2>

- 기존에 Spring bean validation 에서 사용 되고 있는 validation관련 어노테이션중 중 적당한 클래스를 copy, modify

```java

@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
@Retention(RUNTIME)
@Repeatable(List.class)
@Documented
@Constraint(validatedBy = {IdDuplicateCheckValidator.class})
public @interface IdDuplicateCheck {
  String message() default "{validation.duplicated.id}";

  Class<? extends Payload>[] payload() default {};

  Class<?>[] groups() default {};

  String tableName();

  String columnName();

  @Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
  @Retention(RUNTIME)
  @Documented
  @interface List {
    IdDuplicateCheck[] value();
  }

}
```

- 중요 설정
  - ```@Constraint(validatedBy = {IdDuplicateCheckValidator.class})``` 해당 어노테이션이 선언 되었을떄 어떤 검증기를 통해 검증을 할것인지 선언해주는 부분
  - ```String tableName(), String columnName()``` 어노테이션 파라미터로 전달받을 값 선언.
  - ```String message() default "{validation.duplicated.id}"``` default 검증 실패 메세지 설정

<br>

<h2> IdDuplicateCheckValidator </h2>

- 실제로 어노테이션을 통한 검증을 진행할 검증기.

```java

@Slf4j
@Component
@RequiredArgsConstructor
public class IdDuplicateCheckValidator implements ConstraintValidator<IdDuplicateCheck, CharSequence> {

  private final JdbcTemplate jdbcTemplate;
  private String tableName;
  private String columnName;

  @Override
  public void initialize(IdDuplicateCheck parameters) {
    tableName = parameters.tableName();
    columnName = parameters.columnName();
    validateParameters();
  }

  @Override
  public boolean isValid(CharSequence charSequence, ConstraintValidatorContext context) {
    String sql = String.format("select count(*) from %s where %s = ?", tableName, columnName);
    Integer value = jdbcTemplate.queryForObject(sql, Integer.class, charSequence.toString());
    if (value == null)
      throw new NullPointerException("jdbcTemplate.queryForObject(sql, Integer.class) is null");
    return value == 0;
  }

  private void validateParameters() {
    if (validate(tableName) || validate(columnName)) {
      throw new RuntimeException("ToDO");
    }
  }

  private boolean validate(String value) {
    return value == null || value.isEmpty();
  }

}
```

- ```public void initialize(IdDuplicateCheck parameters)```
  - 어노테이션에서 전달받은 인자값을 검증해주는부분.

- ```private void validateParameters(), private boolean validate(String value)```
  - 간단한 테이블과 컬럼 검증 로직을 실행 시켜주는 부분

- ```public boolean isValid(CharSequence charSequence, ConstraintValidatorContext context)```
  - 전달받은 인자값들에 이상이 없을 경우 실질적인 중복 체크 로직을 실행 시켜주는 부분

<br>

- 테스트 코드

- 실제로 등록된 검증기를 실행시켜야 하기 떄문에 ```@SpringBootTest 선언```

```java

@SpringBootTest
public class ValidatorTest {

  @Autowired
  private CustomerService customerService;

  @Autowired
  private LocalValidatorFactoryBean validator;

  @Autowired
  private MessageSource messageSource;

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

  @Test
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

}
```

- ```CustomerService``` : 실제로 save 로직을 태운후 에러 메세지가 리턴 되는지 확인하기 위한 주입
- ```LocalValidatorFactoryBean``` : 검증기에 직접 Object 를 넣어서 예외 처리가 잘 되는지 확인을 위한 주입


- 테스트 방법
  - 1 ] 가입이 안된 id를 검증기에 태우고 검즘 메세지가 출력되는지 확인. 예상대로 출력이 안되면 save 실행
  - 2 ] 다시 같은 id로 가입을 시도, 이후 검증기를 태우고 검증 메세지가 출력 되는지 확인 예상대로 출력되면 검증 메세지 확인

![test](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/50f0c4e2-1f1b-4d16-bd55-68cd6599e6cc)

성공
