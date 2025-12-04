---
title: "Programmers: SQL"
description: "Programmers: SQL"
date: 2025-10-04
categories: [ Programmers, SQL ]
tags: [ Programmers, SQL ]
---

# LEVEL 3

```sql

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

```sql

-- https://school.programmers.co.kr/learn/courses/30/lessons/131124
SELECT 
    M.MEMBER_NAME
    , R.REVIEW_TEXT
    , TO_CHAR(R.REVIEW_DATE, 'YYYY-MM-DD') AS REVIEW_DATE
FROM MEMBER_PROFILE M INNER JOIN REST_REVIEW R
ON M.MEMBER_ID = R.MEMBER_ID
WHERE M.MEMBER_ID IN (
    SELECT
        R.MEMBER_ID
    FROM REST_REVIEW R
    GROUP BY R.MEMBER_ID
    HAVING COUNT(1) = (
        SELECT COUNT FROM 
            (
                SELECT COUNT(1) AS COUNT 
                FROM REST_REVIEW
                GROUP BY MEMBER_ID
                ORDER BY COUNT DESC
            )
        WHERE ROWNUM = 1
    )
)
ORDER BY REVIEW_DATE ASC, REVIEW_TEXT ASC
;

WITH REVIEW_RANK AS (
    SELECT
        MEMBER_ID
        , RANK() OVER (ORDER BY COUNT(MEMBER_ID) DESC) AS REVIEW_COUNT
    FROM REST_REVIEW
    GROUP BY MEMBER_ID
)
SELECT 
    M.MEMBER_NAME
    , R.REVIEW_TEXT
    , TO_CHAR(R.REVIEW_DATE, 'YYYY-MM-DD') AS REVIEW_DATE
FROM MEMBER_PROFILE M INNER JOIN REST_REVIEW R
ON M.MEMBER_ID = R.MEMBER_ID
WHERE M.MEMBER_ID IN (SELECT MEMBER_ID FROM REVIEW_RANK WHERE REVIEW_COUNT = 1)
ORDER BY R.REVIEW_DATE, R.REVIEW_TEXT

-- https://school.programmers.co.kr/learn/courses/30/lessons/301650
SELECT
    C.ID
FROM
    ECOLI_DATA AS A 
JOIN
    ECOLI_DATA AS B ON A.ID = B.PARENT_ID 
JOIN
    ECOLI_DATA AS C ON B.ID = C.PARENT_ID 
-- 제일 처음 기준이 되는 테이블(계층의 최상위)에 대한 조건을 명시
WHERE
    A.PARENT_ID IS NULL 
ORDER BY
    C.ID ASC
;

-- https://school.programmers.co.kr/learn/courses/30/lessons/151141
WITH RENTAL_DETAILS AS (
    SELECT 
        H.HISTORY_ID,
        C.DAILY_FEE,
        H.END_DATE - H.START_DATE + 1 AS DURATION
    FROM 
        CAR_RENTAL_COMPANY_RENTAL_HISTORY H
    JOIN 
        CAR_RENTAL_COMPANY_CAR C ON H.CAR_ID = C.CAR_ID
    WHERE 
        C.CAR_TYPE = '트럭'
)
SELECT 
    HISTORY_ID
    , DAILY_FEE * DURATION * ( 1 - 
        (
            NVL(
                (
                    SELECT DISCOUNT_RATE FROM (
                        SELECT
                            TO_NUMBER(REPLACE(DISCOUNT_RATE, '%', '')) AS DISCOUNT_RATE
                        FROM CAR_RENTAL_COMPANY_DISCOUNT_PLAN 
                        WHERE CAR_TYPE = '트럭'
                            AND DURATION >= TO_NUMBER(REPLACE(DURATION_TYPE, '일 이상', ''))
                        ORDER BY DISCOUNT_RATE DESC
                    ) WHERE ROWNUM = 1 
                )
            , 0) / 100
        )
    ) AS FEE
FROM RENTAL_DETAILS 
ORDER BY FEE DESC, HISTORY_ID DESC
;

WITH T AS (
    SELECT
        H.HISTORY_ID
        , C.DAILY_FEE
        , (H.END_DATE - H.START_DATE) + 1 AS DURATION
        , P.DISCOUNT_RATE
        , ROW_NUMBER() OVER (PARTITION BY H.HISTORY_ID ORDER BY P.DISCOUNT_RATE DESC) AS RNK
    FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY H
    JOIN CAR_RENTAL_COMPANY_CAR C ON H.CAR_ID = C.CAR_ID
    LEFT JOIN CAR_RENTAL_COMPANY_DISCOUNT_PLAN P ON P.CAR_TYPE = C.CAR_TYPE
        AND (H.END_DATE - H.START_DATE) + 1 >= TO_NUMBER(REPLACE(P.DURATION_TYPE, '일 이상', ''))
    WHERE C.CAR_TYPE = '트럭'
)
SELECT 
    T.HISTORY_ID 
    , T.DAILY_FEE * T.DURATION * (1 - NVL(T.DISCOUNT_RATE, 0) / 100 ) AS FEE
FROM T
WHERE RNK = 1
ORDER BY FEE DESC, HISTORY_ID DESC

```