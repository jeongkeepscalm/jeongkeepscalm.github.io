---
title: "[Issue] Fail to upload file"
description: "[Issue] Fail to upload file"
date: 2025-01-08
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

***⚠️ Issue***  
매우 작은 파일만 업로드되고 그렇지 않은 파일들은 업로드 실패  
실시간 로그에도 뜨지 않는 상황  

<br>

✅ Solution  

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

<br/>

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

<hr>
<br/>

***⚠️ Issue***  
설정된 파일 업로드 폴더가 톰캣 폴더 내부로 되어 있어, 우분투 서버에 재배포시 이전에 업로드되었던 파일이 휘발되었다.  
```java
// 설정된 파일 업로드 경로
request.getSession().getServletContext().getRealPath("/");  
```

<br>

**📖 Info**  
  Tomcat이 우분투와 같은 리눅스 시스템에서 systemd에 의해 관리될 경우, Tomcat 프로세스가 샌드박스화되어 특정 디렉토리만 쓰기 권한을 가지는 설정이 기본적으로 적용된다. 아래는 기본적으로 톰캣에 쓰기 권한이 부여된 폴더이다. 
  ```text
  /etc/tomcat9/Catalina  
  /var/log/tomcat9  
  /var/lib/tomcat9/webapps  
  /var/cache/tomcat9  
  ```

<br>

✅ Solution  
서비스에 등록되어 있을 경우, 톰캣에 쓰기 권한이 부여되지 않은 폴더 외에, 업로드 경로로 사용할 폴더를 설정 파일에 지정해야 한다.
```bash
# 톰캣 서비스 파일 위치 확인
cat /lib/systemd/system/tomcat9.service

# 시스템 서비스 파일을 복사하여 사용자 정의로 수정
sudo cp /lib/systemd/system/tomcat9.service /etc/systemd/system/tomcat9.service

# 복사된 서비스 파일 수정
sudo vim /etc/systemd/system/tomcat9.service

# [Service] 섹션에 아래 속성 추가
ReadWritePaths=/upload

# systemd 데몬 재로드, tomcat service 재시작
sudo systemctl daemon-reload
sudo systemctl restart tomcat9
```
