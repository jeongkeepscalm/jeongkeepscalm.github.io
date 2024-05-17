---
title: "Spring Error Solution"
description: "Spring Error Solution"
date: 2024-05-17
categories: [ Spring, Spring Error Solution ]
tags: [ Spring, Spring Error Solution ]
---

## PathVariable / RequestParam Name 생략 시 발생하는 오류

- 스프링 부트 3.2 파라미터 이름 인식 문제   
java.lang.IllegalArgumentException: Name for argument of type [java.lang.String] not specified, and parameter name information not found in class file either.  
> 해결방안  
> 1. PathVariable 이름을 붙여준다. (권장)  
> 2. IntelliJ > Settings > Java Compiler > Additional command line parameters 라는 항목에 -parameters 추가한 뒤 out 폴더를 삭제하고 다시 실행  
> 3.  Build Tools > Gradle을 사용해서 빌드하고 실행한다. (권장)  

