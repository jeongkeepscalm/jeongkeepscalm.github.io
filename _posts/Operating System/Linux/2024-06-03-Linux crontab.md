---
title: "Linux crontab"
description: "Linux crontab"
date: 2024-06-03
categories: [ Operating System, Linux ]
tags: [ Operating System, Linux ]
---

# crontab

- crontab 정의
  - LNIX 및 UNIX 계열 시스템에서 시간 기반 작업 스케줄링을 제공하는 명령어
  - cron table의 줄임말
  
- 옵션
  - crontab -l: 정의된 crontab 출력
  - crontab -e: crontab 편집
  - crontab -r: crontab 전체 삭제

<br/>
<hr>

# 상황

- 이슈: 매월 초 ssh로 특정 아이피에 접속하여 회복 이미지를 삭제하는 수동작업 존재  
- 해결방안: 리눅스 스케줄러 크론탭을 활용해서 자동화  
  
***crontab 적용***  

```html
sudo su -                                   <!-- root 권한 빌려오기 -->

crontab -l                                  <!-- crontab 목록 확인 -->
crontab -e                                  <!-- crontab editor mode -->

00 02 1 * * /root/crio-unused-image-del.sh  <!-- 명령어 추가 -->
```
> 분(0~59) 시간(0~23) 일(1~31) 월(1~12) 요일(0~7)   
> 매월 1일 02시 00분에 실행   

<br/>

***이미지 삭제 shell***  

```html
crictl images -q | xargs -n 1 crictl rmi 2>/dev/null
```
> crictl images -q: 현재 시스템에 있는 모든 컨테이너 이미지의 ID 출력   
> xargs -n 1: xargs에게 입력을 한 번에 하나씩만 전달하도록 지시   
> crictl rmi: 주어진 이미지 ID를 삭제  
> 2>dev/null: 명령어 실행 중 발생하는 모든 에러 메시지를 /dev/null로 리다이렉션. 에러 메시지를 숨길 때 사용  