---
title: "[CI/CD] With Gitlab, Jenkins"
description: "[CI/CD] With Gitlab, Jenkins"
date: 2024-10-24
categories: [ DevOps, CICD ]
tags: [ DevOps, CICD ]
---

***env***  
- 도커로 깃랩, 젠킨스 컨테이너 active
- web에 깃랩, 젠킨스 접속 가능

<hr>

## 깃랩, 젠킨스 연동 순서

1. 깃랩 프로젝트 생성
2. 생성된 깃랩 프로젝트와 application 소스코드 연결(port 번호 추가된 url)
3. 깃랩 personal access token 발급
4. 젠킨스에 깃랩 플러그인 설치
5. 젠킨스 Credential 발급(personal access token 사용)  
  - Username with password  
    Username: 깃랩 아이디  
    password: personal access token  
    ID는 별도로 지정하지 않는다.   
6. 젠킨스 파이프라인 생성(add item)
  - Build Triggers: Build when a change is pushed to GitLab. GitLab webhook URL: http://123.123.123.123:8080/project/test
  - Secret token 생성
  - 파이프라인 스크립트는 임시로 Hello World 로 해놓고 넘어간다. 
7. 깃랩 Webhook 설정
  - 젠킨스에서 파이프라인 생성시 설정된 URL, Secret token 사용
8. webhook 이 잘 설정되었다면, 파이프라인 스크립트 작성  
  
***깃랩, 젠킨스 연동할 때, 생긴 이슈***   
- webhook 설정 시, invalid URL given 에러 발생  
  admin > settings > network > Outbound requests  
  Allow requests to the local network from webhooks and integrations 체크 설정 필요

<hr>

## 파이프라인 스크립트 작성 시, 생긴 이슈들   

- <span style="color:red">credential 관련 오류</span>
  - credential 발급 시, GitLab API Token 으로 발급을 받았었는데, 해당 credential 인식이 불가능하여, Username with password 형식의 credential을 발급받아 적용  
  
- <span style="color:red">ERROR: Couldn't find any revision to build. Verify the repository and branch configuration for this job. ERROR: Maximum checkout retry attempts reached, aborting</span>
  - main 브랜치 생성
  
- <span style="color:red">FAILURE: Build failed with an exception.Where: Settings file '/var/jenkins_home/workspace/test1/settings.gradle' What went wrong: Could not compile settings file '/var/jenkins_home/workspace/test1/settings.gradle'. startup failed: General error during semantic analysis: Unsupported class file major version 61 java.lang.IllegalArgumentException: Unsupported class file major version 61</span>
  - Gradle version, Java version 이 호환이 안될 때 생기는 에러
  - 
    ```bash
    docker exec -it jenkins /bin/bash
    apt-get update
    apt-get install -y openjdk-17-jdk
    
    update-alternatives --config java
    
    pipeline
    JAVA_HOME = '/usr/lib/jvm/java-17-openjdk-amd64' // Java 17 경로 설정
    PATH = "${JAVA_HOME}/bin:${env.PATH}"
    ```

  - JDK 17 설치 후, 해당 버전에 호환되는 Gradle 젠킨스 컨테이너에 설치
  - 호환이 잘 되는 버전으로 맞춰도 해당 이슈 해결을 못해서 로그 출력 스크립트 추가

  - 
    ```js 
    stage('Build') {
      steps {
          sh 'chmod +x ./gradlew'
          sh './gradlew clean build --stacktrace' // 상세 로그 출력
      }
    }
    ```
  - 로그로 원인 파악한 후 권한 추가
  - 
    ```bash
    chown -R jenkins:jenkins /var/jenkins_home/workspace/test1
    chmod -R 755 /var/jenkins_home/workspace/test1
    ```
  


