---
layout: post
title: MySQL_Basic
date: 2023-09-29 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: mysql.png # Add image post (optional)
tags: [mysql] # add tag
---

## DataBase

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

## Table

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

## MULTI INSERT

```SQL
INSERT INTO cats (name, age) 
VALUES 
    ('Meatball', 5), 
    ('Turkey', 1), 
    ('Potato Face', 15);
```

<br/>
<hr>
<br/>




