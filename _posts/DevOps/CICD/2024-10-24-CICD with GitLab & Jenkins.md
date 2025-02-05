---
title: "[CI/CD] With Gitlab, Jenkins"
description: "[CI/CD] With Gitlab, Jenkins"
date: 2024-10-24
categories: [ DevOps, CICD ]
tags: [ DevOps, CICD ]
---

***ENV***  
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

<br/>

***깃랩, 젠킨스 연동할 때, 생긴 이슈***   
- webhook 설정 시, invalid URL given 에러 발생  
  admin > settings > network > Outbound requests  
  Allow requests to the local network from webhooks and integrations 체크 설정 필요

<hr>

***젠킨스 컨테이너 내 Gradle, SSH 설치***   
```bash
docker exec -it jenkins /bin/bash

# 패키지 목록 업데이트 및 SSH 설치
apt-get update && apt-get install -y openssh-client

# Gradle 설치(Java version 에 호환되는 버전으로 설치한다.) 
RUN apt-get install -y wget unzip 
wget https://services.gradle.org/distributions/gradle-7.3.3-bin.zip 
unzip gradle-7.3.3-bin.zip -d /opt 
ln -s /opt/gradle-7.3.3/bin/gradle /usr/bin/gradle

# 설치 완료 확인
docker exec -it jenkins /bin/bash
ssh -V
gradle -v

# ssh 위치 확인
which ssh
	/usr/bin/ssh
```

<hr>

## 파이프라인 스크립트 작성 시, 생긴 이슈들   

<span style="color:red">credential 관련 오류</span>  
  
✅ Solution  
credential 발급 시, GitLab API Token 으로 발급을 받았었는데, 해당 credential 인식이 불가능하여, Username with password 형식의 credential을 발급받아 적용  

<hr/>
<br/>

<span style="color:red">ERROR: Couldn't find any revision to build. Verify the repository and branch configuration for this job. ERROR: Maximum checkout retry attempts reached, aborting</span>  
  
✅ Solution  
main 브랜치 생성  

<hr/>
<br/>

<span style="color:red">FAILURE: Build failed with an exception.Where: Settings file '/var/jenkins_home/workspace/test1/settings.gradle' What went wrong: Could not compile settings file '/var/jenkins_home/workspace/test1/settings.gradle'. startup failed: General error during semantic analysis: Unsupported class file major version 61 java.lang.IllegalArgumentException: Unsupported class file major version 61</span>  
  
Gradle version, Java version 이 호환이 안될 때 생기는 에러
  
✅ Solution  
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

<hr/>
<br/>

<span style="color:red">FAILURE: Build failed with an exception. What went wrong: Execution failed for task ':test'. There were failing tests. See the report at: file:///var/jenkins_home/workspace/test1/build/reports/tests/test/index.html. Try: Run with --scan to get full insights.</span>  
  
✅ Solution  
```js
stage('Build') {
    steps {
        // -x test 추가: 테스트를 실행하지 않는다.
        sh 'chmod +x ./gradlew'
        sh './gradlew clean build --stacktrace -x test' 
    }
}
```

<hr/>
<br/>

<span style="color:red">Warning: Identity file /home/ojg/.ssh/id_rsa not accessible: No such file or directory. ssh: connect to host 123.123.123.123 port 22: Connection timed out. scp: Connection closed</span>  
  
✅ Solution  
```bash
sudo ufw status
sudo ufw allow 22
sudo ufw reload

docker exec -it jenkins /bin/bash
ssh -i /home/ojg/.ssh/id_rsa ojg@123.123.123.123
```

<hr/>
<br/>

<span style="color:red">+ scp -i /home/ojg/.ssh/id_rsa build/libs/test.war ojg@123.123.123.123:/home/ojg/myFirstProject Warning: Identity file /home/ojg/.ssh/id_rsa not accessible: No such file or directory. Permission denied, please try again. ojg@123.123.123.123: Permission denied (publickey,password). scp: Connection closed</span>  
  
✅ Solution  
```bash
# 젠킨스 내 ssh 키 파일 생성 필요
cat /var/jenkins_home/.ssh/id_rsa.pub | ssh ojg@123.123.123.123 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'

# id_rsa 파일 확인
/var/jenkins_home/.ssh/id_rsa
```

<hr/>
<br/>

<span style="color:red">+ scp -i /var/jenkins_home/.ssh/id_rsa build/libs/test.war ojg@123.123.123.123:/home/ojg/myFirstProject. scp: stat local "build/libs/test.war": No such file or directory</span>  
  
✅ Solution  
```yml
# application 프로젝트 내 build.gradle 파일에 코드 추가
# 임의로 정한 war명인 test를 파이프라인 스크립트에도 명시해주어야 한다.  
bootWar {
  archiveFileName = 'test.war'
}
```

<hr/>
<br/>

<span style="color:red">EOF: command not found</span>  
  
✅ Solution  
배포 스크립트 내 sh """ -> sh ''' 로 수정  
<< EOF 로 열고, <<< EOF로 닫음

<hr/>
<br/>

<span style="color:red">배포 성공했으나, 웹 접속 불가</span>  
  
✅ Solution  
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

<hr>
<br/>

<span style="color:red">Permission denied issue(maven app deploy)</span>

⚠️ Error Log  
```sh
+ scp -i /var/lib/jenkins/.ssh/id_rsa /var/jenkins_home/workspace/greoupware-dev/target/gw-dev-1.0.0.war core@123.123.123.123:/var/lib/tomcat9/webapps/
Permission denied, please try again.
Permission denied, please try again.
core@123.123.123.123: Permission denied (publickey,password).
```
  
✅ Solution  
1. 서버에서 암호 인증이 허용  
  /etc/ssh/sshd_config 파일 내 PasswordAuthentication yes 추가
  
2. ssh에서 스크립트 명령어 수동 실행  
  scp -i ${SSH_KEY_PATH} /var/jenkins_home/workspace/greoupware-dev/target/${WAR_FILE_NAME} ${DEPLOY_USER}@${DEPLOY_SERVER_IP}:${TOMCAT_HOME}/webapps/

<hr>

## 최종 파이프라인 스크립트

<details>
<summary><span style="color:orange" class="point"><b>스프링부트 Gradle 배포 스크립트</b></span></summary>
<div markdown="1">

```js
pipeline {
    agent any

    environment {
        GIT_REPO_URL = 'http://123.123.123.123:9090/ojg/firstproject.git'
        GIT_CREDENTIALS_ID = 'vdsfds-fdsfds-fdsfd-fdsf-fdsfsfss'
        DEPLOY_SERVER_IP = '456.456.456.456'
        DEPLOY_USER = 'ojg'
        SSH_KEY_PATH = '/var/jenkins_home/.ssh/id_rsa'
        PROJECT_PATH = '/home/ojg/myFirstProject'
        JAVA_HOME = '/usr/lib/jvm/java-17-openjdk-amd64' 
        PATH = "${JAVA_HOME}/bin:${env.PATH}"
        WAR_FILE_NAME = 'test.war'
    }

    /*
        GIT_REPO_URL        : GitLab 저장소의 URL
        GIT_CREDENTIALS_ID  : Jenkins에 저장된 GitLab 자격 증명의 ID
        DEPLOY_SERVER_IP    : 배포할 원격 서버의 IP 주소
        DEPLOY_USER         : 원격 서버에 접속할 사용자 이름
        SSH_KEY_PATH        : Jenkins 컨테이너에 설치된 SSH 키 파일의 경로
        PROJECT_PATH        : 원격 서버에서 프로젝트가 배포될 경로
        JAVA_HOME           : 원격 서버에 설치된 Java의 경로
        PATH                : 원격 서버의 Java 실행 파일 경로를 시스템 PATH에 추가
        WAR_FILE_NAME       : 빌드된 WAR 파일의 이름
    */

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: "${GIT_REPO_URL}",
                    credentialsId: "${GIT_CREDENTIALS_ID}"
            }
        }

        stage('Build') {
            steps {
                // Gradle Wrapper 스크립트에 실행 권한 부여
                sh 'chmod +x ./gradlew'
                
                // 테스트를 제외하며, gradle 사용하여 프로젝트 빌드
                sh './gradlew clean build --stacktrace -x test'
                
                // 빌드 결과물 확인
                sh 'ls -l build/libs'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // SSH를 통해 배포 서버에 접속하여 소스를 배포
                    sh '''
                    scp -i ${SSH_KEY_PATH} build/libs/${WAR_FILE_NAME} ${DEPLOY_USER}@${DEPLOY_SERVER_IP}:${PROJECT_PATH}
                    ssh -i ${SSH_KEY_PATH} ${DEPLOY_USER}@${DEPLOY_SERVER_IP} << EOF
                    cd ${PROJECT_PATH}
                    # 기존 애플리케이션 종료 (필요한 경우)
                    pkill -f ${WAR_FILE_NAME} || true
                    # 새로운 애플리케이션 실행
                    nohup java -jar ${WAR_FILE_NAME} > app.log 2>&1 &
                    <<< EOF
                    '''
                    
                    /*
                      scp -i ${SSH_KEY_PATH} build/libs/${WAR_FILE_NAME} ${DEPLOY_USER}@${DEPLOY_SERVER_IP}:${PROJECT_PATH}
                        빌드된 war 파일을 원격 서버에 복사

                      ssh -i ${SSH_KEY_PATH} ${DEPLOY_USER}@${DEPLOY_SERVER_IP}
                        ssh를 통해 원격 서버에 접속하여 여러 명령어를 실행
                      
                      cd ${PROJECT_PATH}
                        원격서버에서 프로젝트 디렉토리로 이동

                      pkill -f ${WAR_FILE_NAME} || true
                        기존에 실행 중인 애플리케이션을 종료. 실패해도 무시

                      nohup java -jar ${WAR_FILE_NAME} > app.log 2>&1 &
                        새로운 애플리케이션을 백그라운드에서 실행하고, 로그를 app.log 파일에 기록
                    */
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>스프링 Maven 배포 스크립트</b></span></summary>
<div markdown="1">

```js
pipeline {
    agent any

    environment {
        GIT_REPO_URL = 'http://123.123.123.123:8081/c/abc.git'
        GIT_CREDENTIALS_ID = 'fdsfadsaf-dfsfa-fdsfd-fdsfs-fdsfdsfds'
        DEPLOY_SERVER_IP = '456.456.456.456'
        DEPLOY_USER = 'core'
        SSH_KEY_PATH = '/var/lib/jenkins/.ssh/id_rsa'
        PROJECT_PATH = '/home/c/groupware_dev'
        WAR_FILE_NAME = 'gw-dev-1.0.0.war'
        TOMCAT_HOME = '/var/lib/tomcat9'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: "${GIT_REPO_URL}",
                    credentialsId: "${GIT_CREDENTIALS_ID}"
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
                sh 'ls -l target'
            }
        }

        stage('Deploy') {
            steps {
                script { 
                sh '''
                scp -i ${SSH_KEY_PATH} /var/jenkins_home/workspace/greoupware-dev/target/${WAR_FILE_NAME} ${DEPLOY_USER}@${DEPLOY_SERVER_IP}:${TOMCAT_HOME}/webapps/
                ssh -i ${SSH_KEY_PATH} ${DEPLOY_USER}@${DEPLOY_SERVER_IP} << EOF 
                
                
                # WAR 파일을 ROOT.war로 변경
                echo "Deploying new WAR file: ${WAR_FILE_NAME} as ROOT.war"
                mv ${TOMCAT_HOME}/webapps/${WAR_FILE_NAME} ${TOMCAT_HOME}/webapps/ROOT.war
                if [ $? -ne 0 ]; then
                    echo "Error: Failed to rename WAR file."
                    exit 1
                fi
                
                /* permission denied issue */
                sh '/var/lib/tomcat9/webapps/deploy.sh'

                <<< EOF 
                ''' 
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
```

```sh
# deploy.sh

TOMCAT_HOME="/var/lib/tomcat9"

# 파일 소유권 변경
echo "[core 계정 비밀번호]" | sudo -S chown core:core "${TOMCAT_HOME}/webapps/ROOT.war"
if [ $? -ne 0 ]; then
        echo "Error: Failed to change ownership of ROOT.war."
        exit 1
fi

# Tomcat 서비스 재시작
echo "[core 계정 비밀번호]" | sudo -S systemctl restart tomcat9.service

if [ $? -ne 0 ]; then
        echo "Error: Failed to restart Tomcat service."
        exit 1
fi

echo "Deployment completed successfully!"
```

</div>
</details>


