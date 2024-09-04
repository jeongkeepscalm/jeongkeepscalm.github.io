---
title: "Tomcat Session Clustering in SpringBoot"
description: "Tomcat Session Clustering in SpringBoot"
date: 2024-09-04
categories: [ Java, Session Cluster ]
tags: [ Java, Session Cluster ]
---

1. All-to-All Session Replication
  - 모든 서버로 세션 복제 
  - `DeltaManager` 사용(노드 4개 미만)
2. Primary-Secondary Session Replication
  - 2차 서버에만 세션 복제
  - `BackupManager` 사용(노드 4개 이상)

<hr/>

### Code applied

```java
@Configuration
public class SessionClusterUtil implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

  @Override
  public void customize(final TomcatServletWebServerFactory factory) {
    factory.addContextCustomizers(new TomcatClusterContextCustomizer());
  }

}

@Slf4j
class TomcatClusterContextCustomizer implements TomcatContextCustomizer {
  @Override
  public void customize(final Context context) {

    context.setDistributable(true);                 // 클러스터링 지원 설정

    DeltaManager manager = new DeltaManager();      
    manager.setExpireSessionsOnShutdown(false);     // 톰캣 종료 시 세션 만료 x
    manager.setNotifyListenersOnReplication(true);  // 세션 복제 시 리스너에 알림
    context.setManager(manager);
    configureCluster((Engine) context.getParent().getParent());
  }

  private void configureCluster(Engine engine) {

    SimpleTcpCluster cluster = new SimpleTcpCluster();
    cluster.setChannelSendOptions(8);

    GroupChannel channel = new GroupChannel();

    McastService mcastService = new McastService();
    mcastService.setAddress("228.0.0.4");
    mcastService.setPort(45565);
    mcastService.setFrequency(500);
    mcastService.setDropTime(3000);
    channel.setMembershipService(mcastService);

    NioReceiver receiver = new NioReceiver();
    receiver.setAddress("auto");
    receiver.setMaxThreads(6);
    receiver.setPort(4001);
    channel.setChannelReceiver(receiver);

    ReplicationTransmitter sender = new ReplicationTransmitter();
    sender.setTransport(new PooledParallelSender());
    channel.setChannelSender(sender);

    channel.addInterceptor(new TcpPingInterceptor());
    channel.addInterceptor(new TcpFailureDetector());
    channel.addInterceptor(new MessageDispatchInterceptor());

    cluster.addValve(new ReplicationValve());
    cluster.addValve(new JvmRouteBinderValve());
    cluster.setChannel(channel);
    cluster.addClusterListener(new ClusterSessionListener());

    engine.setCluster(cluster);
  }

}
```

- **멀티 캐스트**
  - 클러스터 멤버십 관리
  - 네트워크 상의 여러 호스트에게 동시에 데이터 전송할 수 있는 방법  
  - TCP/UDP 포트 오픈 필요
  
- **NIO**
  - 클러스터 메시지 수신
  - TCP 포트 오픈 필요

<hr/>

### 시행착오

- 운영에 세션 클러스터링 코드 적용 실패하여, 테스트 시나리오를 작성하여 테스트했다. 
  
1. 로컬 인스턴스 2개 띄움(8081, 8082)
2. 8081 에서 로그인 한 후, 8082 로 들어가 로그인 여부 확인
  
- 쿠키에 담긴 세션 아이디 공유는 되었지만 8082 진입시 로그인 유지는 되지 않았다. 
- 8081, 8082 두 인스턴스가 띄워진 상황에서 로그 확인한 결과, 서버 하나만 띄워졌을 때 볼 수 없었던 로그 확인
  - ``` text
  Unable to serialize delta request for sessionid [218D7AC46C081A7A5448837DD9EF93A3] java.io.NotSerializableException: com.core.test.res.TestUser
  ```
- 세션 클러스터링 시, 세션에 저장되는 객체는 serializable 인터페이스를 구현해야 하는 것을 알고 있어서, UserDetails 를 구현한 객체에 serializable 를 추가했었다. 하지만 추가적으로 세션에 저장되는 객체와 관련된 모든 클래스에도 serializable 을 구현했어야 했다. 
  
`*` **세션에 저장되는 모든 객체 Serializable 인터페이스 구현 필요**