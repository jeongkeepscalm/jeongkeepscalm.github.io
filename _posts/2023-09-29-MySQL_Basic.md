---
layout: post
title: MySQL_Basic
date: 2023-09-29 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: mysql.png # Add image post (optional)
tags: [mysql] # add tag
---

## Create

#### Database

```sql
SHOW DATABASES; 
CREATE DATABASE <database name>
DROP DATABASE <database name>
USE <database name> -- 사용할 데이터베이스를 지정한다.
SELECT <database name> -- 현재 사용중인 데이터베이스명을 알려준다. 
```

<br/>
<hr>
<br/>

#### Table

```sql
CREATE TABLE cats  (
    name VARCHAR(20) NOT NULL DEFAULT 'unnamed'
    , age INT NOT NULL DEFAULT 99
 );

CREATE TABLE cats2 (
    cat_id INT AUTO_INCREMENT PRIMARY KEY
    , name VARCHAR(100) NOT NULL
    , age INT NOT NULL
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT NOT NULL
    , first_name VARCHAR(255) NOT NULL
    , last_name VARCHAR(255) NOT NULL
    , middle_name VARCHAR(255)
    , age INT NOT NULL
    , current_status VARCHAR(255) NOT NULL DEFAULT 'employed'
    , PRIMARY KEY(id)
);

SHOW COLUMNS FROM <table name> -- 필드와 타입 등 정보를 출력한다. 
== DESCRIBE <table name> 
== DESC <table name> 

DROP TABLE <table-name>;
```

<br/>
<hr>
<br/>

##  INSERT

INSERT INTO <table name> (field names...) values (values...)

```sql
INSERT INTO cats (name, age) 
VALUES 
    ('Meatball', 5), 
    ('Turkey', 1), 
    ('Potato Face', 15);
```

<br/>
<hr>
<br/>

##  UPDATE

update <table name> set <field name> = <value>, ... where ...

```sql
update 
    shirts 
set 
    shirt_size = 'XS'
    , color = 'off white' 
where color = 'white';
```

<br/>
<hr>
<br/>

## 개념정리
* 데이터베이스 : 접근 가능한 인터페이스를 가진 컴퓨터화 된 데이터의 구조화된 집합.
* 관계형 데이터베이스 ( Relational Databases ) - MySql, Oracle, SqLite, PostgreSql...
* 엔트리 == 행. 즉, 각각의 데이터.
<br/>
* where 조건을 먼저 찾은 후 select 한 컬럼을 출력한다. where 절 안 컬럼은 select 후의 컬럼에 포함될 필요가 없다. 서로 독립적이다. 
* CLI 에서 sql 소스를 import 할 수 있다. 
mysql> source C:/Users/withy/Downloads/book_data.sql;
* DISTINCT 는 SELECT 에 출력할 모든 필드에 적용이 된다. 

<br/>
<hr>
<br/>

## 자주 사용하는 문자열 함수 
```sql
select concat_ws('-', 'oh', 'jeong', 'gil'); -- oh-jeong-gil

select substring('hello world', 7, 5); -- world
select substring('hello world', -5); -- world

select reverse('abcde'); -- edcba

select char_length('훌륭한 개발자'); -- 7 
select length('훌륭한 개발자'); -- 19 

select ucase('hello'); -- HELLO 
select lcase('HELLO'); -- hello

select insert('Hello World', 6, 0, ' Jeong\'s'); -- Hello Jeong's Wrold
select left('OmgHahaLol~~', 3); -- Omg
select right('OmgHahaLol~~', 5); -- Lol~~
select repeat('ha', 3); -- hahaha

select trim('    jeong   '); -- jeong 
select trim(leading '.' from '.....this is for you..'); -- this is for you..
select trim(trailing '.' from '.....this is for you..'); -- .....this is for you
select trim(both '.' from '.....this is for you..'); -- this is for you
```
> substring() == substr() <br/>
> char_length() : 글자 길이 반환 <br/>
> length() : 바이트 길이 반환 <br/>
> ucase() == upper() <br/>
> lcase() == lower() <br/>









