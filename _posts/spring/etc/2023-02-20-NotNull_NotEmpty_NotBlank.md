---
title: NotEmpty NotBlank NotNull
description: empty, null 체크 검증기
date: 2024-02-20T00:30:000
categories: [ Spring, Validation ]
tags: [ back-end, spring, not empty, not blank, not null ]
---

- 검증기를 통한 검증을 진행할때 마다 헷갈려서 정리

|           | null    | empty   | space   |
|-----------|---------|---------|---------|
| @NotNull  | 허용하지 않음 | 허용      | 허용      |
| @NotEmpty | 허용하지 않음 | 허용하지 않음 | 허용      |
| @NotBlank | 허용하지 않음 | 허용하지 않음 | 허용하지 않음 |

- null : null값을 허용 하는지
- empty : ```""``` empty상태를 허용 하는지
- space : ```" "``` 다음과 같이 space를 허용 하는지

[참고 사이트](https://www.baeldung.com/java-bean-validation-not-null-empty-blank){:target="\_blank"}
