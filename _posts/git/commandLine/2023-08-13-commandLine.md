---
title: Git Command Line
description: 깃 명령어 CLI
date: 2023-08-13
categories: [ Git, CommandLine ]
tags: [ Git, CLI, CommandLine ]
---

<h2> Connect local storage to remote storage </h2>

1. 프로젝트 우클릭 git bash 로 접속  
2. git init : 로컬저장소 지정 및 생성
3. git remote add origin "코드 옮길 레퍼지토리 주소"
4. 
  git remote -v : 레퍼리토리 주소 확인   
  git remote remove origin : 원격저장소 연결 해제  
5. git add .
6. git commit -m "message" 
7. git push origin (+)master

<h2> Progress to Commit </h2>

* git init [ directory_path ] : 로컬 저장소 생성.   
  - 기본적으로 로컬 저장소를 생성하는 명령어.   
  - 디렉토리 경로를 입력하지 않을 시, 현재 작업 중인 디렉토리를 저장소로 초기화한다.     
  
* git add [ file_name ] : untracked status -&gt; tracked status -&gt; 파일을 stage 영역으로 등록.  
  - untracked status : 스테이지에 등록하지 않은 상태 ( untracked )  
  - tracked status : 스테이지에 등록된 상태 ( unmodified, modified, staged )  
* stage : 워킹디렉토리에서 제출된 tracked state 파일들을 관리 및 임시로 저장하는 공간.  
  
* git reset HEAD [ file ] : git add 한 내용을 취소. ( file 이 없으면 add 한 파일 전체를 취소한다. )  
* git reset --hard : stage 에 올라간 파일 모두 취소.   
  
* git status : 스테이지 상태 확인.  
  
* git rm --cached [ file_name ] or git reset [ file_name ] : 파일 등록 취소  
  - rm : 파일을 등록 후 커밋을 하지 않고 등록을 취소하는 경우.  
  - reset : 파일을 한 번이라도 커밋했을 경우.   

<h4> About commit </h4>

* Head : 커밋을 가리키는 묵시적 포인터. 마지막 커밋 위치.   
* Snapshot : 변경된 파일의 전체를 저장하지 않고, 파일에서 변경된 부분만을 찾아 수정된 내용만 저장하는 방식.   
==&gt; Git 에서 Snapshot은 Head가 가르키는 커밋을 기반으로 한다. 즉, Head 커밋과 스테이지 영역으로 등록되어 변경된 파일과의 내용을 비교한다.  
  
* git commit -m "commit message" : 해당 메시지로 커밋한다.  
* git commit --allow-empty-message -m "" : 메시지가 없는 커밋을 작성한다.  
* git commit --amend : 마지막으로 작성한 커밋 메시지를 수정한다.  
* git commit -v : 커밋 간의 차이를 커밋메시지에 작성하고자 할 때 사용한다.  
* git checkout -- [ modified file ] : 해당파일의 마지막 커밋 때의 상태로 되돌린다.  
  ==&gt; git reset --hard [ commit_hash ]  
* git push origin HEAD:브랜치명 --force : 돌아간 뒤 변경사항을 리모트 저장소에 다시 푸쉬한다.  
  ==&gt; git push origin +master  

<h2> Log </h2>

* git log : 최신 커밋 기록부터 확인할 수 있다. 
* git log --pretty=short : 커밋 메시지의 첫번째 줄만 출력된다. 
* git log --pretty=oneline : 각 커밋을 한 줄로 표현한다.
* git log file_name : 특정 파일(file_name)의 로그 기록을 확인할 때, 사용한다.  
* git log --stat : 히스토리를 출력한다. 

<h2> Stash </h2>

* git stash
* git stash list
* git stash apply ( 가장 최근에 적용했던 stash 적용 )
* git stash drop 


<h2> Branch </h2>

* git branch ( 브랜치 명 ) : 브랜치 생성
* git checkout -b ( 브랜치 명 ) : 브랜치 생성과 동시에 체크아웃.
* git branch : 로컬 브랜치 목록 조회
* git branch -r : 원격 브랜치 목록 조회
* git checkout -b ( 로컬에 저장할 브랜치명 ) ( 체크아웃 할 원격 브랜치명 )
* git branch -m ( 변경할 브랜치 명 )
* git push origin ( 원격에 올릴 브랜치명 )
  
test 1

