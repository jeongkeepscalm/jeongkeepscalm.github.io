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
  
credential 발급 시, GitLab API Token 으로 발급을 받았었는데, 해당 credential 인식이 불가능하여, Username with password 형식의 credential을 발급받아 적용  
  
- <span style="color:red">ERROR: Couldn't find any revision to build. Verify the repository and branch configuration for this job. ERROR: Maximum checkout retry attempts reached, aborting</span>  
  
main 브랜치 생성  
  
- <span style="color:red">FAILURE: Build failed with an exception.Where: Settings file '/var/jenkins_home/workspace/test1/settings.gradle' What went wrong: Could not compile settings file '/var/jenkins_home/workspace/test1/settings.gradle'. startup failed: General error during semantic analysis: Unsupported class file major version 61 java.lang.IllegalArgumentException: Unsupported class file major version 61</span>  
  
Gradle version, Java version 이 호환이 안될 때 생기는 에러

```bash
docker exec -it jenkins /bin/bash
apt-get update
apt-get install -y openjdk-17-jdk

update-alternatives --config java
```

```js 
  // pipeline
  JAVA_HOME = '/usr/lib/jvm/java-17-openjdk-amd64' // Java 17 경로 설정
  PATH = "${JAVA_HOME}/bin:${env.PATH}"
```

JDK 17 설치 후, 해당 버전에 호환되는 Gradle 젠킨스 컨테이너에 설치  
호환이 잘 되는 버전으로 맞춰도 해당 이슈 해결을 못해서 로그 출력 스크립트 추가  

```js 
stage('Build') {
  steps {
      sh 'chmod +x ./gradlew'
      sh './gradlew clean build --stacktrace' // 상세 로그 출력
  }
}
```

로그로 원인 파악한 후 권한 추가  

```bash
chown -R jenkins:jenkins /var/jenkins_home/workspace/test1
chmod -R 755 /var/jenkins_home/workspace/test1
```

- <span style="color:red">FAILURE: Build failed with an exception. What went wrong: Execution failed for task ':test'. There were failing tests. See the report at: file:///var/jenkins_home/workspace/test1/build/reports/tests/test/index.html. Try: Run with --scan to get full insights.</span>  
  
```js
stage('Build') {
    steps {
        // -x test 추가: 테스트를 실행하지 않는다.
        sh 'chmod +x ./gradlew'
        sh './gradlew clean build --stacktrace -x test' 
    }
}
```

- <span style="color:red">Warning: Identity file /home/ojg/.ssh/id_rsa not accessible: No such file or directory. ssh: connect to host 123.123.123.123 port 22: Connection timed out. scp: Connection closed</span>
  
```bash
sudo ufw status
sudo ufw allow 22
sudo ufw reload

docker exec -it jenkins /bin/bash
ssh -i /home/ojg/.ssh/id_rsa ojg@123.123.123.123
```

- <span style="color:red">+ scp -i /home/ojg/.ssh/id_rsa build/libs/test.war ojg@123.123.123.123:/home/ojg/myFirstProject Warning: Identity file /home/ojg/.ssh/id_rsa not accessible: No such file or directory. Permission denied, please try again. ojg@123.123.123.123: Permission denied (publickey,password). scp: Connection closed</span>
  
```bash
# 젠킨스 내 ssh 키 파일 생성 필요
cat /var/jenkins_home/.ssh/id_rsa.pub | ssh ojg@123.123.123.123 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'

# id_rsa 파일 확인
/var/jenkins_home/.ssh/id_rsa
```

- <span style="color:red">+ scp -i /var/jenkins_home/.ssh/id_rsa build/libs/test.war ojg@123.123.123.123:/home/ojg/myFirstProject. scp: stat local "build/libs/test.war": No such file or directory</span>
  
```yml
# application 프로젝트 내 build.gradle 파일에 코드 추가
# 임의로 정한 war명인 test를 파이프라인 스크립트에도 명시해주어야 한다.  
bootWar {
  archiveFileName = 'test.war'
}
```

- <span style="color:red">EOF: command not found</span>
  
배포 스크립트 내 sh """ -> sh ''' 로 수정

- <span style="color:red">배포 성공했으나, 웹에서 접속 불가</span>
  
```bash
# application 포트 추가
sudo ufw status
sudo ufw allow 8888
sudo ufw reload

# 프로젝트 로그 확인(nohup: failed to run command 'java': No such file or directory 에러 발생) 
cat /home/ojg/myFirstProject/app.log

# 포트 추가 하였으나, 동일 에러 발생
# 우분투에 자바 설치 필요(젠킨스 컨테이너에만 자바 설치한 상태)
ssh -i /var/jenkins_home/.ssh/id_rsa ojg@123.123.123.123
java -version

sudo apt-get update
sudo apt-get install -y openjdk-17-jdk

echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```


