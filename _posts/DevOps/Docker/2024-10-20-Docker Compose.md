---
title: "[Docker] Install docker-compose"
description: "[Docker] Install docker-compose"
date: 2024-10-20
categories: [ DevOps, Docker ]
tags: [ DevOps, Docker ]
---

***How to install***
```bash
# 기존 docker-compose 제거
sudo apt-get remove docker-compose -y

# jq 라이브러리 설치
sudo apt-get install jq

# 현재 세션 내 변수 저장
VERSION=$(curl --silent https://api.github.com/repos/docker/compose/releases/latest | jq .name -r)
DESTINATION=/usr/local/bin/docker-compose

# Download and install
sudo curl -L "https://github.com/docker/compose/releases/download/${VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o $DESTINATION

# Docker Compose 실행 권한 부여
sudo chmod +x $DESTINATION

# 심볼릭 링크 생성
sudo ln -s $DESTINATION /usr/bin/docker-compose

# Docker Compose 버전 확인
docker-compose -v
```
> curl: 데이터를 다운로드하는 도구  
> 심볼릭 링크: ln 명령어를 사용하여 /usr/local/bin/docker-compose 파일에 대한 심볼릭 링크를 /usr/bin/docker-compose 경로에 생성  

<hr>

***docker-compose.yml( gitlab, jenkins, postgres)***
```yml
services:     

  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    container_name: gitlab
    restart: always
    hostname: 'my-gitlab'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://123.123.123.123'
    ports:
      - '9090:80'
      - '443:443'
      - '2222:22'
    volumes:
      - '/home/ojg/gitlab/config:/etc/gitlab'
      - '/home/ojg/gitlab/logs:/var/log/gitlab'
      - '/home/ojg/gitlab/data:/var/opt/gitlab'
    security_opt:
      - no-new-privileges:true
    privileged: true
    
    
  jenkins:
    image: 'jenkins/jenkins:lts'
    container_name: jenkins
    restart: always
    ports:
      - '8080:8080'
      - '50000:50000'
    volumes:
      - '/home/ojg/jenkins:/var/jenkins_home'
    security_opt:
      - no-new-privileges:true


  postgres:
    image: postgres:17
    restart: always
    volumes:
      - '/home/ojg/postgres/data:/var/lib/postgresql/data'
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test1234
      POSTGRES_DB: postgres
```
> docker-compose up 전, volumes에 지정된 폴더를 미리 생성해둬서 마운트해놓자. 

<hr>

***Issues***

1. 멀웨어 감염  
  docker-compose.yml 파일 내 깃랩, 젠킨스 코드를 추가하고 up 시켰더니, 이 후 ssh가 느려짐.  
  top 명령어로 cpu 사용률을 확인해보니, kdevtmpfsi로 150% 이상 cpu 사용중을 확인.  
  해당 서버는 내리고 새 서버 생성해서, 아래 코드 실행.  

```bash
# add below code in docker-compose.yml file
security_opt:
  - no-new-privileges:true
```
