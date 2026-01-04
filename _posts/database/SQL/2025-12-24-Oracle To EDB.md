---
title: "[SQL] Oracle To EDB"
description: "[SQL] Oracle To EDB"
date: 2025-12-24
categories: [ Database, SQL ]
tags: [ Database, SQL ]
---

## 개요

- 오라클 → EDB 전환되는 프로젝트 내용 정리
- ymd 컬럼 타입 변경 ( varchar type → date type ) 
  
***데이터 타입 변경으로 인한 쿼리 변경***  
```sql
SELECT TO_CHAR(T.YMD, 'yyyymmdd') AS YMD
FROM (
  SELECT T1.YMD FROM T1
  UNION ALL 
  SELECT T2.YMD FROM T2
  ...
) T
WHERE T.YMD = TO_DATE(:ymd, 'yyyymmdd')
```
> 제일 바깥쪽에 있는 컬럼 타입을 변경(성능, 간결성, 수정 용이성 ↑)
> WHERE 절 좌변 YMD 는 기본키이므로 변경 x. 우변을 변경 o
> **기본키를 형변환하면 인덱스를 타지 않는다.**
> :ymd 변수가 필수값이라면 CAST(:YMD AS DATE) 가 성능면에서 유리
