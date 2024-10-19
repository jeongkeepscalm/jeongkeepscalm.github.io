---
title: "[Docker] PostgreSQL"
description: "[Docker] PostgreSQL"
date: 2024-10-19
categories: [ DevOps, Docker ]
tags: [ DevOps, Docker ]
---

***How to install***
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

## ISSUE

1. Dbeaver Connection Timout

***설정파일 변경(postgresql.conf, pg_hba.conf)***
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

설정 파일을 변경해도 해당 이슈 해결이 불가능했다.  
뭐가 문제일까 생각하던 와중.. 새로 생성한 서버에 인바운드 규칙(PostgreSQL 포트)을 추가 안 한것이 떠올랐다.  
5432 포트 `인바운드 규칙 추가` 후 해결완료 😂
