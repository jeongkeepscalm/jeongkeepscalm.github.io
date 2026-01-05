---
title: "[SQL] ORACLE TO EDB(IBK)"
description: "[SQL] ORACLE TO EDB(IBK)"
date: 2025-12-24
categories: [ Database, SQL ]
tags: [ Database, SQL ]
---

## 개요

- 오라클 → EDB 전환 IBK 프로젝트 내용 정리 

## 쿼리 변경
  
***데이터 타입 변경으로 인한 쿼리 변경***  
```sql
-- ymd 컬럼 데이터 타입 변경 ( varchar type → date type )
SELECT TO_CHAR(T.YMD, 'yyyymmdd') AS YMD
FROM (
  SELECT T1.YMD FROM T1
  UNION ALL 
  SELECT T2.YMD FROM T2
  ...
) T
WHERE T.YMD = TO_DATE(:ymd, 'yyyymmdd')
```
> 제일 바깥쪽에 있는 컬럼 타입을 변경(성능, 간결성, 수정 용이성 ↑)  
> WHERE 절 좌변 YMD 는 기본키이므로 변경 x. 우변을 변경 o  
> **기본키를 형변환하면 인덱스를 타지 않는다.**  
> :ymd 변수가 필수값이라면 CAST(:YMD AS DATE) 가 성능면에서 유리   
  
<br>
  
***WM_CONCAT → ARRAY_AGG(), ARRAY_TO_STRING()***
```sql
-- WM_CONCAT : 여러 행의 데이터를 특정 문자(',')로 연결하여 문자열을 합칠 때 사용

-- ORACLE
, (SELECT TO_CHAR(WM_CONCAT(A.aa)))
-- EDB
, (SELECT TO_CHAR(ARRAY_TO_STRING(ARRAY_AGG(DISTINCT a.AA), ',')))
```
  
<br>
  
***LISTAGG() → STRING_AGG()***  
```sql
-- ORACLE
SELECT
  A,
  B,
  LISTAGG(C, ',') WITHIN GROUP (ORDER BY C) AS C_LIST,
  LISTAGG(D, ',') WITHIN GROUP (ORDER BY D) AS D_LIST
FROM TEST
GROUP BY A, B;

-- EDB
SELECT
  A,
  B,
  STRING_AGG(C, ',' ORDER BY C) AS C_LIST,
  STRING_AGG(D, ',' ORDER BY C) AS D_LIST
FROM TEST
GROUP BY A, B;
```
> A, B 가 동일한 행들끼리 C, D 값을 묶어서 하나의 행으로 보여준다.

<br>
  
***UNPIVOT → UNNEST(ARRAY[])***  
```sql
SELECT 
  T.aa
  , T.bb
  , UNNEST(ARRAY['amt1', 'amt2', 'amt3']) AS amt_col
  , UNNEST(ARRAY[T.amt1, T.amt2, T.amt3]) AS amt_val
FROM (...) T;
```
> amt_col, amt_val : 컬럼명  
> 'amt1', 'amt2', 'amt3' 에 알맞은 값들이 우측컬럼에 매칭된다.  
  
<br>
  
***CONNECT BY ROWNUM → GENERATE_SERIES()***  
```sql
-- ORACLE
SELECT ROWNUM AS RN 
FROM DUAL
CONNECT BY ROWNUM < 3;

-- EDB
SELECT GENERATE_SERIES(1, 2) AS RN;
```
  
<br>
  
***PIVOT() → FILTER()***   
```sql
-- ORACLE
SELECT 
  YYYY
  , AMT01
  , ...
  , AMT12
FROM (
  SELECT YYYY, MONTH, AMT
  FROM EMP
)
PIVOT (
  SUM(AMT)
  FOR MONTH IN (
    '01' AS AMT01
    , ...
    , '12' AS AMT12
  )
);

-- EDB
SELECT
  YYYY
  , SUM(AMT) FILTER (WHERE MONTH = '01') AS AMT01
  , ...
  , SUM(AMT) FILTER (WHERE MONTH = '12') AS AMT12
FROM (
  SELECT YYYY, MONTH, AMT
  FROM EMP
)
GROUP BY YYYY;
```
  
<br>
  
***DECODE() → CASE***   
```sql
-- DECODE
SELECT DECODE('99', '01', 3, '03', 2, ''); -- invalid input syntax for type integer: ""
SELECT DECODE('99', '01', 3, '03') || '/' || DECODE(3, 0, '', 3);
```
> EDB 에서는 DECODE 함수 매개변수가 6개 이상일 경우 타입을 맞춰줘야 한다.  
> ***성능을 고려하여 CASE 문을 사용하자.***
  
<br>
  
***IS (NOT) NULL***
```sql
-- ORACLE
CASE
  WHEN COL IS NULL THEN 'X'
END

-- EDB
CASE
  WHEN NULLIF(TRIM(COL), '') IS NULL THEN 'X'
END
```
> ORACLE : IS NULL ( '', NULL )  
> EDB    : IS NULL ( NULL )
  
<br>
  
***CAST***  
```sql
SELECT 
  NVL( (SELECT CAST(CON AS TEXT) FROM A WHERE YMD = TO_DATE(:ymd, 'yyyymmdd')) , TO_CHAR(T.ccc, 'FM999,999,999,990.0') ) AS GOAL
FROM ( SELECT CCC FROM B ) T
;

SELECT ROUND(NVL(a, 0) / b, CAST(c AS INTEGER))
FROM T
;
```
> FM999,990.0 : 소수점 첫째 자리까지  
> FM999,999.0 : 값이 0일 경우 '.0' 으로 보여진다. 

<br>
  
***지수 제거***
```sql
CASE
  WHEN COL % 1 = 0 THEN TO_CHAR(COL, 'FM99999') || '%'
  ELSE TO_CHAR(COL, 'FM99999.0') || '%'
END
```

<br>
  
***특정 테이블 내 컬럼, 코멘트, 속성 등 조회***
```sql
-- ORACLE
SELECT  
  A.OWNER,
  A.TABLE_NAME,
  A.COLUMN_ID,
  A.COLUMN_NAME,
  B.COMMENTS,
  A.DATA_TYPE,
  A.DATA_LENGTH,
  A.NULLABLE,
  C.COLUMN_NAME
FROM ALL_TAB_COLUMNS A
LEFT OUTER JOIN ALL_COL_COMMENTS B
  ON A.TABLE_NAME = B.TABLE_NAME
    AND A.OWNER = B.OWNER
    AND A.COLUMN_NAME = B.COLUMN_NAME
LEFT OUTER JOIN ALL_IND_COLUMNS C
  ON A.TABLE_NAME = C.TABLE_NAME
    AND A.OWNER = C.TABLE_OWNER
    AND A.COLUMN_NAME = C.COLUMN_NAME
WHERE A.TABLE_NAME = :TABLENAME
  AND A.OWNER = 'TEST'
ORDER BY A.TABLE_NAME, A.COLUMN_ID;

-- EDB
SELECT 
  PS.SCHEMANAME AS OWNER,
  PS.RELNAME AS TABLE_NAME,
  PA.ATTNUM AS COLUMN_ID,
  PA.ATTNAME AS COLUMN_NAME,
  PD.DESCRIPTION AS COMMENTS,
  FC.CHARACTER_MAXIMUM_LENGTH AS DATA_LENGTH,
  PA.ATTNOTNULL AS NULLABLE,
  (
    SELECT
      KCU.COLUMN_NAME
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS TC,
      INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU
    WHERE TC.CONSTRAINT_TYPE = 'PRIMARY KEY'
      AND UPPER(TC.TABLE_NAME) = UPPER(PS.RELNAME)
      AND TC.TABLE_SCHEMA = 'TEST'
      AND TC.TABLE_CATALOG = KCU.TABLE_CATALOG
      AND TC.TABLE_NAME = KCU.TABLE_NAME
      AND TC.CONSTRAINT_SCHEMA = KCU.CONSTRAINT_SCHEMA
      AND KCU.COLUMN_NAME = PA.ATTNAME
  ) AS PK_COLUMN_NAME
FROM PG_STAT_USER_TABLES PS,
     PG_DESCRIPTION PD,
     PG_ATTRIBUTE PA,
     INFORMATION_SCHEMA."COLUMNS" FC
WHERE PS.SCHEMANAME = 'TEST'
  AND UPPER(PS.RELNAME) = :TABLENAME
  AND PS.RELID = PD.OBOID
  AND PD.OBJSUBID <> 0
  AND PD.OBOID = PA.ATTRELID
  AND PD.OBJSUBID = PA.ATTNUM
  AND FC.TABLE_NAME = PS.RELNAME
  AND PA.ATTNAME = FC.COLUMN_NAME
ORDER BY PS.RELNAME, PD.OBJSUBID;
```

<br>
  
***특정 스키마 내 모든 테이블명, 코멘트 조회***
```sql
-- ORACLE
SELECT 
  A.TABLE_NAME,
  C.COMMENTS
FROM ALL_ALL_TABLES A
INNER JOIN ALL_TAB_COMMENTS C
  ON A.TABLE_NAME = C.TABLE_NAME
  AND A.OWNER = C.OWNER
WHERE A.OWNER = 'TEST';

-- EDB 
SELECT 
  N.NSPNAME AS SCHEMA_NAME,
  C.RELNAME AS TABLE_NAME,
  D.DESCRIPTION AS TABLE_COMMENT
FROM PG_CLASS C
JOIN PG_NAMESPACE N 
  ON N.OID = C.RELNAMESPACE
LEFT JOIN PG_DESCRIPTION D 
  ON D.OBOID = C.OID 
  AND D.OBJSUBID = 0
WHERE C.RELKIND = 'r' -- r : 일반 테이블
  AND N.NSPNAME = 'TEST'
ORDER BY C.RELNAME;
```

## 이슈 정리

***데이터가 없는 상태에서 조회 시 발생한 오류***
```sql
-- ORACLE
SELECT 
  MAX(YM) AS YM,
  DATEFORMAT(MONTHS(DATE(MAX(YM) || '01'), -1), 'YYYYMM') AS PYM
FROM ADW.TEST
WHERE YM <= '202507'
  AND AVB > 0;

-- EDB 
SELECT 
  MAX(YM) AS YM,
  CASE 
    WHEN MAX(YM) IS NOT NULL 
    THEN DATEFORMAT(MONTHS(DATE(MAX(YM) || '01'), -1), 'YYYYMM')
    ELSE NULL
  END AS PYM
FROM ADW.TEST
WHERE YM <= '202507'
  AND AVB > 0;
```
> ORACLE 에서는 NULL 전파 규칙이 있어 NULL로 반환 : 에러 발생 X

<br>
  
***CHAR → BPCHAR 데이터 타입 변경으로 인해 상이한 조회 결과***  
```sql
/*
  데이터가 ' ' 공백이 있는 상태로 저장되어 있는 상태
    AS-IS
      ORACLE : 데이터 조회 X
      EDB    : 데이터 조회 O
*/ 
SELECT * FROM T WHERE COL = '';

-- TO-BE
SELECT * FROM T WHERE COL::TEXT = '';
```
> EDB 에서는 BPCHAR 타입이기에 뒤에 붙은 공백은 무시하고 같은 값으로 취급하여 공백이 들어간 데이터들도 조회가 된다.  

<br>
  
***요청 온 값이 날짜 범위 밖일 경우***   
```java
private static final DateTimeFormatter DATE_FORMATTER = 
    DateTimeFormatter.ofPattern("yyyyMMdd").withResolverStyle(ResolverStyle.STRICT);

private String getValidLastDateString(String finishYmd) {
    try {
        // 정상 날짜
        LocalDate parsedDate = LocalDate.parse(finishYmd, DATE_FORMATTER);
        Logger.debug("정상 날짜 입력: {}", parsedDate);
        return finishYmd;
    } catch (DateTimeParseException e) {
        // 잘못된 날짜 → 말일로 보정
        int year = Integer.parseInt(finishYmd.substring(0, 4));
        int month = Integer.parseInt(finishYmd.substring(4, 6));
        LocalDate lastDayOfMonth = YearMonth.of(year, month).atEndOfMonth();

        Logger.debug("보정된 날짜: {}", lastDayOfMonth);
        return lastDayOfMonth.format(DATE_FORMATTER);
    } catch (Exception e) {
	    // 20209901: 이런 형식의 월을 입력하였을 경우 YearMonth(year, month) 에서 error 발생
	    Logger.warn("유효하지 않은 날짜 입력: {}", finishYmd, e);
	    return null; // 또는 default 값
		}
}
```
> WithResolverStyle(ResolverStyle.STRICT) : SimpleDateFormat은 기본적으로 관대 모드(lenient) 이기 때문에 "20200231" 같은 잘못된 날짜를 받아도 자동으로 말일로 보정하였다.  
> 간결하게 관대 모드를 사용하여 말일로 자동 보정하면 되었지만 공부할 겸 구현.  

