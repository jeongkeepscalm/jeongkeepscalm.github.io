---
title: "Spring Setting"
description: "Spring Setting"
date: 2024-12-04
categories: [ Spring, Spring Settings ]
tags: [ Spring, Spring Settings ]
---

# ***그룹웨어 소스(스프링) 빌드 시행착오 정리 ***

### ***환경***

- java 1.8
- Apache Tomcat/6.0.53 -> 9.0.97
- servlet-api 2.5 -> 4.0.1

<br>
<hr>

### ***java version 확인***

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
> **톰캣 6.0.53 버전으로 변경**  

<br>
<hr>

### ***maven***

- maven 설치했지만 빌드 오류발생
  - Downgrade Maven to version 3.8.1 or earlier in settings
  
- **낮은 버전으로 maven 재설치 -> 인텔리제이 settings -> maven 에 재설정**  

<br>
<hr>

### ***web.xml***

- 빨간줄 에러: cannot find declaration to go
  - servlet.JspServlet
  - catalina.servlets.DefaultServlet
  
- **라이브러리 추가**
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

Apache Tomcat/6.0.53 -> 9.0.97
servlet-api 2.5 -> 4.0.1

<br>
<hr>

### ***DB Connestion 실패***

- JNDI 방식으로 코드가 구현되어 있었으나, 지속되는 커넥션 실패
	- server.xml 
		- GlobalNamingResources 태그 내에 resource 태그를 정의되어 있었음
	- ***JNDI -> DBCP 변환***
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


