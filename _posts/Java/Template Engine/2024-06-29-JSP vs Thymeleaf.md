---
title: "JSP vs Thymeleaf"
description: "JSP vs Thymeleaf"
date: 2024-06-29
categories: [ Java, Java Template Engine ]
tags: [ Java, Java Template Engine ]
---

# JSP vs Thymeleaf 서버 처리 과정

- JSP 
	1. JSP → JAVA 서블릿(JSP 태그 & JSP 표현식이 JAVA 코드로 변환)
	2. 변환된 서블릿은 컴파일되어 클라이언트에 동적 컨텐츠 제공
	
- Thymeleaf
	1. 서버에서 Thymeleaf 템플릿 엔진을 통해 해당 html 파일을 읽는다.
	2. Thymeleaf 표현식을 확인하여 동적데이터를 html에 삽입한다. 