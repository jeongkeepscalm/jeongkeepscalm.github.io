---
title: Spring 테스트 코드, @Commit, @Rollback
description: 테스트 코드, 트랜잭션 관리
date: 2024-02-18T16:20:000
categories: [ Spring, Test Code ]
tags: [ back-end, spring, test code, transaction, rollback, commit ]
---

- 스프링에서 테스트 코드를 작성시 ```@Rollback(true)``` 해당 옵션이 기본 설정임. <br>
  해당 설정은 메소드와 클래스 레벨에서 기본 설정으로 되어 있음. <br>
  개별 테스트가 끝난후 롤백, 전체 테스트가 끝난후 클래스 래밸에서 롤백 시킴.

```java

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SpringBootJpaTestSliceTest extends Common {

  @Autowired
  private BookRepository bookRepository;

  @Test
  @Order(1)
  void testJpaTestSlice() {
    long countBefore = bookRepository.count();
    Assertions.assertEquals(countBefore, 0L);
    bookRepository.save(new Book("my book", "123210ws", "self"));
    long countAfter = bookRepository.count();
    Assertions.assertTrue(countBefore != countAfter);
    Assertions.assertEquals(countAfter, 1L);
  }

  @Test
  @Order(2)
  void testJpaTestSpliceTransaction() {
    long count = bookRepository.count();
    Assertions.assertEquals(count, 1L);
  }

}
```

- 위와 같은 코드가 있을때 첫번째 테스트는 통과하지만 두번째 테스트는 통과하지 못함.

![image](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/e32c2c30-4c2b-4513-b93d-8cd14a2d9c89)

<br>


<h2> @Rollback </h2>

- 변경 사항을 되돌리는 어노테이션 : ```import org.springframework.test.annotation.Rollback```
  - @Rollback(value = false) : 롤백 기능을 off
  - @Rollback(value = true) : 롤백 기능을 on (기본 설정)

<h2> @Commit </h2>

- 변경 사항을 적용시키는 어노테이션 : ```import org.springframework.test.annotation.Commit```
  - 코드를 보면 @Rollback(false)가 되어 있는걸 볼 수 있다.

```java

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Rollback(false)
public @interface Commit {
}
```

<h2> 수정 코드 </h2>

```java
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SpringBootJpaTestSliceTest extends Common {

    @Autowired
    private BookRepository bookRepository;

    @Test
    @Commit
    @Order(1)
    void testJpaTestSlice() {
        long countBefore = bookRepository.count();
        Assertions.assertEquals(countBefore, 0L);
        bookRepository.save(new Book("my book", "123210ws", "self"));
        long countAfter = bookRepository.count();
        Assertions.assertTrue(countBefore != countAfter);
        Assertions.assertEquals(countAfter, 1L);
    }

    @Test
    @Order(2)
    void testJpaTestSpliceTransaction() {
        long count = bookRepository.count();
        Assertions.assertEquals(count, 1L);
    }

}
```
