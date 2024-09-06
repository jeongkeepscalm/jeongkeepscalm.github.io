---
title: "Apache Jmeter"
description: "Apache Jmeter"
date: 2024-09-06
categories: [ Software Performance, Apache JMeter ]
tags: [ Software Performance, Apache JMeter ]
---

### Set test scenario 

- BlazeMeter 확장 프로그램 사용
  1. 테스트 시나리오 녹화 
  2. 생성된 파일 JMeter로 실행

<hr/>

### Condition of test

- 30초 단위로 5명의 사용자를 증가시키며 30명의 사용자에 도달
- 10분 동안 주요 화면을 순차적으로 조회

<hr/>

### Setting Information

<img src="/assets/img/jmeter/jmeter setting.png" width="1000px" />

- Stepping Thread Group 을 사용하기 위해 플러그인 다운받아 설치
- User Defined Variables: 쓰레드 그룹에서 사용할 변수 설정
- HTTP Cookie Manager: 쓰레드 그룹 내에 위치하게 하여 로그인 한 사용자의 세션정보를 쿠키에 저장
- Once only controller: 해당 컨트롤러에 속한 HTTP 요청은 쓰레드당 한 번만 요청한다. 