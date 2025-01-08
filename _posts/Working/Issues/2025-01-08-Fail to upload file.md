---
title: "[Issue] Fail to upload file in Ubuntu Server"
description: "[Issue] Fail to upload file in Ubuntu Server"
date: 2025-01-08
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

***⚠️ 이슈 사항***  
설정된 파일 업로드 폴더가 톰캣 폴더 내부로 되어 있어, 재배포시 이전에 업로드되었던 파일이 휘발되었다.  
```java
// 설정된 파일 업로드 경로
request.getSession().getServletContext().getRealPath("/");  
```

<br>

**📖 Info**  
  Tomcat이 우분투와 같은 리눅스 시스템에서 systemd에 의해 관리될 경우, Tomcat 프로세스가 샌드박스화되어 특정 디렉토리만 쓰기 권한을 가지는 설정이 기본적으로 적용된다.  
  ```text
    /etc/tomcat9/Catalina  
    /var/log/tomcat9  
    /var/lib/tomcat9/webapps  
    /var/cache/tomcat9  
  ```

<br>

✅ Solution
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


