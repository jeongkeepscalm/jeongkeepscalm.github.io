---
title: "[Docker] Install docker-compose"
description: "[Docker] Install docker-compose"
date: 2024-10-20
categories: [ DevOps, Docker ]
tags: [ DevOps, Docker ]
---

***How to install***
```bash
# Docker Compose 다운로드 및 설치
sudo curl -L "https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Docker Compose 실행 권한 부여
sudo chmod +x /usr/local/bin/docker-compose

# 심볼릭 링크 생성
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Docker Compose 버전 확인
docker-compose --version
```
> curl: 데이터를 다운로드하는 도구  
> 심볼릭 링크: ln 명령어를 사용하여 /usr/local/bin/docker-compose 파일에 대한 심볼릭 링크를 /usr/bin/docker-compose 경로에 생성  

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

# 방화벽 포트 추가
sudo ufw allow 8081/tcp
sudo ufw allow 443/tcp
sudo ufw allow 2222/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 50000/tcp
sudo ufw enable
```
