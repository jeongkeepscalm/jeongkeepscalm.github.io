---
title: 파티셔닝(PostgreSQL)
description: 파티셔닝(PostgreSQL)
date: 2024-04-25
categories: [ Database, RDBMS ]
tags: [ Database, RDBMS, Partitioning ]
---

## 테이블 파티션닝

- 배경  
  DB에 저장하는 데이터 규모가 대용량화 되었을 경우, DB 시스템의 용량(storage)의 한계와 성능(performance)의 저하를 가져오게 되었다.  
  
- 개념  
  대용량 데이터를 가진 테이블을 구분지어 더 작은 테이블로 나누는 프로세스(물리적으로 분할)  

## 파티셔닝 목적

1. 성능 향상: Full Scan에서 데이터 Access의 범위를 줄여 성능을 향상시킨다.  
2. 관리 용이: (파티션 단위로 백업, 추가, 삭제, 변경이 가능)   
3. 가용성: 물리적인 파티셔닝으로 인해 전체 데이터의 훼손 가능성이 줄어들고 데이터 가용성이 향상된다.  
  - 가용성이란? 데이터가 필요할 때 항상 사용할 수 있는 상태이다.  

## 파티셔닝 종류

- 수평 파티셔닝: 레코드(행) 기준으로 구분짓는다.  
- 수직 파티셔닝: 컬럼 기준으로 구분짓는다.  

## 파티셔닝 타입

1. 범위 파티셔닝  
  - 연속적인 숫자나 날짜를 기준으로 파티셔닝 한다.
2. 목록 파티셔닝  
  - 특정 컬럼을 지정하여 컬럼별로 파티셔닝 한다. 
3. 해시 파티셔닝  
4. 키 파티셔닝

```sql
-- List Partitioning
CREATE TABLE stores (
    "id" serial 
    , "storeName" varchar(50) not null
    , "address" varchar(50) not null 
    , "regionNumber" varchar(50) not null
    , "email" varchar(200) not null
    , "created_on" timestamp not null
    , "last_login" timestamp
    , CONSTRAINT stores_pkey PRIMARY KEY ("id", "regionNumber")
)
PARTITION BY LIST ("regionNumber");

CREATE TABLE stores_02 PARTITION OF stores FOR VALUES IN ('02');
CREATE TABLE stores_031 PARTITION OF stores FOR VALUES IN ('031');

GRANT SELECT ON TABLE stores_02 TO 'ojg0103'; -- ojg0103 유저에게 파티션으로 구분지어진 store_02 테이블 조회 기능 권한 부여.
```

