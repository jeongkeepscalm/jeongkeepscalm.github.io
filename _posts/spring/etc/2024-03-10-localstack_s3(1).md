---
title: Spring, Local Stack S3
description: Aws s3 서비스 모킹하기
date: 2024-03-10T16:40:000
categories: [ Spring ]
tags: [ back-end, spring, local stack, s3 ]
---

<h2> local stack </h2>

- ```AWS```의 유료 서비스를 이용한 로직을 구성할 때 개발 단계에서 요금을 지불하지 않고 로컬에서 개발이 가능하게 해주는 기술 스택
  - 아래와 같은 ```AWS``` 기능들을 제공 [참고](https://dkswnkk.tistory.com/720){:target="\_blank"}
    - API Gateway at http://localhost:4567
    - Kinesis at http://localhost:4568
    - DynamoDB at http://localhost:4569
    - DynamoDB Streams at http://localhost:4570
    - S3 at http://localhost:4572
    - Firehose at http://localhost:4573
    - Lambda at http://localhost:4574
    - SNS at http://localhost:4575
    - SQS at http://localhost:4576
    - Redshift at http://localhost:4577
    - Elasticsearch Service at http://localhost:4578
    - SES at http://localhost:4579
    - Route53 at http://localhost:4580
    - CloudFormation at http://localhost:4581
    - CloudWatch at http://localhost:4582
    - SSM at http://localhost:4583
    - SecretsManager at http://localhost:4584
    - StepFunctions at http://localhost:4585
    - CloudWatch Logs at http://localhost:4586
    - EventBridge (CloudWatch Events) at http://localhost:4587
    - STS at http://localhost:4592
    - IAM at http://localhost:4593
    - EC2 at http://localhost:4597
    - KMS at http://localhost:4599
    - ACM at  http://localhost:4619

<br>

<h2> localstack s3 </h2>

- 파일 업로드, 다운로드의 기능을 기원해주는 ```Simple Storage Service```를 모킹해볼 예정.
  - ```AWS_ACCESS_KEY_ID``` : ```AwsBasicCredentials``` 설정에 필요한 access key id
  - ```AWS_SECRET_ACCESS_KEY``` : ```AwsBasicCredentials``` 설정에 필요한 secret access key
  - ```AwsBasicCredentials``` : 지역 설정.

```dockerfile
version: "3.8"
services:
  localstack:
    container_name: "aws-s3"
    image: localstack/localstack
    ports:
      - "127.0.0.1:4566:4566" # LocalStack Edge Proxy
    environment:
      - SERVICES=s3
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
      - AWS_ACCESS_KEY_ID=foobar
      - AWS_SECRET_ACCESS_KEY=foobar
      - AWS_DEFAULT_REGION=us-east-1
    volumes:
      - "${LOCALSTACK_VOLUME_DIR:-D:/application/localstack}:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
```

- 진행하려던 방식은 ```local stack s3``` 컨테이너 내부에서 파일을 저장하는 폴더를 ```호스트 볼륨```으로 사용하여 가시적으로 보려 햇으니
  ```local stack s3```에서는 파일을 메모리에 저장한다고 함으로 ```volume```공유 부분은 나중에 더 알아보기로...

<br>

<h2> spring boot 의존성 추가 </h2>

- ```implementation "org.testcontainers:localstack:1.16.3"```
  - 나중에 테스르 컨테이너 설정을 위한 설정
- ```implementation 'software.amazon.awssdk:s3:2.17.14'```
  - ```aws s3``` 서비스 사용을 가능하게 해주는 자바 라이브러리
    - sdk 버전에 따라 설정이 많이 다르니 잘 확인해야됨.

```text
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'

    //  aws s3
    implementation "org.testcontainers:localstack:1.16.3"
    implementation 'software.amazon.awssdk:s3:2.17.14'
}
```

<br>

<h2> AwsS3Configuration </h2>

- ```docker-compose.yaml``` 에서 설정한 옵션대로 설정 셋팅.

```java

@Configuration
public class AwsS3Configuration {
  @Bean
  public S3Client s3Client(
  ) {
    return S3Client.builder()
      .region(Region.of("us-east-1"))
      .credentialsProvider(() -> AwsBasicCredentials.create("foobar", "foobar"))
      .endpointOverride(URI.create("http://localhost:4566"))
      .build();
  }
}
```

<br>

<h2> bucket 생성 코드 </h2>

```java

@Slf4j
@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {
  private final S3Client s3Client;

  @Override
  public void createBucket(String bucketName) {
    s3Client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
  }
}
```

- 테스트 코드
  - 생성된 버킷이 버킷 리스트에 포함되어있는지 확인
  - 포함 안된 버킷을 조회하여 위의 검증이 맞는 검증인지 확인

```java

@SpringBootTest
@AutoConfigureMockMvc
class S3ServiceImplTest {
  @Autowired
  private S3Service s3Service;

  @Test
  void bucket_create() {
    s3Service.createBucket("bucket");
    List<String> bucket = s3Service.bucketNameList().stream().filter(item -> item.equals("bucket")).collect(Collectors.toList());
    Assertions.assertNotEquals(new ArrayList<>(), bucket);
    List<String> notFoundBucket = s3Service.bucketNameList().stream().filter(item -> item.equals("notFoundBucket")).collect(Collectors.toList());
    Assertions.assertEquals(new ArrayList<>(), notFoundBucket);
  }
}
```

![image](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/b5967241-50c8-410a-bd23-e928cb93bb35)


<br>

<h2> s3 이미지 업로드 </h2>

- ```MultipartFile```을 s3에 업로드 하는 코드


- ```FileUploadReq```

```java

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadReq {
  private MultipartFile multipartFile;
  private String bucketName;
  private String key;
}
```

- ```uploadMultipartFile(FileUploadReq fileUploadReq)```
  - ```log.error()``` 부분의 코드는 나중에 ```ExceptionHandler```를 통해 관리한다.

```java

@Override
public boolean uploadMultipartFile(FileUploadReq fileUploadReq) {
  MultipartFile multipartFile = fileUploadReq.getMultipartFile();
  String bucketName = fileUploadReq.getBucketName();
  String key = fileUploadReq.getKey();

  try (InputStream inputStream = multipartFile.getInputStream()) {
    PutObjectRequest putObjectRequest =
      PutObjectRequest.builder()
        .bucket(bucketName)
        .key(key)
        .build();
    RequestBody requestBody = RequestBody
      .fromInputStream(inputStream, multipartFile.getSize());

    PutObjectResponse response = s3Client.putObject(putObjectRequest, requestBody);
    if (response != null) {
      log.info("File uploaded successfully to S3. Bucket: {}, Key: {}", bucketName, key);
      return true;
    } else {
      log.error("Error uploading file to S3. Bucket: {}, Key: {}", bucketName, key);
      return false;
    }
  } catch (Exception e) {
    log.error("Error uploading file to S3. Bucket: {}, Key: {}", bucketName, key, e);
    return false;
  }

}
```

- controller

```java

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/file-upload")
public class FileController {

  private final S3Service s3Service;

  @PostMapping
  public ResponseEntity<Void> fileUpload(
    @RequestParam("multipartFile") MultipartFile multipartFile,
    @RequestParam("bucketName") String bucketName,
    @RequestParam("key") String key
  ) {
    FileUploadReq fileUploadReq = new FileUploadReq(multipartFile, bucketName, key);
    s3Service.uploadMultipartFile(fileUploadReq);
    return new ResponseEntity<>(HttpStatus.OK);
  }

}
```

- 테스트 코드
  - ```MockMultipartFile```를 이용해서 파일을 업로드

```java

@SpringBootTest
@AutoConfigureMockMvc
class S3ServiceImplTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void file_upload_test() throws Exception {
    MockMultipartFile file = new MockMultipartFile(
      "file", // 파일 파라미터 이름
      "test.txt", // 파일 이름
      "text/plain", // 파일 타입
      "Hello, World!".getBytes() // 파일 내용
    );
    mockMvc.perform(
        multipart("/file-upload")
          .file("multipartFile", file.getBytes())
          .param("bucketName", "bucket")
          .param("key", UUID.randomUUID().toString())
      )
      .andExpect(status().isOk());
  }

}
```



- aws cli를 통한 파일 업로드 확인
  - ```awslocal s3api list-objects --bucket bucket``` : 버킷 안에있는 파일 리스트를 조회하는 명령어

![file_upload](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/838838cf-3410-4394-a588-487069addcd3)

- 진행한 테스트 만큼 파일이 쌓여있는걸 볼 수 있다.

```text
root@07c58ed02c50:/# awslocal s3api list-objects   --bucket bucket
{
    "Contents": [
        {
            "Key": "0d642021-583b-4512-88ce-9a7fbe477e44",
            "LastModified": "2024-03-10T09:58:43.000Z",
            "ETag": "\"65a8e27d8879283831b664bd8b7f0ad4\"",
            "Size": 13,
            "StorageClass": "STANDARD",
            "Owner": {
                "DisplayName": "webfile",
                "ID": "75aa57f09aa0c8caeab4f8c24e99d10f8e7faeebf76c078efc7c6caea54ba06a"
            }
        },
        {
            "Key": "4014be25-66b6-4b25-ab7b-6622ad09320f",
            "LastModified": "2024-03-10T08:56:32.000Z",
            "ETag": "\"65a8e27d8879283831b664bd8b7f0ad4\"",
            "Size": 13,
            "StorageClass": "STANDARD",
            "Owner": {
                "DisplayName": "webfile",
                "ID": "75aa57f09aa0c8caeab4f8c24e99d10f8e7faeebf76c078efc7c6caea54ba06a"
            }
        },
        {
            "Key": "fb953b16-2cc1-4305-835a-b1f108237fe0",
            "LastModified": "2024-03-10T09:58:09.000Z",
            "ETag": "\"65a8e27d8879283831b664bd8b7f0ad4\"",
            "Size": 13,
            "StorageClass": "STANDARD",
            "Owner": {
                "DisplayName": "webfile",
                "ID": "75aa57f09aa0c8caeab4f8c24e99d10f8e7faeebf76c078efc7c6caea54ba06a"
            }
        }
    ],
    "RequestCharged": null
}
```
