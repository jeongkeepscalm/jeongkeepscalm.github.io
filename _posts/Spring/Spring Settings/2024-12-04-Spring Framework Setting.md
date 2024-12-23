---
title: "Spring Framework Setting"
description: "Spring Framework Setting"
date: 2024-12-04
categories: [ Spring, Spring Settings ]
tags: [ Spring, Spring Settings ]
---

# ***그룹웨어 소스(SpringFramework) 빌드 시행착오 정리***

### ***환경***

| 항목            | 버전                  |
|-----------------|-----------------------|
| Java 버전       | 1.8                   |
| 빌드 도구       | Apache Maven 3.6.3    |
| 서버            | Apache Tomcat 6.0.53 → 9.0.97 |
| 서블릿 API      | Servlet-api 2.5 → 4.0.1 |
| DB              | MariaDB/10.4.12      |
| 템플릿 엔진     | JSP                   |

<br>
<hr>

### ***java version 확인***

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
            </configuration>
        </plugin>
    </plugins>
</build>
```

<br>
<hr>

### ***톰캣 버전 결정할 서블릿 api 버전 확인***

```xml
<dependency>
	<groupId>javax.servlet</groupId>
	<artifactId>servlet-api</artifactId>
	<scope>provided</scope>
	<version>2.5</version>
</dependency>
```
> 서블릿 2.5: Tomcat 5.5.x, 6.x    
> 서블릿 3.0: Tomcat 7.x    
> 서블릿 3.1: Tomcat 8.0.x, 8.5.x    
> 서블릿 4.0: Tomcat 9.x    
> 서블릿 5.0: Tomcat 10.x    
  
✅ 해결 방법  
톰캣 6.0.53 버전으로 변경  

<br>
<hr>

### ***maven***

- maven 설치했지만 빌드 오류발생
  - Downgrade Maven to version 3.8.1 or earlier in settings
  
✅ 해결 방법  
낮은 버전으로 maven 재설치 → 인텔리제이 settings → maven 에 재설정  

<br>
<hr>

### ***web.xml***

- 빨간줄 에러: cannot find declaration to go
  - servlet.JspServlet
  - catalina.servlets.DefaultServlet
  
✅ 해결 방법  
- 프로젝트 우클릭 > Modules > dependencies > + > library 추가 
  - catalina.jar
  - jasper.jar
  - jsp-api.jar

<br>
<hr>

### ***로그 관련 중복 라이브러리 삭제***

***2개 이상의 jar 파일이 중복 사용되어 아래 로그 출력***  

```log
SLF4J: Found binding in [jar:file:/C:/Users/ojg01/.m2/repository/org/apache/logging/log4j/log4j-slf4j-impl/2.12.4/log4j-slf4j-impl-2.12.4.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/C:/Users/ojg01/.m2/repository/ch/qos/logback/logback-classic/1.2.3/logback-classic-1.2.3.jar!/org/slf4j/impl/StaticLoggerBinder.class]	
SLF4J: Class path contains multiple SLF4J bindings. 
```

<br>
<hr>

### ***계속되는 빌드 실패로 인한 버전 업***

✅ 해결 방법  
- Apache Tomcat/6.0.53 → 9.0.97
- servlet-api 2.5 → 4.0.1

<br>
<hr>

### ***DB Connestion 실패***

- JNDI 방식으로 코드가 구현되어 있었으나, 지속되는 커넥션 실패
	- server.xml 
		- GlobalNamingResources 태그 내에 resource 태그를 정의되어 있었음
  
✅ 해결 방법  
- ***JNDI → DBCP 변환***
  - dbcp 의존성 추가
  - context-datasource.xml 파일에 DB 정보를 담은 bean 생성

<br>
<hr>

### ⭐​ ***개념 정리: JDBC, DBCP, JNDI***  

- JDBC(Java DataBase Connectivity)
	- 인터페이스 기반 구축(데이터베이스 커넥션 인터페이스)
	- Database Pool 방식을 사용하지 않고 DB에서 정보를 가져올 때마다 DB Connection을 열고 닫음(비효율적)
- DBCP(DataBase Connection Pool)
	- Connection 객체를 만들어 Pool에 넣어놓은 채 필요할 때마다 가져다 쓰고 다시 반납하는 방식
	- 자주 사용하는 방식
- JNDI(Java Naming and Directory Interface)
	- WAS단에 DB Connection 자체를 미리 네이밍해두는 방식
	- DB Connection을 WAS단에서 제어하면서 서버에서 하나의 Connection Pool을 가진다.
	- Application이 DB에 직접 Connection을 요청하는 것이 아니라 JNDI lookup을 통해 Datasource 객체를 획득하고 그것을 Connection 요청

<br>
<hr>

### ***error: maven-default-http-blocker***

- Original error: Could not transfer artifact org.springframework:spring-jdbc:pom:${org.springframework-version} from/to maven-default-http-blocker (http://0.0.0.0/): Blocked mirror for repositories: [egovframe (http://www.egovframe.go.kr/maven/, default, releases), egovframe2 (http://maven.egovframe.kr:8080/maven/, default, releases), oracle (http://maven.jahia.org/maven2, default, releases+snapshots)]

✅ 해결 방법  
```xml
<repository>
    <id>egovframe</id>
    <!-- 
      기존 url 
      <url>http://maven.egovframe.kr:8080/maven/</url>
    -->
    <url>https://maven.egovframe.go.kr/maven/</url>
</repository>
```

<br>
<hr>

### ***쿼리 로그 추가***

- datasource-context.xml 설정 값 변경  
  ```xml
  <property name="driverClassName" value="net.sf.log4jdbc.sql.jdbcapi.DriverSpy"></property>
  <property name="url" value="jdbc:log4jdbc:mariadb://127.0.0.1:3306/디비명" /> 
  ```
- log4jdbc.log4j2.properties 파일 생성 및 설정(resource 폴더 밑에 추가)  
  ```properties
  log4jdbc.spylogdelegator.name=net.sf.log4jdbc.log.slf4j.Slf4jSpyLogDelegator
  log4jdbc.drivers=org.mariadb.jdbc.Driver
  ```
- log4j.xml 설정 추가  
  ```xml
  <logger name="jdbc.sqlonly" additivity="false"> 
    <appender-ref ref="console"/> 
  </logger>
  <logger name="jdbc.sqltiming" additivity="false">
    <appender-ref ref="console"/> 
  </logger>
  <logger name="jdbc.audit" additivity="false"> 
    <appender-ref ref="console"/> 
  </logger> 

  <logger name="jdbc.resultset" additivity="false">
    <appender-ref ref="console"/> 
  </logger>

  <logger name="jdbc.resultsettable" additivity="false"> 
    <appender-ref ref="console"/> 
  </logger>
  ```

<br>
<hr>

### ***View Return 방식***

- 해당 코드는 컨트롤러에서 String 타입의 템플릿 엔진 경로가 아닌 Model을 리턴하여, view가 어떻게 지정되고 다음 프로세스로 넘어가는지 이해하기 어려웠다.
  
✅ 원인 파악 완료  

```xml
<!-- dispatcher-servlet.xml -->
<bean class="org.springframework.web.servlet.view.UrlBasedViewResolver" p:order="1"
  p:viewClass="org.springframework.web.servlet.view.JstlView"
  p:prefix="/WEB-INF/jsp/" p:suffix=".jsp"/>
```
> UrlBasedViewResolver 방식을 사용하여 view 리턴 방식을 지정  

<br>
<hr>

### ***xml 파일 내 정의되어 있지 않은 빈 참조***

- resources/a/b 폴더 내 여러 xml 파일들이 존재했다. 특정 xml에서 빈을 정의 하고 다른 xml파일에서 해당 빈을 참조하는 코드가 많았는데 모두 빨간색 텍스트로 보였다. 에러인줄알고 각 xml에다 빈이 정의되어있는 파일을 import 했었으나 그럴 필요가 없었다.  

```xml
<!-- web.xml -->
<context-param>
  <param-name>contextConfigLocation</param-name>
  <param-value>classpath*:a/b/context-*.xml</param-value>
</context-param>
```
> `<context-param>`: Spring의 애플리케이션 컨텍스트 설정 파일을 정의하여 여러 개의 XML 파일이 하나의 애플리케이션 컨텍스트로 로드한다.

<br>
<hr>

### ⭐ ***프로젝트 구조***

- <img src="/assets/img/groupware/1.png" width="400px" />
  - .idea
    - IntelliJ IDEA IDE 설정 파일 저장
    - 프로젝트 구조, 실행 구성, 코드 스타일 등의 정보 포함
    - 프로젝트 설정이 변경될 때, 자동으로 업데이트
  - .smarttomcat
    - Smart Tomcat 플러그인 관련 설정 파일이 저장
    - 버전 관리 시스템에서 추적되지 않아 변경사항은 로컬 환경에만 적용
  - src
    - 프로젝트의 소스 코드와 리소스 파일이 저장되는 메인 디렉토리
  - target
    - 컴파일된 클래스 파일과 빌드 결과물이 저장
  - gw-dev.iml
    - IntelliJ IDEA 프로젝트 모듈 설정 파일
    - IntelliJ IDEA가 자동으로 생성
  - pom.xml
    - Maven 프로젝트 설정 파일로, 프로젝트의 의존성과 빌드 설정을 정의
  - .setting: Eclipse IDE 설정 파일 저장
  - .classpath: Eclipse 프로젝트의 클래스패스 설정 파일
  - .project: Eclipse 프로젝트 설정 파일
  
- ***src/main/webapp/WEB-INF/web.xml***
  1. 서블릿 및 URL 매핑 정의
  2. 리스너 클래스 등록
  3. 필터 설정
  4. 에러 페이지 지정
  5. 세션 타임아웃 설정
  - DispatcherServlet 설정: Spring MVC의 핵심 서블릿을 정의하고 관련 설정 파일을 로드
  - ContextLoaderListener: 애플리케이션 컨텍스트를 로드하는 리스너를 등록
  - Sitemesh 설정: 레이아웃 관리를 위한 Sitemesh 필터를 정의하고 관련 설정 파일을 지정
  - 기타 XML 설정 파일: 보안, 데이터베이스 연결 등 다양한 설정 파일 위치를 지정하여 로드
  
- ***dispatcher-servlet.xml***
  - 컴포넌트 스캔 설정: 특정 패키지를 지정하여 컨트롤러를 스캔
  - 뷰 리졸버 설정
  - 인터셉터 설정
  - 예외 처리
  - 파일 업로드 설정
  - 스케줄러 설정
  
- ***sitemesh.xml***
  - 페이지 레이아웃을 관리
  - 데코레이터 설정
    - 데코레이터: 페이지의 공통 레이아웃을 정의하는 템플릿

<br>
<hr>

### ***error: 파일 업로드 실패 ***

- 매우 작은 파일만 업로드되고 그렇지 않은 파일들은 업로드 실패
- 실시간 로그에도 뜨지 않는 상황
  
✅ 해결 방법  

```xml
<!-- log4j2.xml -->
<File name="file_appender" fileName="/tmp/test-log.log">
    <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n"/>
</File>

<Logger name="org.springframework.web.multipart" level="DEBUG" additivity="false">
    <AppenderRef ref="console_appender"/>
    <AppenderRef ref="file_appender"/>
</Logger>
<Logger name="org.springframework.web" level="DEBUG" additivity="false">
    <AppenderRef ref="console_appender"/>
    <AppenderRef ref="file_appender"/>
</Logger>
```
> 파일관련 로그를 추가하여 원인 파악  
  
```xml
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
    <property name="maxUploadSize" value="1048576000" />
    <property name="uploadTempDir" ref="uploadDirResource" />
</bean>

<bean id="uploadDirResource" class="org.springframework.core.io.FileSystemResource">
    <constructor-arg>
      <value>/a/b</value>
    </constructor-arg>
</bean>
```
> 로그 확인 결과, 임시 업로드 폴더 /a/b에 권한이 없어 업로드가 되고 있지 않은 상황   
> /a/b 에 쓰기 권한이 부여되어있어야 했다.  
> 모든 권한이 열려있는 폴더로 변경하여 문제 해결 완료  

