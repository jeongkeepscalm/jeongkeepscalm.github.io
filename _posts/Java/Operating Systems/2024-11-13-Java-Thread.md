---
title: "Java-Thread"
description: "Java-Thread"
date: 2024-11-13
categories: [ Java, Operating Systems ]
tags: [ Java, Operating Systems ]
---

## ***프로세스와 스레드***

### 멀티 태스킹 vs 멀티 프로세싱

- 멀티 태스킹
  - CPU 코어가 프로세스 내 쓰레드를 스케줄링(시분할)으로 처리
  - 하나의 CPU 코어가 동시에 여러 작업을 수행하는 능력
- 멀티 프로세싱
  - 컴퓨터 시스템에서 둘 이상 CPU 코어를 사용하여 여러 작업을 동시에 처리하는 기술

### 프로세스와 스레드

<img src="/assets/img/thread/1.png" width="600px" />

- 프로그램
  - 실행 전까지는 단순한 파일
  - 프로그램 실행 시 프로세스 생성 -> 프로그램 실행
- 프로세스
  - 실행중인 프로그램
  - 하나 이상의 스레드를 반드시 포함한다.
  - 각 프로세스는 서로 독립적이다.
- 스레드: 프로세스 내 실행되는 작업의 단위  
  - 단일 스레드
  - 멀티 스레드
    - e.g. 워드 프로그램
      - 스레드1: 문서 편집
      - 스레드2: 자동 저장
      - 스레드3: 맞춤법 검사
- 같은 프로세스의 코드 섹션, 데이터 섹션, 힙(메모리)은 프로세스 안의 모든 스레드가 공유한다.  
- 스케줄링
  - CPU에 어떤 프로그램이 얼마만큼 실행될지는 운영체제가 결정
  - CPU를 최대한 활용할 수 있는 다양한 우선순위와 최적화 기법을 사용
  
- 단일 코어 스케줄링
  - <img src="/assets/img/thread/2.png" width="400px" />
- 멀티 코어 스케줄링
  - <img src="/assets/img/thread/3.png" width="400px" />
  
### 컨텍스트 스위칭(Context Switching)

- 문맥교환
  - 작업하던 스레드에서 다른 스레드로 CPU 할당
  - 약간의 비용 발생
- 스레드가 하는 작업 크게 두 가지로 분류
  - CPU-바운드 작업
    - CPU의 연산 능력을 많이 요구하는 작업
    - **이상적인 스레드 수**: CPU 코어 수 + 1개 
  - I/O-바운드 작업
    - 디스크, 네트워크, 파일 시스템 등과 같은 입출력(I/O) 작업을 많이 요구하는 작업
    - I/O 작업이 완료될 때까지 대기 시간이 많이 발생. CPU는 상대적으로 유휴(대기) 상태
    - 스레드가 CPU를 사용하지 않고 I/O 작업이 완료될 때 까지 대기
    - **이상적인 스레드 수**:  CPU 코어 수 보다 많은 스레드를 생성, CPU를 최대한 사용할 수 있는 숫자까지 스레드 생성
  
<hr>

## ***스레드***

```java
public class HelloThreadMain {

    public static void main(String[] args) {

        // Thread.currentThread(): 현재 이 코드를 실행하는 스레드
        System.out.println(Thread.currentThread().getName() + ": main() start");

        HelloThread helloThread = new HelloThread();
        System.out.println(Thread.currentThread().getName() + ": start() 호출 전");
        helloThread.start(); // 호출 시 스택영역에 할당되면서 실행된다. (Thread-0 스레드)
        System.out.println(Thread.currentThread().getName() + ": start() 호출 후");

        System.out.println(Thread.currentThread().getName() + ": main() end");

        /*
            main: main() start
            main: start() 호출 전
            main: start() 호출 후
            main: main() end
            Thread-0: run()
                Thread-0 스레드가 run() 호출(main 스레드가 run() 호출 x)
         */

    }

}

public class HelloThread extends Thread {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + ": run()");
    }
}
```
> helloThread.start() 호출 시 main 스레드와 Thread-0 스레드가 동시에 실행된다. 스레드 간 실행 순서는 보장하지 않는다.  
  
- <img src="/assets/img/thread/4.png" width="600px" />
- <img src="/assets/img/thread/5.png" width="600px" />
  
### 데몬 스레드

- 스레드
  - 사용자 스레드(non-daemon 스레드)
    - 프로그램의 주요 작업을 수행
    - 모든 user 스레드가 종료되면 JVM도 종료
  - 데몬 스레드
    - 백그라운드에서 보조적인 작업을 수행
    - 모든 user 스레드가 종료되면 데몬 스레드는 자동으로 종료
    - Thread 

### 스레드 생성 방법

- Thread 상속
  - 자바는 단일 상속만 허용하기에 이미 다른 클래스를 상속받고 있는 경우 Thread 클래스를 상속 받을 수 없다. 
- Runnable 인터페이스 구현
  - 다른 클래스를 상속받아도 문제없이 구현 가능

### 스레드의 생명주기 

<img src="/assets/img/thread/6.png" width="600px" />

- **New**
  - 스레드가 생성되었으나 아직 시작되지 않은 상태
  - start() 메서드가 호출되지 않은 상태
- **Runnable**
  - 실행 중이거나 실행 가능한 상태
  - start() 메서드가 호출되면 스레드는 Runnable 상태로 들어간다.
  - Runnable 상태에 있는 스레드는 스케줄러의 실행 대기열에 포함되어 있다가 차례로 CPU에서 실행된다
  - **Blocked(차단 상태)**
    - 스레드가 동기화 락을 기다리는 상태
    - synchronized 코드 블록에 진입하려고 할 때, 다른 스레드가 이미 락을 가지고 있는 경우
  - **Waiting(대기 상태)**
    - 스레드가 무기한으로 다른 스레드의 작업을 기다리는 상태
    - wait(), join() 메소드 호출될 때
  - **Timed Waiting(시간 제한 대기 상태)**
    - 스레드가 일정 시간 동안 다른 스레드의 작업을 기다리는 상태
    - sleep, wait, join 메소드가 호출 될 때
- **Terminate**
  - 스레드의 실행이 완료된 상태
  - 스레드가 정상적으로 종료되거나 예외 발생하여 종료된 경우
  - 스레드는 한 번 종료되면 다시 시작할 수 없다.
  
