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

* PORT - 같은 IP 내에서 프로세스 구분

<br/>
<hr>
<br/>

### TCP - 전송 제어 프로토콜(Transmission Control Protocol)

* 특징
  1. 연결지향 TCP 3 way handshake (가상연결)
  2. 데이터 전달 보증
  3. 순서 보장
  4. 신뢰할 수 있는 프로토콜 (대부분 TCP 사용)

<img src="/img/TCP3.jpg" width="500px"/>

### DNS (Domain Name System)

<img src="/img/dns.jpg" width="500px"/>


<br/>
<hr>
<br/>

