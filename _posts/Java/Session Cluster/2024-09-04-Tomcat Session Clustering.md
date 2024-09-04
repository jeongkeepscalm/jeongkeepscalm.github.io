---
title: "Tomcat Session Clustering"
description: "Tomcat Session Clustering"
date: 2024-09-04
categories: [ Java, Session Cluster ]
tags: [ Java, Session Cluster ]
---

# Tomcat Session Clustering in SpringBoot

1. All-to-All Session Replication
  - 모든 서버로 세션 복제 
  - `DeltaManager` 사용(노드가 4개 미만)
2. Primary-Secondary Session Replication
  - 2차 서버에만 세션 복제
  - `BackupManager` 사용(노드가 4개 이상)

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

- `멀티 캐스트`
  - 클러스터 멤버십 관리
  - 네트워크 상의 여러 호스트에게 동시에 데이터 전송할 수 있는 방법  
  
- `NIO`
  - 클러스터 메시지 수신

<hr/>

### 세션 클러스터링 적용 시 주의해야할 점

- **세션에 저장되는 객체는 모두 Serializable 인터페이스 구현 필요**