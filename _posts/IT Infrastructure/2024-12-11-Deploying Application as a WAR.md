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
