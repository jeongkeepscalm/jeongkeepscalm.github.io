---
title: "[Docker] Docker Command"
description: "[Docker] Docker Command"
date: 2024-10-21
categories: [ DevOps, Docker ]
tags: [ DevOps, Docker ]
---

```bash
# 현재 유저 도커 명령어 실행시, sudo 입력 할 필요 x
sudo usermod -aG docker $USER 
logout 

# docker compose up / down
docker compose up -d
docker compose down

# 현재 띄워져있는 도커 컨테이너 확인
docker ps -a

# 현재 띄워져있는 도커 컨테이너 중지
docker stop $(sudo docker ps -aq)

# 현재 띄워져있는 도커 컨테이너 삭제
docker rm $(sudo docker ps -aq)

# 컨테이너 로그 확인
docker logs gitlab 
docker logs jenkins
# -f: 실시간 로그 확인
docker logs -f gitlab 
docker logs -f jenkins


```