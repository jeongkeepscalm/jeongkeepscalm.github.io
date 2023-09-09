---
layout: post
title: Git - The Command Line
date: 2023-08-13 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: git.jpg # Add image post (optional)
tags: [Git] # add tag
---

### IP (Internet Protocol)

* 역할 
  - 지정한 IP 주소에 데이터 전달. 
  - 패킷 (packet) 이라는 통신단위로 데이터 전달. 

* IP Packet 정보 : 출발지 IP, 목적지 IP, 기타.., 전송데이터

* IP 프로토콜의 한계
  - 비연결성 : 패킷을 받을 대상이 없거나 서비스 불능 상태여도 패킷 전송
  - 비신뢰성 
    1. 패킷이 중간에 소실되도 모른다.
    2. 패킷의 전달 순서를 보장하지 않는다. 

* 프로토콜 계층
  1. 프로그램이 데이터 생성. 
  2. SOCKET 라이브러리를 통해 전달. 
  3. TCP 정보 생성, 메시지 데이터 포함. 
  4. IP 패킷 생성, TCP 데이터 포함.

<img src="/img/TcpIp.jpg" width="500px"/>


<br/>
<hr>
<br/>

### 커밋하기까지의 과정

* $ git init [ directory_path ] : 로컬 저장소 생성.  
  - 기본적으로 로컬 저장소를 생성하는 명령어.  
  - 디렉토리 경로를 입력하지 않을 시, 현재 작업 중인 디렉토리를 저장소로 초기화한다.   

* $ git add [ file_name ] : untracked status -&gt; tracked status -&gt; 파일을 stage 영역으로 등록.
  - untracked status : 스테이지에 등록하지 않은 상태 ( untracked )
  - tracked status : 스테이지에 등록된 상태 ( unmodified, modified, staged )
* stage : 워킹디렉토리에서 제출된 tracked state 파일들을 관리 및 임시로 저장하는 공간. 

* $ git reset HEAD [ file ] : git add 한 내용을 취소. ( file 이 없으면 add 한 파일 전체를 취소한다. )

* $ git status : 스테이지 상태 확인.

* $ git rm --cached [ file_name ] or $ git reset [ file_name ] : 파일 등록 취소
  - rm : 파일을 등록 후 커밋을 하지 않고 등록을 취소하는 경우.
  - reset : 파일을 한 번이라도 커밋했을 경우. 

#### 커밋과 관련된 정보

* Head : 커밋을 가리키는 묵시적 포인터. 마지막 커밋 위치. 
* Snapshot : 변경된 파일의 전체를 저장하지 않고, 파일에서 변경된 부분만을 찾아 수정된 내용만 저장하는 방식. 
==&gt; Git 에서 Snapshot은 Head가 가르키는 커밋을 기반으로 한다. 즉, Head 커밋과 스테이지 영역으로 등록되어 변경된 파일과의 내용을 비교한다. 

* $ git commit -m "commit message" : 해당 메시지로 커밋한다.
* $ git commit --allow-empty-message -m "" : 메시지가 없는 커밋을 작성한다.
* $ git commit --amend : 마지막으로 작성한 커밋 메시지를 수정한다.
* $ git commit -v : 커밋 간의 차이를 커밋메시지에 작성하고자 할 때 사용한다. 

* $ git log : 최신 커밋 기록부터 확인할 수 있다. 
  - $ git log --pretty=short : 커밋 메시지의 첫번째 줄만 출력된다. 
  - $ git log --pretty=oneline : 각 커밋을 한 줄로 표현한다.
  - $ git log file_name : 특정 파일(file_name)의 로그 기록을 확인할 때, 사용한다.  
  - $ git log --stat : 히스토리를 출력한다. 

* $ git checkout -- [ modified file ] : 해당파일의 마지막 커밋 때의 상태로 되돌린다. 
==&gt; $ git reset --hard [ commit_hash ] <br/>
* $ git push origin HEAD:브랜치명 --force : 돌아간 뒤 변경사항을 리모트 저장소에 다시 푸쉬한다. <br/>
==&gt; git push origin +master 

<br/>
<hr>
<br/>

