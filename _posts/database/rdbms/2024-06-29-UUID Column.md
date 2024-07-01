---
title: UUID Column
description: UUID Column
date: 2024-06-29
categories: [ Database, RDBMS ]
tags: [ Database, RDBMS, Partitioning ]
---

# UUID 컬럼 

```SQL
CREATE TABLE `user` (
  `idx` int NOT NULL AUTO_INCREMENT,
  `uuid` binary(16) DEFAULT (UUID_TO_BIN(UUID())),
  `id` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`idx`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  CONSTRAINT `onlyAllowedEnglishAndNumber` CHECK (regexp_like(`id`, '^[A-Za-z0-9]+$'))
) 
```
> `uuid 컬럼의 도메인은 binary(16)`  
> varchar() 보다 차지하는 메모리 용량이 적다.   

<br/>

```sql
select BIN_TO_UUID(uuid) as uuid from user;
```

