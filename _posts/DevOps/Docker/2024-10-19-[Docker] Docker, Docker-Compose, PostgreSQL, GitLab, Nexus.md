---
title: "[Docker] Docker, Docker-Compose, PostgreSQL, GitLab, Nexus"
description: "[Docker] Docker, Docker-Compose, PostgreSQL, GitLab, Nexus"
date: 2024-10-19
categories: [ DevOps, Docker ]
tags: [ DevOps, Docker ]
---

## How to install Docker

```bash
# 패키지 목록 업데이트
sudo apt-get update

# 필요한 패키지 설치
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

# Docker GPG 키 다운로드하여 시스템에 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Docker 패키지를 다운로드할 수 있는 APT 저장소를 추가
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# 패키지 목록 업데이트(새로 추가된 Docker APT 저장소 포함)
sudo apt-get update

# Docker 패키지 설치
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Docker 서비스 상태 확인
sudo systemctl status docker

# Docker 테스트(hello-world 이미지 실행)
sudo docker run hello-world
```
> GPG key:            해당 키를 통해 Docker 패키지의 신뢰성을 검증  
> apt-key:            해당 명령어는 더 이상 권장되지 않음(Ubuntu 22.04 이후 부터)  
> $(lsb_release -cs): 현재 Ubuntu 배포판의 코드네임을 반환  
> docker-ce:          Docker Community Edition  
> docker-ce-cli:      Docker CLI (Command Line Interface)  
> containerd.io:      컨테이너 런타임  

<br/>
<hr>

## How to install PostgreSQL

```bash
docker run \
-dp 5432:5432 \ 
--name postgresql \ 
-e POSTGRES_PASSWORD=1234 \ 
-v /c/dev/docker/postgresql/data:/var/lib/postgresql/data postgres 
```
> -d: 컨테이너를 백그라운드에서 실행  
> -p 5432:5432: 호스트의 포트 5432를 컨테이너의 포트 5432에 매핑  
> /c/dev/docker/postgresql/data: C:\dev\docker\postgresql\data 윈도우 경로를 유닉스 스타일 경로로 변환하여 컨테이너의 /var/lib/postgresql/data 디렉토리에 마운트

<br/>

***connection & crud***
```bash
# Docker Shell 접속
docker exec -it postgresql /bin/bash # docker exec -it <설정한 db명> /bin/bash

# postgresql 접속
psql -U postgres

# database 생성
create database testdb;

# 전체 데이터베이스 목록 보기
\l

# user 생성
create user test with encrypted password '1234'

# 생성된 user 목록
\du

# 권한 부여
grant all privileges on database testdb to test;

# 유저 삭제
DROP USER test;
```

<hr/>

***⚠️ Issue***  
Dbeaver Connection Timout 발생  
  
✅ Solution 1: 설정파일 변경(postgresql.conf, pg_hba.conf)  
  
```bash
docker exec -it postgresql bash # PostgreSQL 컨테이너 접속
psql -U postgres                # PostgreSQL CLI 접속

# 설정 파일 위치 확인
SHOW config_file;               # var/lib/postgresql/data/

# postgresql.conf
# listen_addresses = "*" 확인 필요

# pg_hba.conf
# host  all  all  0.0.0.0/0  md5 추가
```
> 설정 파일 위치를 확인했지만 서버에 해당 폴더가 존재하지 않음.  
> 알고보니, Docker 컨테이너 내 postgreSQL이 실행되고 있기 때문에, 호스트 시스템에서는 해당 경로를 직접 볼수 없었다.  
> PostgreSQL 컨테이너에 접속한 상태에서 해당 폴더를 찾을 수 있었다.(cd /var/lib/postgresql/data)  

<br/>

✅ Solution 2: 인바운드 규칙 추가  
설정 파일을 변경해도 해당 이슈 해결이 불가능했다.  
뭐가 문제일까 생각하던 와중.. 새로 생성한 서버에 인바운드 규칙(PostgreSQL 포트)을 추가 안 한것이 떠올랐다.  
5432 포트 `인바운드 규칙 추가` 후 해결완료 😂  

<hr>
<br/>

## GitLab

***gitlab 컨테이너 접속 후 파일 수정***
```bash
# gitlab 컨테이너 접속
sudo docker exec -it gitlab /bin/bash

vi /etc/gitlab/gitlab.rb 

gitlab-ctl reconfigure
```
> external_url 설정 시, 포트 빼고 적을 것  
> 포트는 docker-compose.yml 파일내 설정으로 충분  

<hr>

***깃랩 초기 비밀번호 확인 및 설정***
```bash
# 깃랩 초기 비밀번호 확인
docker exec -it gitlab /bin/bash
cat /etc/gitlab/initial_root_password  | grep Password

# 깃랩 root 계정 비밀번호 변경
docker exec -it gitlab /bin/bash
gitlab-rails console -e production
user = User.where(id: 1).first
	User id:1 @root 출력 확인
user.password = '변경할 비밀번호'
user.password_confirmation = '변경할 비밀번호'
user.save!
```

<hr>
<br/>

## how to install Nexus

```bash
# Nexus docker image 다운로드
docker pull sonatype/nexus3

# volumes 생성(nexus dir 안에서 진행)
docker volume create nexus

# nexus container 실행
docker run -d -p 8081:8081 --name nexus -v [volume 위치]:/sonatype-work sonatype/nexus3

# nexus 컨테이너 접속
docker exec -it nexus /bin/bash

# 초기 비밀번호 확인(아이디: admin)
cat /nexus-data/admin.password
```

<br/>
<hr>

## How to install Docker-compose

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

***⚠️ Issue***  
멀웨어 감염  
  docker-compose.yml 파일 내 깃랩, 젠킨스 코드를 추가하고 up 시켰더니, 이 후 ssh가 느려짐.  
  top 명령어로 cpu 사용률을 확인해보니, kdevtmpfsi로 150% 이상 cpu 사용중을 확인.  
  
✅ Solution  
해당 서버 내리고 새 서버 생성해서, 아래 코드 실행  

```bash
# add below code in docker-compose.yml file
security_opt:
  - no-new-privileges:true
```
