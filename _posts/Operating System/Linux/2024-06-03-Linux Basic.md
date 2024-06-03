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
```
> root 권한 빌려옴  
> sudo: superuser do    
> su: switch user   
> sudo su -: 슈퍼유저 권한을 가지고 su - 명령 실행. 슈퍼유저(root)로 전환되어 - 옵션에 의해 슈퍼유저의 환경 설정을 로드한다.  

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





