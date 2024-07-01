---
title: "Template Engine"
description: "Template Engine"
date: 2024-06-29
categories: [ Java, Java Template Engine ]
tags: [ Java, Java Template Engine ]
---

# 템플릿 엔진이란?

- HTML과 데이터를 결합하여 최종적으로 사용자에게 보여질 뷰를 생성(VIEW 렌더링 최적화)  
- HTML 문서에서 필요한 곳만 코드를 적용해서 동적으로 변경할 수 있는 기능을 제공한다.  
- e.g. JSP, Thymleaf, Freemarker, Velocity ..

# 템플릿 엔진이 나온 이유(서블릿의 단점)

- 서블릿과 자바 코드만으로 HTML을 만들 수 있지만 매우 복잡하고 비효율적일 뿐더러, 동적 HTML 문서를 만들 수는 없다.  

<br/>
<hr>

# 서블릿과 JSP의 한계

- ```서블릿의 한계```  
  - 뷰(View)화면을 위한 HTML을 만드는 작업이 자바 코드에 섞여서 지저분하고 복잡하다.  
  
- ```JSP의 한계```
  - 비지니스 로직과 뷰 영역이 한 화면에 공존하여 복잡하며 유지보수하기가 어렵다. 

<br/>
<hr>

# JSP vs Thymeleaf 서버 처리 과정

- JSP 
	1. JSP → JAVA 서블릿(JSP 태그 & JSP 표현식이 JAVA 코드로 변환)
	2. 변환된 서블릿은 컴파일되어 클라이언트에 동적 컨텐츠 제공  
		(`서블릿`: 다양한 요청에 대한 응답을 처리할 수 있는 자바 클래스)  
	
- Thymeleaf
	1. 서버에서 Thymeleaf 템플릿 엔진을 통해 해당 html 파일을 읽는다.
	2. Thymeleaf 표현식을 확인하여 동적데이터를 html에 삽입한다. 

<br/>
<hr>