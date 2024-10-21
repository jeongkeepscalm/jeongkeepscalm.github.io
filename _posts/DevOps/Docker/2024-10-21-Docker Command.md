---
title: "[Docker] Docker Command"
description: "[Docker] Docker Command"
date: 2024-10-21
categories: [ DevOps, Docker ]
tags: [ DevOps, Docker ]
---

```bash
# 현재 띄워져있는 도커 컨테이너 확인
sudo docker ps -a

# 현재 띄워져있는 도커 컨테이너 중지
sudo docker stop $(sudo docker ps -aq)

# 현재 띄워져있는 도커 컨테이너 삭제
sudo docker rm $(sudo docker ps -aq)

# 컨테이너 로그 확인
sudo docker logs gitlab 
sudo docker logs jenkins
# -f: 실시간 로그 확인
sudo docker logs -f gitlab 
sudo docker logs -f jenkins
```




