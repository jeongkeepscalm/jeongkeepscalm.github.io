---
layout: post
title: SQL_From_Work
date: 2023-09-16 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: sql.jpg # Add image post (optional)
tags: [sql] # add tag
---

## selectKey

```sql
<selectKey keyProperty="mnCd" resultType="string" order="BEFORE">
    SELECT IFNULL(MAX(mnCd) + 1, 1) AS mnCd FROM test
</selectKey>
```
> selectKey를 적용하여, insert 문 안에 있는 #{mnCd} 값을 적용할 수 있다. 

<br/>
<hr>
<br/>

## where [column name] in (subquery) 
```sql
select
    c.title
    , c.lv2Cd
from test c
where 1=1
    and c.lv2Cd in (
        select menu.lv2Cd from test menu 
        where menu.title = (select e.title from test e where e.mnCd = #{mnCd})
    );
```
> subquery 를 in 절에 넣어 원하는 결과를 얻을 수 있다. 

<br/>
<hr>
<br/>

## how to fix posts on the top
```sql
(select c.bdTitle, bdCon from test c where c.topFixYn = 'Y'
limit 0, 5)
union all
(select c.bdTitle, bdCon from test c where c.topFixYn <> 'Y'
limit 0, 10); -- 10, 10 / 20, 10 ...
```

<br/>
<hr>
<br/>

## with
```sql
with t1 as (
    select count(*) as cnt from kpa_cyberedu.educoursecreditsfo e
    where 1=1
        and e.lcnsNo = #{licenseNumber}
        and e.eduYear = #{eduYear}
)
select
    m.MBER_ID as memberId
        , t1.cnt as cnt
from mbertninfo m left join t1 on 1=1
where m.LCNS_NO = #{licenseNumber}
```
> cnt 개수에 따라 로직처리 할 때 사용.

<br/>
<hr>
<br/>
