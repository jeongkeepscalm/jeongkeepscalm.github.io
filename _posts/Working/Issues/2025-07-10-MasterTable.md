---
title: "[Issue] Master Table"
description: "[Issue] Master Table"
date: 2025-07-10
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

***⚠️ Issue***  
조회한 데이터가 없을 경우 특정 행이 추가되어서 출력되어야 하는 상황

```SQL
SELECT 
  YM
  , GRADE
  , SCORE
FROM TEST;
```
> YM 데이터 202402, 202404, 202406, 202407, 202502, 202503, 202505 만 조회됨.  
> 202401, ... , 202513, 202501, ... , 202513 총 26행 데이터가 나와야 했음.  

<br>

✅ Solution  
WITH 절로 MASTER TABLE 을 만들어서 기존 쿼리를 LEFT OUTER JOIN 로 묶는다.  
```SQL
WITH calendar AS (
  SELECT TO_CHAR(yyyy * 100 + mm, 'FM000000') AS base_ym
  FROM generate_series(2024, 2025) AS yyyy,
       generate_series(1, 13)     AS mm
)
SELECT c.base_ym, t.grade, t.score
FROM calendar c
LEFT JOIN test t ON c.base_ym = t.base_ym
ORDER BY c.base_ym;


-- 202401, ... , 202412, 202501, ... , 202512
-- ORACLE
WITH calendar AS (
  SELECT TO_CHAR(ADD_MONTHS(TO_DATE('202401', 'YYYYMM'), LEVEL - 1), 'YYYYMM') AS base_ym
  FROM dual
  CONNECT BY LEVEL <= 13
)
-- EDB
WITH calendar AS (
  SELECT TO_CHAR(d, 'YYYYMM') AS base_ym
  FROM generate_series(
    DATE '2024-01-01',
    DATE '2024-12-01',
    INTERVAL '1 month'
  ) AS d
)
```