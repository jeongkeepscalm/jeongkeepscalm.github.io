---
title: Apache & Tomcat
description: Apache & Tomcat
date: 2024-05-01
categories: [ IT Infrastructure, Networking ]
tags: [ IT Infrastructure, Networking ]
---

## Apache

- Apache HTTP Server  
  - HTTP Server: 웹서버  

## Web Server

웹서버는 하드웨어와 소프트웨어 두 분야에서 다른 의미로 불린다.  
- 하드웨어  
  웹 서버 소프트웨어와 웹사이트 구성 요소 파일을 저장하는 컴퓨터.  
  ( HTTP문서, CSS 파일, JS 파일, 이미지 등..)  
- 소프트웨어  
  HTTP 서버를 의미
  HTTP 서버: URL(웹주소) 및 HTTP(프로토콜 주소)를 이해하는 소프트웨어 

## Apache Server

- 클라이언트에서 요청하는 HTTP요청을 처리하는 웹서버  
- 정적타입의 데이터만 처리  

## 톰캣 WAS(Web Application Server): 컨테이너/웹 컨테이너/서블릿 컨테이너

- JAVA EE 기반
- JSP와 Servlet을 구동하기 위한 서블릿 컨테이너 역할 수행
- 아파치 서버와는 다르게 DB연결, 다른 응용프로그램과 상호 작용 등 동적인 기능들을 사용.  

* 컨테이너: 동적인 데이터들을 가공하여 정적인 파일로 만들어주는 모듈.
* 모듈: 프로그램을 구성하는 구성요소의 일부
* 서블릿
	- 자바 인터페이스.
	- 클라이언트의 요청을 받고 처리하여 결과를 클라이언트에 제공.
* 서블릿 컨테이너
	- 서블릿들 관리
	- 새 요청이 들어올 때마다 새로운 쓰레드 생성
	- 작업이 끝난 서블릿 스레드 자동 제거
* WAS(Wab Application Server)
	- 동적 타입을 제공하는 소프트웨어 프레임워크
  
## 아파치 톰캣으로 부르는 이유

<img src="/assets/img/apacheTomcat.jpg" width="600px" />  
  
> 기본적으로 위처럼 아파치와 톰캣의 기능은 나뉘어져 있지만, 톰캣 안에 있는 컨테이너를 통해 일부 아파치의 기능을 발휘하기 때문에 보통 아파치 톰캣으로 합쳐서 부르곤 한다.  

## 정리

- 아파치: Apache ```Web Server```로 HTTP 요청에 대한 처리를 하며 정적 타입의 데이터만 처리한다.  
- 톰캣 WAS: ```Web Application Server```로 동적인 타입의 데이터를 처리한다.  