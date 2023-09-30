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

<br/>
<hr>
<br/>

## 집계함수 (Aggregate function)
```sql
-- count()
select count(distinct author_fname) from books; -- 고유값의 갯수를 알고 싶을 경우.
 
-- group by  
select
	author_fname 
	, author_lname 
	, count(*)
from books
group by author_lname, author_fname ;

-- min(), max(), sum(), avg()
select 
	title
	, pages
from books
where pages = (select max(pages) from books);

select 
	author_fname 
	, author_lname 
	, min(released_year)
from books
group by author_fname, author_lname;
-- ==
select 
	concat_ws(' ', author_fname, author_lname) as name
	, count(title)
	, min(released_year)
	, max(released_year)
	, sum(pages)
	, avg(pages)
from books
group by name;
```
> count() : null 값을 제외한 괄호 안 컬럼 행에 들어있는 값의 갯수를 출력한다. <br/>
> group by : 그룹핑 후 집계함수(count, min, max, avg)와 함께 쓰인다.

<br/>
<hr>
<br/>

## 데이터 타입 (Data Type)

#### 문자 데이터 유형

* varchar(100) : variable + character
* char(5) : 모든 문자열의 크기가 5. 문자열이 5보다 작은 데이터를 INSERT 시, 나머지 부분은 공백으로 채워진다. **데이터의 크기가 정해져 있으면 메모리 효율상 char를 사용하는게 낫다.** 

#### 숫자 데이터 유형

* tinyint : 메모리 1 byte 차지 (-128 ~ 127)

* int : 메모리 4 byte 차지 
```sql
create table parent ( children tinyint unsigned ); -- 0 ~ 127 
```

*  decimal : 정확한 소수를 저장할 수 있다. 
    - decimal(5, 2) => 소수점 앞에는 최대 3자리, 소수점 뒤에는 최대 2자리의 데이터가 삽입 가능하다. ex) 999.99 
```sql
create table products ( price decimal(5,2) );
insert into products ( price ) values ( 9272.1 ); -- INSERT 불가능
```

* float vs double
    - 둘 다 더 적은 공간으로 더 큰 수나 소수점 아래 숫자가 더 많은 수를 저장할 수 있다. 
    - float 과 double 은 저장할 수 있는 각 자리의 수 범위를 벗어나면 부정확한 값이 INSERT 된다. 
    - float : 메모리 4 byte 차지 (~ 7 digit)
    - double : 메모리 8 byte 차지 (~ 15 digit)

## 날짜와 시간과 관련된 데이터 유형

date : 'YYYY-MM-DD'
time : 'HH:MM:SS'
datetime : 'YYYY-MM-DD HH:MM:SS'

curdate() == current_date() ( 'YYYY-MM-DD' )
curtime() == current_time() ( 'HH:MM:SS' )
now() == current_timestamp() ( 'YYYY-MM-DD HH:MM:SS' )
INSERT INTO people (name, birthdate, birthtime, birthdt)
VALUES ( 'Hazel', CURDATE(), CURTIME(), NOW() );

```sql
SELECT
    birthdate,
    day(birthdate), -- day() == dayofmonth()
    dayofweek(birthdate),
    dayofyear(birthdate)
FROM people;
 
SELECT
    birthdate,
    monthname(birthdate),
    year(birthdate)
FROM people;
```

* select datediff(curdate(), '1993-01-03'); -- 두 날짜간 일수 차이를 출력한다. 
* select date_add('1993-01-03', interval 2 day); -- 1993-01-05
* select date_sub('1993-01-03', interval 10 year); -- 1983-01-03
* select timediff(curtime(), '07:00:00'); -- 현재 시간을 기준으로 오전 7시부터 얼마나 깨어 있었는지 출력한다.
* select name, birthdate, year(birthdate + interval 21 year) as willBe21 from people; -- 날짜 +/- 시 interval 을 사용한다.

<br/>

* timestamp : range ( 1970-01-01 ~ 2038-01-19 ), datetime 보다 메모리를 덜 차지.  
* datetime : range ( 1000-01-01 ~ 9999-12-31 ) 

```sql
create table captions (
	text varchar(150)
	, created_at timestamp default current_timestamp
	, updated_at timestamp on update current_timestamp 
);
```
> default current_timestamp : 따로 INSERT 하지 않아도 현재 시간이 데이터로 입력된다. <br/>
> on update current_timestamp : 행에서 어떤 열이 변경될 때마다 그 열을 current_timestamp == now() 로 업데이트한다. 





