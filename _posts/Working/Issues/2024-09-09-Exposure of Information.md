---
title: "[Issue] Exposure of Information"
description: "[Issue] Exposure of Information"
date: 2024-09-09
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

- 자바 클래스에 서버 정보, 도메인 정보 등이 노출되어 이 정보를 이용해 개발/운영 환경에 접근하여 공격받을 가능성이 존재
- 민감 정보들을 설정 파일(yaml)로 옮겨 활용

***Resolved Issue***

```yaml
# url
url:
  prod: https://test.co.kr
  dev: http://11.1.111.111:8080
  local: http://localhost:8080
```

<br/>

```java
@Configuration
@ConfigurationProperties(prefix = "url")
@Getter
@Setter
public class SwitchConfigTest {
  private String prod;
  private String dev;
  private String local;
}
```
> 해당 클래스로 빌드 시 yaml 파일 내 코드 정보를 읽어 필드에 값이 세팅한다.  