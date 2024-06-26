---
title: "Port Duplicated"
description: "Port Duplicated"
date: 2024-06-26
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

- ***Issue: 포트번호 중복시 해결방안 2가지***  
  1. 포트번호 변경
  2. 사용중인 포트 내리기(Windows)
    - <code>netstat -ano | findstr 8080</code>
    - <code>taskkill /F /pid [프로세스 아이디]</code>

