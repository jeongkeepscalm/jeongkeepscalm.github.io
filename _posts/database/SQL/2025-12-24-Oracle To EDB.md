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

<br>
  
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
  
<br>
  
***CAST***  
```sql
SELECT 
  NVL( (SELECT CAST(CON AS TEXT) FROM A WHERE YMD = TO_DATE(:ymd, 'yyyymmdd')) , TO_CHAR(T.ccc, 'FM999,999,999,990.0') ) AS GOAL
FROM ( SELECT CCC FROM B ) T
;

SELECT ROUND(NVL(a, 0) / b, CAST(c AS INTEGER))
FROM T
;
```
> FM999,990.0 : 소수점 첫째 자리까지  
> FM999,999.0 : 값이 0일 경우 '.0' 으로 보여진다.  
  
<br>
  
***WM_CONCAT → ARRAY_AGG(), ARRAY_TO_STRING()***
```sql
-- WM_CONCAT : 여러 행의 데이터를 특정 문자(',')로 연결하여 문자열을 합칠 때 사용

-- ORACLE
, (SELECT TO_CHAR(WM_CONCAT(A.aa)))
-- EDB
, (SELECT TO_CHAR(ARRAY_TO_STRING(ARRAY_AGG(DISTINCT a.AA), ',')))

-- 최근 오라클 표준 방식
-- 현대적인 오라클 표준 방식
SELECT LISTAGG(A.aa, ',') WITHIN GROUP (ORDER BY A.aa) 
FROM A
```
  
<br>
  
***UNPIVOT → UNNEST(ARRAY[])***  
```sql
-- here
```
