---
title: "[DevOps] Install Docker"
description: "[DevOps] Install Docker"
date: 2024-10-19
categories: [ DevOps, Docker ]
tags: [ DevOps, Docker ]
---

## Env

- Ubuntu 22.04

## How to install

```bash
# 패키지 목록 업데이트
sudo apt-get update

# 필요한 패키지 설치
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

# Docker GPG 키 다운로드하여 시스템에 추가
# GPG key: 해당 키를 통해 Docker 패키지의 신뢰성을 검증
# apt-key 명령어는 더 이상 권장되지 않음(Ubuntu 22.04 이후 부터)
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Docker 패키지를 다운로드할 수 있는 APT 저장소를 추가
# $(lsb_release -cs): 현재 Ubuntu 배포판의 코드네임을 반환
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# 패키지 목록 업데이트(새로 추가된 Docker APT 저장소 포함)
sudo apt-get update

# Docker 패키지 설치
# docker-ce:        Docker Community Edition
# docker-ce-cli:    Docker CLI (Command Line Interface)
# containerd.io:    컨테이너 런타임
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Docker 서비스 상태 확인
sudo systemctl status docker

# Docker 테스트
# hello-world 이미지 실행
sudo docker run hello-world
```