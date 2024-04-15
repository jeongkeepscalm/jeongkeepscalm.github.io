---
title: Spring, Openfeign(2)
description: Spring Openfeign
date: 2024-03-01T16:40:000
categories: [ Spring, Openfeign ]
tags: [ back-end, spring, open feign ]
---

- ```openfeign``` 테스트를 하기 위한 ```response-server```과 ```request-server``` 생성
  - ```response-server``` : 요청시 다양한 형태의 응답을 주는 ```end-point```들을 생성
  - ```request-server``` : 다양한 요청 방식으로 ```response-server```에 ```end-point```를 호출하는 ```gateway``` 서비스 생성
  - 모든 요청과 응답은 ```restful``` 하게 진행

<br>

<h2> Response </h2>

- ```request-server```에서 호출시 ```response-server```에서 리턴해주는 메세지 뿐만 아니라 모든```response``` 값들은 어떻게 받을 수 있을까?
  - ```status``` ```request``` ```reason``` ```headers``` ```body``` ```protocolVersion``` 등등...


- ```Response``` : 이런것들을 한번에 가져올 수 있도록 ```openfeign```에서 지원해주는 객체
  - 아래와 같은 정보들을 담아서 던져준다.

```java
public final class Response implements Closeable {

  private final int status;
  private final String reason;
  private final Map<String, Collection<String>> headers;
  private final Body body;
  private final Request request;
  private final ProtocolVersion protocolVersion;

  private Response(Builder builder) {
    checkState(builder.request != null, "original request is required");
    this.status = builder.status;
    this.request = builder.request;
    this.reason = builder.reason; // nullable
    this.headers = caseInsensitiveCopyOf(builder.headers);
    this.body = builder.body; // nullable
    this.protocolVersion = builder.protocolVersion;
  }

  //    ..

}
```

<br>

<h2> 테스트 </h2>

- 일단 테스트를 하기전에 ```response-server```에서 응답해주는 컨트롤러 확인.
  - ```CommonHelperService``` : 리턴해주는 값에 아무것도 없으면 허전하니 뭐라도 담아서 보내줄 수 있게 구성한 서비스 별 의미는 없다.

```java

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/openfeign")
public class ResponseController {

  private final CommonHelperService commonHelperService;

  @PostMapping(path = "/ok/users")
  public ResponseEntity<List<UserDto>> getUsersOk() {
    return new ResponseEntity<>(commonHelperService.generatedFakerUsers(10), HttpStatus.OK);
  }

  @PostMapping(path = "/bad-request/users")
  public ResponseEntity<MapContainer> getUsersBadRequest(HttpServletRequest httpServletRequest) {
    MapContainer mapContainer = new MapContainer();
    mapContainer.setDataMap(
      Map.of(
        "request-status", "400",
        "request-uri", httpServletRequest.getRequestURI()
      )
    );
    return new ResponseEntity<>(mapContainer, HttpStatus.BAD_REQUEST);
  }

  @Setter
  @Getter
  @NoArgsConstructor
  public static class MapContainer {
    private Map<String, String> dataMap;
  }

}

```

- ```gateway``` 에서 리턴 타입을 ```String```으로 했을 경우

```java

@FeignClient(name = "response-v1-gateway", url = "${gateway.v1.response}")
public interface ResponseV1Gateway {
  @PostMapping(path = "/ok/users")
  String getUsers();
  //  ..
}

@Slf4j
@SpringBootTest
public class OpenFeignTest {
  @Autowired
  private ResponseV1Gateway responseV1Gateway;

  @Test
  void response_v1_gateway_get_body() {
    String users = responseV1Gateway.getUsers();
    log.info("users = {}", users);
  }
  //    ..
}

```

```text
users = [{"username":"Charlotte Brown","password":"$2a$10$6n.vNgN6eWwn4wd7woKS.OHaNWoszePpu7y8shTVT2B2PqvPJ8fA2"},{"username":"Alexander Jones","password":"$2a$10$v0rcQ.gx.lSAZsxWsCagfuo9lVLZJfzjjdOwRNwEg3.RL26.HP13u"},{"username":"Isabella Harris","password":"$2a$10$5fqa64jV8fY8Gg5Bm9ZRAeNBzbPRqHTz0hoWUmpJy8vcf1sG0KSsi"},{"username":"Ava Anderson","password":"$2a$10$PbFqeuCRfkW3UUAaCEr2g.0W6Mq2SEpwtHH2wWKje39EIaLMjEkxi"},{"username":"Emma Jackson","password":"$2a$10$Anay/vW4dbefCc8xrj4L0usAeCKvOazyd3Derdt0Gv8sDzh5/cPE6"},{"username":"Henry Taylor","password":"$2a$10$fNRv1Q9loXZvJN6IT0OK0.l6hh5Aji7e7vgZ9LgxoB7Olcy0LV1yq"},{"username":"William Jackson","password":"$2a$10$aZ624FtOtyfAjISx4afNoO3pBqiFFReGlhGVG25iB6lGCMMR4TqwC"},{"username":"James Johnson","password":"$2a$10$0WEKxW8jKxZ//Zz9GyvjP.lRVkZGrQJKt4FtApiaoV6UWDDk7a/Ay"},{"username":"Mia Taylor","password":"$2a$10$b3lmq6oQR.Kz1MQ1Z3lZFOayc1B3IUlyGUt45zfO8HPW4B7.R4jrm"},{"username":"Ava Smith","password":"$2a$10$NF2MC0xO3yGr897zxBxvhOHIS6NXRTrGboofoSL8kTTUvu2l6hlOK"}]
```

- ```gateway``` 에서 리턴 타입을 ```Response```로 했을 경우

```java

@FeignClient(name = "response-v1-gateway", url = "${gateway.v1.response}")
public interface ResponseV1Gateway {
  //  ..
  @PostMapping(path = "/ok/users")
  Response getResponse();
}

@Slf4j
@SpringBootTest
public class OpenFeignTest {
  @Autowired
  private ResponseV1Gateway responseV1Gateway;

  //    ..
  @Test
  void response_v1_gateway_get_response() throws IOException {
    Response response = responseV1Gateway.getResponse();
    log.info("response = {}", response);
    InputStream inputStream = response.body().asInputStream();
    BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
    String nextLine;
    while ((nextLine = br.readLine()) != null) {
      log.info(nextLine);
    }
  }
}

```

```text
response = HTTP/1.1 200
connection: keep-alive
content-type: application/json
date: Fri, 01 Mar 2024 07:36:32 GMT
keep-alive: timeout=60
transfer-encoding: chunked

feign.Response$InputStreamBody@294ebe11
[{"username":"James Anderson","password":"$2a$10$Sst8BG0al1jmu.sa1LE1pOj2ery9zfYrtKFbCPXm5B695IeT57vjq"},{"username":"Olivia Wilson","password":"$2a$10$A3RXAjxIAmEtlH5KW8lTi.P3r3o6icXucVGyHP4fTCk.P4iUI2IEe"},{"username":"Olivia Williams","password":"$2a$10$uJiYxMBb.IcwCO3Q6ZEk1uyZqJHHizrLGisXBePpojR61gxGtw.ua"},{"username":"James Anderson","password":"$2a$10$6aFQXT3DSRUSCZCn4LfxreIJ1T66975BR.fw5e7QXYwIPKik.Z1t."},{"username":"James Brown","password":"$2a$10$wxzXnVttrJgcK0Jg2U4fR./xC4n56awxBi2b0SKEHg1Cw7MdZwHPq"},{"username":"William Jackson","password":"$2a$10$8ThUwpcZsfwLK723AkLE1OAvDIw7MqFjRarvQtgw7npqFRpD2LaKG"},{"username":"Michael Johnson","password":"$2a$10$QBeY7Y5QrNUfKNE7JHcpN.nG1A.ktBzBUaJ7PkHTG54WDLKr897/e"},{"username":"Amelia Jones","password":"$2a$10$e1WKvrdXlyRy0btSigjpW.jYqyAgB/k9gvIAM3RXx8wzIsQOYpBXa"},{"username":"Mia Moore","password":"$2a$10$TYvWK.ftOaN6NURAKGx7KO7.DelHMnJyOgFK09Me/LKAIiAeecTTi"},{"username":"David Harris","password":"$2a$10$psvd9v4yOfFel4BXeBXe2uNeG1tU/MUWQyK5yY5dgtVeGUmEQbm6a"}]
```

ToDO 해당 값을 어떤식으로 사용할지 생각해보기, ```configuration```  설정 알아보기
