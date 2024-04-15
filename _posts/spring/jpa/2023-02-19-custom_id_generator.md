---
title: Custom Generator
description: 스프링 레디스
date: 2024-02-19T02:51:000
categories: [ Spring, Jpa ]
tags: [ back-end, spring, jpa, custom generator, id generator ]
---

- 사용자 정의 Id 생성기

<h2> Entity 코드 </h2>

```java

@Entity
@Getter
@Setter
@Table(name = "book")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Book {

  @Id
  @GeneratedValue(generator = "prod-generator")
  @GenericGenerator(name = "prod-generator",
    parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "book"),
    type = MyGenerator.class)
  private String isbn;

  private String name;
  private String author;

  public Book(String name, String author) {
    this.name = name;
    this.author = author;
  }

}
```

<h2> Annotation </h2>

- ```@GeneratedValue``` : 엔티티의 primary key값을 자동으로 생성한다는 선언.
  - generator = "prod-generator" : 사용할 생성기의 이름을 지정

- ```@GenericGenerator``` : 생성기의 구성을 설정한다.
  - name = "prod-generator" : 생성기의 이름을 설정한다.
  - parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "book") : 생성기에 파라미터를 설정한다.
  - type = MyGenerator.class : 사용될 클래스의 타입을 지정한다.

<br>

<h2> Generator 코드 </h2>

```java

@Slf4j
public class MyGenerator
  implements IdentifierGenerator, Configurable {

  private String prefix;

  @Override
  public Serializable generate(
    SharedSessionContractImplementor session, Object obj)
    throws HibernateException {
    return prefix + Math.random() + "";
  }

  @Override
  public void configure(Type type, Properties properties,
                        ServiceRegistry serviceRegistry) throws MappingException {
    prefix = properties.getProperty("prefix");
  }

}
```

<h2> Generator 코드 설명 </h2>

- ```generate``` : 생성될 값을 커스텀한다.
  - return 해주는 부분에 전달받은 prefix와 내가 정의할 값을 설정하여 custom generator id값을 설정할 수 있다.<br>
    테스트 용으로 임의의 double 값 설정

- ```configure``` : ```@GenericGenerator```의 parameters 의 파라미터로 받은 값을 파싱해준다.
  - prefix 값이 되는것은 parameters에서 설정한 <br>
    ```@org.hibernate.annotations.Parameter(name = "prefix", value = "book")``` 값이 된다. <br>
    쉽게 말하면 ```String prefix = "book"``` 가된다고 생각하자.

<br>

<h2> 적용 테스트 </h2>

```java
@Slf4j
@DataJpaTest
@Rollback(value = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class RepositoryTest {
    @Autowired
    private BookRepository bookRepository;
    @Test
    void saveBook() {
        Book book = new Book("spring in action", "john doe");
        Book save = bookRepository.save(book);
        log.info("save = {}", save);
    }
}
```

```text
save = Book{isbn='book0.36651499710225977', name='spring in action', author='john doe'}
```

![custom_generator_test](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/6ce797fb-e36e-4163-86c1-ff30039d6425)

