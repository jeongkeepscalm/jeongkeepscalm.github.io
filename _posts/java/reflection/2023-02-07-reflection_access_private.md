---
title: Reflection(3)
description: 리플렉션
date: 2024-02-07
categories: [ Java, Reflection ]
tags: [ java, reflection, reflection constructors, reflection accessible ]
---

[정리_코드](https://github.com/AngryPig123/reflection/tree/private-reflection){:target="_blank"}

> <h2> 접근 제한된 생성자, 필드에 접근하는 방법 </h2>

```java
    public static void initConfiguration() throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {

  Constructor<ServerConfiguration> constructor =
    ServerConfiguration.class.getDeclaredConstructor(int.class, String.class);  //  특정 클래스에서 인자로 받은 타입을 인자로 받는 생성자를 찾아서 반환한다.

  constructor.setAccessible(true);    //  접근 제한을 전부 허용한다.
  constructor.newInstance(8080, "Good Day!"); //  새로운 인스턴스를 생성한다.
}
```

<br>

> <h2> 실행 코드 : HttpServer 를 구성하고 요청을 보낸 후 응답을 받는다. </h2>

```java
    public static void main(String[] args) throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException, IOException {
  initConfiguration();
  WebServer webServer = new WebServer();
  webServer.startServer();
}
```

<br>

> 구성 클래스

<br>

> <h2>  WebServer class </h2>

```java
public class WebServer {

  public void startServer() throws IOException {
    HttpServer httpServer = HttpServer.create(ServerConfiguration.getInstance().getServerAddress(), 0);

    httpServer.createContext("/greeting").setHandler(exchange -> {  //  /greeting 경로의 핸들러생성

      String responseMessage = ServerConfiguration.getInstance().getGreetingMessage();

      exchange.sendResponseHeaders(200, responseMessage.length());

      OutputStream responseBody = exchange.getResponseBody();
      responseBody.write(responseMessage.getBytes());
      responseBody.flush();
      responseBody.close();
    });


    System.out.println(String.format("Starting server on address %s:%d",
      ServerConfiguration.getInstance().getServerAddress().getHostName(),
      ServerConfiguration.getInstance().getServerAddress().getPort()));

    httpServer.start();
  }
}
```

<br>

> <h2> ServerConfiguration class </h2>

```java
public class ServerConfiguration {
  private static ServerConfiguration serverConfigurationInstance;

  private final InetSocketAddress serverAddress;
  private final String greetingMessage;

  private ServerConfiguration(int port, String greetingMessage) {
    this.greetingMessage = greetingMessage;
    this.serverAddress = new InetSocketAddress(port);
    if (serverConfigurationInstance == null) {
      serverConfigurationInstance = this;
    }
  }

  public static ServerConfiguration getInstance() {
    return serverConfigurationInstance;
  }

  public InetSocketAddress getServerAddress() {
    return this.serverAddress;
  }

  public String getGreetingMessage() {
    return this.greetingMessage;
  }
}
```

> <h2> 실행 코드 </h2>

```text
    Starting server on address 0.0.0.0:8080
```

![httpserver](https://github.com/AngryPig123/angrypig123.github.io/assets/86225268/9b7e588a-46b6-4540-ae20-d0d52d34cc07)
