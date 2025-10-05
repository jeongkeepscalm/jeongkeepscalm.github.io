---
title: "Programmers: SQL"
description: "Programmers: SQL"
date: 2025-10-04
categories: [ Programmers, SQL ]
tags: [ Programmers, SQL ]
---

# LEVEL 3

```SQL
-- https://school.programmers.co.kr/learn/courses/30/lessons/157340
SELECT						
    H.CAR_ID						
    , CASE 						
        WHEN 						
            SUM(CASE						
                    WHEN TO_DATE('20221016', 'YYYY-MM-DD') 						
                        BETWEEN H.START_DATE AND H.END_DATE THEN 1						
                    ELSE 0						
            END) > 0 THEN '대여중'						
        ELSE '대여 가능'						
    END AS AVAILABILITY						
FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY H						
GROUP BY H.CAR_ID						
ORDER BY CAR_ID DESC						
;

WITH RENTED_CAR AS (							
    SELECT CAR_ID							
    FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY 							
    WHERE TO_DATE('20221016', 'YYYY-MM-DD') BETWEEN START_DATE AND END_DATE							
)							
SELECT							
    H.CAR_ID							
    , CASE							
        WHEN RC.CAR_ID IS NULL THEN '대여 가능'							
        ELSE '대여중'							
    END AS AVAILABILITY							
FROM (SELECT DISTINCT CAR_ID FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY) H 							
    LEFT OUTER JOIN RENTED_CAR RC 							
ON H.CAR_ID = RC.CAR_ID							
ORDER BY H.CAR_ID DESC							
;							

-- https://school.programmers.co.kr/learn/courses/30/lessons/77487
SELECT					
    ID,					
    NAME,					
    HOST_ID					
FROM (					
    SELECT					
        ID,					
        NAME,					
        HOST_ID,					
        COUNT(1) OVER (PARTITION BY HOST_ID) AS HOST_COUNT					
    FROM					
        PLACES					
)					
WHERE					
    HOST_COUNT > 1 					
ORDER BY					
    ID					
;					

-- https://school.programmers.co.kr/learn/courses/30/lessons/273712
SELECT				
    I.ITEM_ID,				
    I.ITEM_NAME,				
    I.RARITY				
FROM				
    ITEM_INFO AS I				
WHERE				
    NOT EXISTS ( 				
        SELECT 1				
        FROM ITEM_TREE AS T				
        WHERE T.PARENT_ITEM_ID = I.ITEM_ID				
    )				
ORDER BY				
    I.ITEM_ID DESC;				

-- https://school.programmers.co.kr/learn/courses/30/lessons/299305
SELECT				
    E1.ID				
    , COUNT(E2.PARENT_ID) AS CHILD_COUNT				
FROM ECOLI_DATA E1 LEFT JOIN ECOLI_DATA E2				
ON E1.ID = E2.PARENT_ID				
GROUP BY E1.ID				
ORDER BY E1.ID ASC				

-- https://school.programmers.co.kr/learn/courses/30/lessons/301649
WITH RANKING AS (
    SELECT 
        ID
        , NTILE(4) OVER (ORDER BY SIZE_OF_COLONY DESC) AS SIZE_GROUP
        , SIZE_OF_COLONY
    FROM ECOLI_DATA 
)
SELECT 
    R.ID
    , CASE
        WHEN SIZE_GROUP = 1 THEN 'CRITICAL'
        WHEN SIZE_GROUP = 2 THEN 'HIGH'
        WHEN SIZE_GROUP = 3 THEN 'MEDIUM'
        ELSE 'LOW'
    END AS COLONY_NAME
FROM RANKING R
ORDER BY R.ID ASC
```

# LEVEL 4

```SQL

```