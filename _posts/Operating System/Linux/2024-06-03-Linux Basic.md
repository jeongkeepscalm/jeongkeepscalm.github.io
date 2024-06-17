---
title: "Linux Basic"
description: "Linux Basic"
date: 2024-06-03
categories: [ Operating System, Linux ]
tags: [ Operating System, Linux ]
---

# sudo

```html
sudo su -

exit
```
> root 권한 빌려옴  
> sudo: superuser do    
> su: switch user   
> sudo su -: 슈퍼유저 권한을 가지고 su - 명령 실행. 슈퍼유저(root)로 전환되어 - 옵션에 의해 슈퍼유저의 환경 설정을 로드한다.  
> 다른 권한에서 자신의 권한으로 돌아온다.

<br/>
<hr>

# 상태 확인

```html
uname -a                                    

systemctl status [특정 서비스명](e.g. crond) 
```
> uname -a: 시스템에 대한 정보(운영체제 정보 확인)  
> systemctl status [특정 서비스명]: 특정 서비스 상태 확인  

<br/>
<hr>

# 로그

- `/var/log`: 리눅스 시스템에서 일반적으로 해당 폴더에 로그 파일이 저장

<br/>
<hr>

# 특정 파일 실행 및 조회

```html
vi 파일명.sh
cat 파일명.sh
tail -100f 파일명.sh

cat cron-20240602 | grep "image-del" 
```
> -f: 실시간으로 로그 볼 경우   
> cat cron-20240602 | grep "image-del": 해당 파일 내 "image-del" 단어를 찾아 출력  

<br/>
<hr>

# 포트/프로세스 확인

```html
netstat -tnl          <!-- 현재 시스템에서 열려 있는 TCP 포트를 확인 -->

ps ef                 <!-- 실행 중인 프로세스의 정보 확인 -->
ps ef | grep java     <!-- 시스템에서 실행 중인 Java 프로세스의 정보 확인 -->
```
> t: TCP 프로토콜에 대한 연결만 표시  
> n: 서비스 이름 대신 숫자로 포트를 표시  
> l: 현재 열려 있는(즉, LISTEN 상태인) 연결만 표시  
>   
> ps: process status    
> e: 모든 프로세스를 보여줌  
> f: "full format"을 의미. 프로세스에 대한 자세한 정보 보여줌  

<br/>
<hr>

# unit 확인

```html
systemctl (--all) list-units          <!-- 실행중인 유닛 목록 -->
systemctl -t service list-units       <!-- 실행중인 서비스 유닛 목록 확인 -->
systemctl -t service list-unit-files  <!-- 모든 서비스 유닛 목록 확인 -->
```
> unit: systemd 시스템 및 서비스 매니저에서 관리하는 작업의 기본 단위  
  
- systemd
  - Linux 시스템의 초기화, 관리 및 트래킹을 위한 시스템 및 서비스 매니저
  - 부팅시간 단축, 시스템 리소스(서비스, 프로세스, 소켓, 타이머) 관리
  - 유닛(unit)을 사용하여 다양한 리소스 관리되며 유닛들은 파일로서 시스템에 저장된다. 
- systemctl
  - systemd 시스템을 제어하기 위한 명령어 라인 유틸리티

<br/>
<hr>

# ls

- 서버가 다운되는 상황 발생
  1. 해당 서버 접속 
  2. 터미널 내 로그 경로 진입 /logs
  3. `ls -ltr` 명령어로 최근 폴더에 접근하여 최신 로그 확인
    - ls: 현재 디렉토리의 파일 및 디렉토리 목록 표시(ls: list의 줄임말)
      - -l: 파일 및 디렉토리에 대한 자세한 정보를 리스트 형태로 표시(ll 명령어와 동일)
      - -a: 숨김 파일을 포함한 모든 파일 및 디렉토리 목록을 표시
      - -h: 파일 크기를 사람이 읽기 쉬운 형태(예: KB, MB)로 표시
      - -t: 파일이 만들어진 순서대로 출력
      - -r: 정렬 옵션(-t)이 선택되었을 때 역순으로 정렬. 최신순으로 정렬
