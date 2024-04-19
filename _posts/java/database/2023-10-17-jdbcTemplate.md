---
title: JDBC template
description: JDBC template
date: 2023-10-17
categories: [ java, database ]
tags: [ java, database, jdbc template ]
---

## read file and execute query using JDBC template

```java
public class test {

  // DataSource - DB 정보를 담는다.
  public DataSource dataSource() {

    BasicDataSource dataSource = new BasicDataSource();
    dataSource.setDriverClassName("net.sf.log4jdbc.DriverSpy");
    dataSource.setUrl("jdbc:log4jdbc:mysql://localhost:3306/_____");
    dataSource.setUsername("_____");
    dataSource.setPassword("_____");
    return dataSource;

  }

  public JdbcTemplate jdbcTemplate() {
    return new JdbcTemplate(dataSource());
  }

  @Test
  public void read_file() throws Exception {

    ObjectMapper objectMapper = new ObjectMapper();
    String path = "C:\\Users\\withy\\system.txt";
    String fileToString = getFileToString(path);

    // TypeReference 로 type 을 지정한 뒤, ObjectMapper 를 통해 객체로 변환한다.
    List<MenuDto> menuDtos 
      = objectMapper.readValue(fileToString, new TypeReference<List<MenuDto>>() {});

    menuDtos.forEach(item -> {
      insertLv3Url(item.getName(), item.getListUrl());
    });

  }

  // 파일을 읽어서 String 으로 변환한다.
  private String getFileToString(String path) throws IOException {

    BufferedReader bf 
      = new BufferedReader(new InputStreamReader(Files.newInputStream(Paths.get(path))));
    StringBuilder sb = new StringBuilder();
    String line;
    while ((line = bf.readLine()) != null) {
      sb.append(line).append(" ");
    }
    return sb.toString();

  }

  // JdbcTemplate 을 통해 쿼리를 수행한다.
  private void insertTest(String url, String name){
    JdbcTemplate jdbcTemplate = jdbcTemplate();
    String sql = "insert into test (name, url) values (? , ?)";
    jdbcTemplate.update(sql, url, name);
  }

}
```
> **DAO -> JDBC -> Database**  
> Original JDBC - Connection 객체 필요  
> Spring JDBC - DataSource 필요  