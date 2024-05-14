---
title: "[SQL]" xists / Not Exists 
description: "[SQL]" Exists / Not Exists
date: 2024-04-30
categories: [ Database, SQL ]
tags: [ Database, SQL ]
---

## SELECT

```sql
-- 생활과학과 소속 학생 중 수강신청을 하지 않는 학생의 학생번호를 출력한다. 
select a.학생번호
from 전공 as a
where a.학과이름 = '생활과학과' 
and not exists (select b.학생번호 from 수강 b where a.학생번호 = b.학생번호)
```

## INSERT

```sql
-- test1에 는 존재하지만 test2 테이블에는 없는 데이터를 INSERT 한다. 
insert into test2
select * from test1 t1
where not exists (select 1 from test2 t2 where t2.id = t1.id)
```

## UPDATE (데이터 백업 활용)

```sql
-- 데이터 업데이트 복사본 테이블을 생성한다. 
create table test_backup as
SELECT * FROM test WHERE regionCode = '22' AND statusCode = '1';

-- 업데이트 수행
UPDATE test
SET statusCode = '3'
WHERE regionCode = '22' AND statusCode = '1';

-- 되돌리기
UPDATE test
SET statusCode = '1'
WHERE EXISTS (SELECT 1 FROM test_backup tb WHERE tb.id = test.id);
```



