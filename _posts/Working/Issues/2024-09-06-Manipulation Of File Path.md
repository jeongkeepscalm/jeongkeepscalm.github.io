---
title: "Manipulation Of File Pat"
description: "Manipulation Of File Pat"
date: 2024-09-06
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

### 경로 조작 문제

```java
@Value("${a.b.c}")
private String UPLOAD_PATH;

public void deleteTest(String fileName) {

    Path targetPath = Paths.get(UPLOAD_PATH + fileName);
    Path normalizedPath = targetPath.normalize();

    if(normalizedPath.startsWith(UPLOAD_PATH)) {
        try {
            if (Files.exists(targetPath)) {
                Files.deleteTest(targetPath);
            }
        } catch (IOException e) {
            throw new FileException("error occurred while deleting file.");
        }
    } else {
        throw new FileException("error occurred while finding file path");
    }

}
```

- fileName이 "../../etc/password" 로 올 경우 다른 경로에 접속하여 다른 파일을 삭제할 수 있다. 
- `normalize()`
  - "../" 같이 불필요한 경로를 제거하여 경로조작 문제를 해결한다.

