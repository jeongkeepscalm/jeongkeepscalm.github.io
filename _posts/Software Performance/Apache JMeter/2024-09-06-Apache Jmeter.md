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

<img src="/assets/img/jmeter/01.png" width="1000px" />

- Stepping Thread Group을 사용하기 위해 플러그인 다운
- `User Defined Variables`
  - 쓰레드 그룹에서 사용할 변수 설정
- `HTTP Cookie Manager`
  - 쓰레드 그룹 내에 위치하게 하여 로그인 한 사용자의 세션정보를 쿠키에 저장
  - 각 반복 실행마다 쿠키 초기화 체크 해제
- `Once only controller`
  - 해당 컨트롤러에 속한 HTTP 요청은 쓰레드당 한 번만 요청한다. 
- `JSR223 Assertion`
  - 사용할 변수의 값을 동적으로 변환
    ```groovy
    import java.text.SimpleDateFormat
    import java.util.Date

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd_HHmmss");
    String currentTime = sdf.format(new Date());
    vars.put("var", currentTime);
    ```
<hr>
<br>

- 노션 정리: <https://www.notion.so/Apache-Jmeter-25f2888f18108060a470dfd2cb363763>
- 테스트 코드: <https://github.com/jeongkeepscalm/apache-jmeter-test-code>
