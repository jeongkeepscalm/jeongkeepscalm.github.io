---
title: 내장 DB 설정 에러(feat.@DataJpaTest)
description: 내장 DB 에러.
date: 2024-02-18T15:30:000
categories: [ Exception, Spring ]
tags: [ spring framework, test data source ]    # TAG는 반드시 소문자로 이루어져야함!
---

- Spring boot + Spring data jpa + mysql 을 사용하여 테스트 코드 작성 중 생긴 에러
  - @DataJpaTest 를 선언하고 테스트를 작성할때 spring framework 안에 내장된 메모리 데이터베이스를 못찾아서 생기는 에러

<h2> 문제 발생 코드 </h2>

```java

@DataJpaTest
public class SpringBootJpaTestSlice {

  @Autowired
  private BookRepository bookRepository;

  @Test
  void testJpaTestSlice() {
    long countBefore = bookRepository.count();
    bookRepository.save(new Book("my book", "123210ws", "self"));
    long countAfter = bookRepository.count();
    Assertions.assertTrue(countBefore != countAfter);
  }

}

```

<h2> 에러 로그 </h2>

```text
java.lang.IllegalStateException: Failed to load ApplicationContext for [MergedContextConfiguration@a92be4f testClass = org.spring.hibernatejpa.SpringBootJpaTestSlice, locations = [], classes = [org.spring.hibernatejpa.HibernatejpaApplication], contextInitializerClasses = [], activeProfiles = [], propertySourceDescriptors = [], propertySourceProperties = ["org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTestContextBootstrapper=true"], contextCustomizers = [[ImportsContextCustomizer@53e800f9 key = [org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration, org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration, org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManagerAutoConfiguration, org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration, org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration, org.springframework.boot.autoconfigure.sql.init.SqlInitializationAutoConfiguration, org.springframework.boot.test.autoconfigure.jdbc.TestDatabaseAutoConfiguration, org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration, org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration, org.springframework.boot.autoconfigure.liquibase.LiquibaseAutoConfiguration, org.springframework.boot.autoconfigure.jdbc.JdbcClientAutoConfiguration, org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration, org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration]], org.springframework.boot.test.context.filter.ExcludeFilterContextCustomizer@2b30a42c, org.springframework.boot.test.json.DuplicateJsonObjectContextCustomizerFactory$DuplicateJsonObjectContextCustomizer@43df23d3, org.springframework.boot.test.mock.mockito.MockitoContextCustomizer@0, org.springframework.boot.test.autoconfigure.OverrideAutoConfigurationContextCustomizerFactory$DisableAutoConfigurationContextCustomizer@4d0d9fe7, org.springframework.boot.test.autoconfigure.actuate.observability.ObservabilityContextCustomizerFactory$DisableObservabilityContextCustomizer@1f, org.springframework.boot.test.autoconfigure.filter.TypeExcludeFiltersContextCustomizer@34be3d80, org.springframework.boot.test.autoconfigure.properties.PropertyMappingContextCustomizer@8a1859ac, org.springframework.boot.test.autoconfigure.web.servlet.WebDriverContextCustomizer@6a8658ff, org.springframework.boot.test.context.SpringBootTestAnnotation@5ddfe3f], contextLoader = org.springframework.boot.test.context.SpringBootContextLoader, parent = null]
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:180)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.support.DependencyInjectionTestExecutionListener.injectDependencies(DependencyInjectionTestExecutionListener.java:142)
	at org.springframework.test.context.support.DependencyInjectionTestExecutionListener.prepareTestInstance(DependencyInjectionTestExecutionListener.java:98)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:163)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1625)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.StreamSpliterators$WrappingSpliterator.forEachRemaining(StreamSpliterators.java:310)
	at java.base/java.util.stream.Streams$ConcatSpliterator.forEachRemaining(Streams.java:735)
	at java.base/java.util.stream.Streams$ConcatSpliterator.forEachRemaining(Streams.java:734)
	at java.base/java.util.stream.ReferencePipeline$Head.forEach(ReferencePipeline.java:762)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
Caused by: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'dataSourceScriptDatabaseInitializer' defined in class path resource [org/springframework/boot/autoconfigure/sql/init/DataSourceInitializationConfiguration.class]: Unsatisfied dependency expressed through method 'dataSourceScriptDatabaseInitializer' parameter 0: Error creating bean with name 'dataSource': Failed to replace DataSource with an embedded database for tests. If you want an embedded database please put a supported one on the classpath or tune the replace attribute of @AutoConfigureTestDatabase.
	at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:798)
	at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:542)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateUsingFactoryMethod(AbstractAutowireCapableBeanFactory.java:1334)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1164)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:561)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:521)
	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:325)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:234)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:323)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:312)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
	at org.springframework.context.support.AbstractApplicationContext.getBean(AbstractApplicationContext.java:1231)
	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:949)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:624)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:754)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:456)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:334)
	at org.springframework.boot.test.context.SpringBootContextLoader.lambda$loadContext$3(SpringBootContextLoader.java:137)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:58)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:46)
	at org.springframework.boot.SpringApplication.withHook(SpringApplication.java:1454)
	at org.springframework.boot.test.context.SpringBootContextLoader$ContextLoaderHook.run(SpringBootContextLoader.java:552)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:137)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:108)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:225)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:152)
	... 17 more
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'dataSource': Failed to replace DataSource with an embedded database for tests. If you want an embedded database please put a supported one on the classpath or tune the replace attribute of @AutoConfigureTestDatabase.
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1773)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:599)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:521)
	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:325)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:234)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:323)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)
	at org.springframework.beans.factory.config.DependencyDescriptor.resolveCandidate(DependencyDescriptor.java:254)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.doResolveDependency(DefaultListableBeanFactory.java:1443)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.resolveDependency(DefaultListableBeanFactory.java:1353)
	at org.springframework.beans.factory.support.ConstructorResolver.resolveAutowiredArgument(ConstructorResolver.java:907)
	at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:785)
	... 43 more
Caused by: java.lang.IllegalStateException: Failed to replace DataSource with an embedded database for tests. If you want an embedded database please put a supported one on the classpath or tune the replace attribute of @AutoConfigureTestDatabase.
	at org.springframework.util.Assert.state(Assert.java:76)
	at org.springframework.boot.test.autoconfigure.jdbc.TestDatabaseAutoConfiguration$EmbeddedDataSourceFactory.getEmbeddedDatabase(TestDatabaseAutoConfiguration.java:188)
	at org.springframework.boot.test.autoconfigure.jdbc.TestDatabaseAutoConfiguration$EmbeddedDataSourceFactoryBean.afterPropertiesSet(TestDatabaseAutoConfiguration.java:153)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1820)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1769)
	... 54 more

```

<br>

<h2> 해결법 1 </h2>

- 테스트에 사용되는 db를 따로 분리하지 않고 사용할 경우 <br>
  ```@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)``` <br>
  해당 어노테이션을 클래스 레벨에 설정함으로써 해결 가능(테스트 환경을 내장된 데이터 베이스로 하지 않겠다는 선언).

```java

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class SpringBootJpaTestSlice {

  @Autowired
  private BookRepository bookRepository;

  @Test
  void testJpaTestSlice() {
    long countBefore = bookRepository.count();
    bookRepository.save(new Book("my book", "123210ws", "self"));
    long countAfter = bookRepository.count();
    Assertions.assertTrue(countBefore != countAfter);
  }

}
```

<h2> 해결법 2 </h2>

- 테스트에 사용되는 db를 따로 분리하여 사용하고 싶은 경우 <br>
  위에서 설명한것과 같이 내장된 데이터 베이스 사용을 해제하고 바라보는 설정을 test 환경에 맞는 설정으로 바꿔주면 된다

application-test.yaml

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/jpa_test # 테스트용 데이터 베이스
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: create-drop
    open-in-view: false
    properties:
      hibernate:
        show_sql: true
        format_sql: true

logging:
  pattern:
    console: "%boldWhite(%d{yyyy-MM-dd HH:mm:ss.SSS}) %boldMagenta([%thread]) %highlight([%-5level]) %boldGreen([%logger{100}]) - %msg %n"
  level:
    org:
      hibernate:
        type:
          descriptor:
            sql: trace

```

```java

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class SpringBootJpaTestSlice {
  @Autowired
  private BookRepository bookRepository;

  @Test
  void testJpaTestSlice() {
    long countBefore = bookRepository.count();
    bookRepository.save(new Book("my book", "123210ws", "self"));
    long countAfter = bookRepository.count();
    Assertions.assertTrue(countBefore != countAfter);
  }
}
```

<br>

<h2> 수정 코드 </h2>

- 해당 설정은 테스트 코드 작성시마다 선언해야 함으로 공통 코드로 분리

```java

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public abstract class Common {
}
```

```java
public class SpringBootJpaTestSlice extends Common {

  @Autowired
  private BookRepository bookRepository;

  @Test
  void testJpaTestSlice() {
    long countBefore = bookRepository.count();
    bookRepository.save(new Book("my book", "123210ws", "self"));
    long countAfter = bookRepository.count();
    Assertions.assertTrue(countBefore != countAfter);
  }

}
```
