---
title: Deploying Application as a WAR
description: Deploying Application as a WAR
date: 2024-12-11
categories: [ IT Infrastructure ]
tags: [ IT Infrastructure ]
---

# ***우분투 서버에 애플리케이션 배포***

### ***톰캣 설치***

```bash
sudo apt-get update
sudo apt-get install tomcat9 tomcat9-admin

sudo systemctl restart tomcat9.service
sudo systemctl status tomcat9.service
```

### ***ERROR***

- "No JDK or JRE found - Please set the JAVA_HOME variable or install the default-jdk package"

```bash
# Java 설치 경로 확인
sudo update-java-alternatives -l

# Java 설치 경로 세팅
sudo vim /etc/environment
JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"

# 환경 변수 파일 적용
source /etc/environment

# 톰캣 서비스 파일 수정
sudo vim /lib/systemd/system/tomcat9.service 
Environment=JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# systemd 데몬 리로드하여 서비스 파일 반영
sudo systemctl daemon-reload

# 톰캣 재시작
sudo systemctl restart tomcat9.service
```

### ***로그***

```bash
# tomcat9 서비스와 관련된 로그 메시지를 출력
sudo journalctl -u tomcat9.service

# 실시간 로그 출력
tail -f /var/log/tomcat9/catalina.out
```

### ***⭐​중요***

- war 파일 생성
  - Project Settings > Artifacts > + > Web Application: Archive
  - Build > Build Artifacts > Build
  
- `/var/log/tomcat9/`
  - 톰캣 로그 확인
- `/var/lib/tomcat9/webapps/`
  - 애플리케이션 war 파일 경로
  - war파일명을 ROOT.war로 변경 필요
- `/etc/tomcat9/server.xml`
  - 톰캣 설정 파일(포트 변경 등..)
  - e.g. 
    ```xml
    <Context path="/" docBase="/var/lib/tomcat9/webapps/ROOT.war" reloadable="true" />
    ```

### ***톰캣 내 여러 애플리케이션 배포***

<details>
<summary><span style="color:orange" class="point"><b>server.xml</b></span></summary>
<div markdown="1">

  ```xml
    <?xml version="1.0" encoding="UTF-8"?>

    <Server port="-1" shutdown="SHUTDOWN">
      <Listener className="org.apache.catalina.startup.VersionLoggerListener" />

      <Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on" />
      <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" />
      <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" />
      <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener" />


      <GlobalNamingResources>
        <Resource name="UserDatabase" auth="Container"
                  type="org.apache.catalina.UserDatabase"
                  description="User database that can be updated and saved"
                  factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
                  pathname="conf/tomcat-users.xml" />
      </GlobalNamingResources>

      <Service name="Catalina">
        <Connector port="8090" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />

        <Engine name="Catalina" defaultHost="localhost">

          <Realm className="org.apache.catalina.realm.LockOutRealm">
            <Realm className="org.apache.catalina.realm.UserDatabaseRealm" resourceName="UserDatabase"/>
          </Realm>

          <Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">
            <Context path="" docBase="TEST1" reloadable="true" />
            <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs" 
              prefix="localhost_access_log_8090" suffix=".txt" 
              pattern="%h %l %u %t &quot;%r&quot; %s %b" />
          </Host>
        </Engine>
      </Service>


      <Service name="Catalina2">

        <Connector port="8091" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />

        <Engine name="Catalina2" defaultHost="localhost">

          <Realm className="org.apache.catalina.realm.LockOutRealm">
            <Realm className="org.apache.catalina.realm.UserDatabaseRealm" resourceName="UserDatabase"/>
          </Realm>

          <Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">

            <Context path="" docBase="TEST2" reloadable="true" />

            <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
              prefix="localhost_access_log_8091" suffix=".txt"
              pattern="%h %l %u %t &quot;%r&quot; %s %b" />
          </Host>

        </Engine>

      </Service>

    </Server>

  ```

</div>
</details>