---
title: "[Issue] Manipulation Of File Path"
description: "[Issue] Manipulation Of File Path"
date: 2024-09-06
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

### 경로 조작 문제 해결 방안

```java
@Value("${a.b.c}")
private String UPLOAD_PATH;

public void deleteTest(String fileName) {
    Path targetPath = Paths.get(UPLOAD_PATH, fileName).normalize();

    try {

        // 실제 파일 시스템 경로를 확인하여 경로 조작 방지
        Path realPath = targetPath.toRealPath();

        // UPLOAD_PATH 경로와 맞는지 확인
        if (realPath.startsWith(Paths.get(UPLOAD_PATH).toRealPath())) {
            // 파일 있는지 확인
            if (Files.exists(realPath)) {
                Files.delete(realPath);
            }
        } else {
            throw new FileException("error occurred while finding file path");
        }
    } catch (IOException e) {
        throw new FileException("error occurred while deleting file", e);
    }
}
```

- fileName이 "../../etc/password" 로 올 경우 다른 경로에 접속하여 다른 파일을 삭제할 수 있다. 
- `normalize()`
    - "../" 같이 불필요한 경로를 제거하여 경로조작 문제를 해결한다.