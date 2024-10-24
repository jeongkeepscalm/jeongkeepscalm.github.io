---
title: "[CI/CD] with Gitlab, Jenkins"
description: "[CI/CD] with Gitlab, Jenkins"
date: 2024-10-24
categories: [ DevOps, CICD ]
tags: [ DevOps, CICD ]
---

***ENV***  
- 도커로 깃랩, 젠킨스 컨테이너 active
- web에 깃랩, 젠킨스 접속 가능

<hr>

***깃랩, 젠킨스 연동 순서***  
1. 깃랩 프로젝트 생성
2. 생성된 깃랩 프로젝트와 application 소스코드 연결(port 번호 추가된 url)
3. 깃랩 personal access token 발급
4. 젠킨스에 깃랩 플러그인 설치
5. 젠킨스 Credential 발급(personal access token 사용)  
  - Username with password 
    - Username: 깃랩 아이디
    - password: personal access token
    - ID는 별도로 지정하지 않는다. 
6. 젠킨스 파이프라인 생성(Add Item)
  - Build Triggers: Build when a change is pushed to GitLab. GitLab webhook URL: http://123.123.123.123:8080/project/test
  - Secret token 생성
  - 파이프라인 스크립트는 임시로 Hello World 로 해놓고 넘어간다. 
7. 깃랩 Webhook 설정
  - 젠킨스에서 파이프라인 생성시 설정된 URL, Secret token 사용
8. webhook 이 잘 설정되었다면, 파이프라인 스크립트 작성

<hr>

***Issues***  



