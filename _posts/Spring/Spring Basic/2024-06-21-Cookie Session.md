---
title: "Cookie & Session"
description: "Cookie & Session"
date: 2024-06-21
categories: [Spring, Spring Basic]
tags: [Spring, Spring Basic]
---

# 패키지 구조 설계

- package 구조
  - hello.login
    - domain
      - item
      - member
      - login
    - web
      - item
      - member
      - login
  
- `도메인`: UI, 기술 인프라 등의 영역은 제외한 시스템이 구현해야 하는 `핵심 비지니스 업무 영역`
- 향후 web을 다른 기술로 바꾸어도 도메인은 그대로 유지할 수 있어야 한다.(domain이 web에 의존하지 않게 설계) 
  
