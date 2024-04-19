---
title: AWS Instance
description: AWS Instance
date: 2024-01-16
categories: [ cloud_computing, aws]
tags: [ cloud_computing, aws ]
---

## How to create and connect instance 

1. 인스턴스 생성 (보안그룹 접근 허용) pem key 적용
2. 탄력적 ip 생성 후 인스턴스 할당
3. ssh 원격접속 프로그램을 통해 탄력적 ip를 통해 접근  
  지정한 pem key 로 해당 인스턴스로 접속!  
	login as : ubuntu  (리눅스 배포판을 ubuntu로 설정했을 경우)   
4. 원격 접속 후
  
* mysql 설치   
sudo apt-get update		  				
sudo apt-get install mysql-server   
sudo systemctl start mysql   
sudo mysql_secure_installation   
  
* 비밀번호 설정되어 있지 않는 root 접속   
  sudo mysql -u root 
  
* 비밀번호 재설정    
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root1234';	  

<br/>

1. sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
2. bind-address = 0.0.0.0 변경
3. sudo systemctl restart mysql

mysql 접속 후   

* 유저 생성   
  create user '사용자'@'%' identified by '비밀번호';		

* 해당 사용자에게 모든권한 추가   
  GRANT ALL PRIVILEGES ON *.* TO '사용자'@'%' WITH GRANT OPTION;	

<br/>

* mysql 상태 확인   
  sudo systemctl status mysql						
  
* 현재 비밀번호 정책 확인   
  SHOW VARIABLES LIKE 'validate_password%';  
  
* 현재 비밀번호 정책 변경   
  SET GLOBAL validate_password.length = 10;				
  SET GLOBAL validate_password.policy = LOW;  
  
* 해당 db의 모든 유저 확인   
  SELECT user, host FROM mysql.user;		
  
* user 삭제   
  drop user '사용자'@'localhost';  
