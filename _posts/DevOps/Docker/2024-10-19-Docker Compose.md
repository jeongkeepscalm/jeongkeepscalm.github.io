---
title: "[Docker] install docker-compose"
description: "[Docker] install docker-compose"
date: 2024-10-19
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