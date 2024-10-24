---
title: "[Docker] Docker Command"
description: "[Docker] Docker Command"
date: 2024-10-21
categories: [ DevOps, Docker ]
tags: [ DevOps, Docker ]
---

```bash
# 현재 사용자를 docker 그룹에 추가(sudo 사용 x)
sudo usermod -aG docker $USER 
exit

# docker compose up / down
docker compose up -d
docker compose down

# 현재 띄워져있는 도커 컨테이너 확인, 중지, 삭제
docker ps -a
docker stop [컨테이너명]            # one
docker start [컨테이너명]           # one
docker stop $(sudo docker ps -aq)  # all
docker rm $(sudo docker ps -aq)    # all

# 컨테이너 로그 확인
docker logs [컨테이너명] 
docker logs -f [컨테이너명]         # -f: realtime

# 방화벽 
sudo ufw status
sudo ufw allow 8081/tcp
sudo ufw allow 443/tcp
sudo ufw allow 2222/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 50000/tcp
sudo ufw reload
sudo ufw enable
```