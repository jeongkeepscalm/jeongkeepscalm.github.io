---
title: "[Windows] Basic"
description: "[Windows] Basic"
date: 2024-06-11
categories: [ Operating System, Windows ]
tags: [ Operating System, Windows ]
---

# 서버 동작 확인

```html
ping [IP Address]
telnet [IP Address] [port]
```
- ping
  - 지정된 IP 주소로 ICMP(Internet Control Message Protocol) 에코 요청을 보내 네트워크 연결 상태 확인
  - ping이 실패한다면 방화벽이 ICMP 요청을 차단하고 있을 가능성
  - 데이터 패킷이 대상까지 도달하는 데 걸리는 시간(RTT, Round-Trip Time)을 측정
- telnet
  - 지정된 IP 주소와 포트를 사용하여 원격 시스템에 Telnet 프로토콜을 통해 접속

<br/>
<hr>

# Port Duplicated

- ***Issue: 포트번호 중복시 해결방안 2가지***  
  1. 포트번호 변경
  2. 사용중인 포트 내리기(Windows)
    - <code>netstat -ano | findstr 8080</code>
    - <code>taskkill /F /pid [프로세스 아이디]</code>
