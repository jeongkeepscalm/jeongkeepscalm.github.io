---
title: "Java-Thread"
description: "Java-Thread"
date: 2024-11-13
categories: [ Java, Operating Systems ]
tags: [ Java, Operating Systems ]
---

# ***프로세스와 스레드***

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
  - 프로그램 실행 시 프로세스 생성 → 프로그램 실행
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
  - <img src="/assets/img/thread/2.png" width="600px" />
- 멀티 코어 스케줄링
  - <img src="/assets/img/thread/3.png" width="600px" />
  
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

# ***스레드***

<details>
  <summary><span style="color:orange" class="point"><b>extends Thread</b></span></summary>
  <div markdown="1">

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

  </div>
</details>

- <img src="/assets/img/thread/4.png" width="600px" />
- <img src="/assets/img/thread/5.png" width="600px" />

<br>
<hr>

# ***데몬 스레드***

- 스레드
  - 사용자 스레드(non-daemon 스레드)
    - 프로그램의 주요 작업을 수행
    - 모든 user 스레드가 종료되면 JVM도 종료
  - 데몬 스레드
    - 백그라운드에서 보조적인 작업을 수행
    - 모든 user 스레드가 종료되면 데몬 스레드는 자동으로 종료
    - Thread 

<br>
<hr>

# ***스레드 생성 방법***

- Thread 상속
  - 자바는 단일 상속만 허용하기에 이미 다른 클래스를 상속받고 있는 경우 Thread 클래스를 상속 받을 수 없다. 
- Runnable 인터페이스 구현
  - 다른 클래스를 상속받아도 문제없이 구현 가능

<br>
<hr>

# ***스레드의 생명주기*** 

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

<br>
<hr>

# ***체크 예외 재정의***

- Runnable 인터페이스의 run() 메서드를 구현할 때 InterruptedException 체크 예외를 밖으로 던질 수 없
는 이유 예외 재정의 규칙 때문이다.
- `체크 예외 재정의 규칙`
  - 자식 클래스에 재정의된 메서드는 부모 메서드가 던질 수 있는 체크 예외의 하위 타입만을 던질 수 있다.
  - 원래 메서드가 체크 예외를 던지지 않는 경우, 재정의된 메서드도 체크 예외를 던질 수 없다.
  
<br>
<hr>

# ***Join***

<details>
<summary><span style="color:orange" class="point"><b>Join Code 1</b></span></summary>
<div markdown="1">

```java
public class JoinMainV0 {

    public static void main(String[] args) {
        log("Start");
        Thread thread1 = new Thread(new Job(), "thread-1");
        Thread thread2 = new Thread(new Job(), "thread-2");
        thread1.start();
        thread2.start();
        log("End");

        /*
            16:43:16.068 [     main] Start
            16:43:16.077 [     main] End
            16:43:16.077 [ thread-1] 작업 시작
            16:43:16.077 [ thread-2] 작업 시작
            16:43:18.093 [ thread-2] 작업 완료
            16:43:18.093 [ thread-1] 작업 완료

            main 스레드가 thread-1 , thread-2 가 끝날때까지 기다리지 않는다.
            main 스레드는 단지 start() 를 호출해서 다른 스레드를 실행만 하고 바로 자신의 다음 코드를 실행한다.

            thread-1 , thread-2 가 종료된 다음에 main 스레드를 가장 마지막에 종료하려면?
            => JoinMainV3

        */
    }

    static class Job implements Runnable {
        @Override
        public void run() {
            log("작업 시작");
            sleep(2000);
            log("작업 완료");
        }
    }

}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>Join Code 2</b></span></summary>
<div markdown="1">

```java
public class JoinMainV3 {

    public static void main(String[] args) throws InterruptedException {
        log("Start");
        SumTask task1 = new SumTask(1, 50);
        SumTask task2 = new SumTask(51, 100);
        Thread thread1 = new Thread(task1, "thread-1");
        Thread thread2 = new Thread(task2, "thread-2");
        thread1.start();
        thread2.start();

        // 스레드가 종료될 때 까지 대기
        log("join() - main 스레드가 thread1, thread2 종료까지 대기한다. < main thread Waiting >");
        thread1.join(); // InterruptedException 예외 던짐
        thread2.join(); // InterruptedException 예외 던짐
        log("main 스레드 대기 완료");

        log("task1.result = " + task1.sum );
        log("task2.result = " + task2.sum);

        int sumAll = task1.sum + task2.sum;
        log("task1 + task2 = " + sumAll);
        log("End");

        /*
            17:10:03.223 [     main] Start
            17:10:03.235 [     main] join() - main 스레드가 thread1, thread2 종료까지 대기
            17:10:03.235 [ thread-1] 작업 시작
            17:10:03.235 [ thread-2] 작업 시작
            17:10:05.256 [ thread-1] 작업 완료: sum= 1275
            17:10:05.256 [ thread-2] 작업 완료: sum= 3775
            17:10:05.257 [     main] main 스레드 대기 완료
            17:10:05.258 [     main] task1.result = 1275
            17:10:05.259 [     main] task2.result = 3775
            17:10:05.260 [     main] task1 + task2 = 5050
            17:10:05.260 [     main] End
        */
    }

    static class SumTask implements Runnable {

        private final int FIRST;
        private final int LAST;
        int sum;

        public SumTask(int first, int last) {
            this.FIRST = first;
            this.LAST = last;
            this.sum = 0;
        }

        @Override
        public void run() {
            log("작업 시작");
            sleep(2000);
            for (int i = FIRST; i <= LAST; i++) {
                sum += i;
            }
            log("작업 완료: sum= " + sum);
        }

    }

}
```
> join() 을 호출하는 스레드는 대상 스레드가 TERMINATED 상태가 될 때 까지 대기한다.  
> 다른 스레드가 완료될 때 까지 무기한 기다리는 단점 존재  

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>Join Code 3</b></span></summary>
<div markdown="1">

```java
public class JoinMainV4 {

    public static void main(String[] args) throws InterruptedException {
        log("Start");
        SumTask task1 = new SumTask(1, 50);
        Thread thread1 = new Thread(task1, "thread-1");
        thread1.start();
        // 스레드가 종료될 때 까지 대기
        log("join(5000) - main 스레드가 최대 5초 동안 thread1 종료까지 대기한다.");
        thread1.join(5000);
        log("main 스레드 대기 완료");
        log("task1.sum = " + task1.sum);
    }

    static class SumTask implements Runnable {

        private final int FIRST;
        private final int LAST;
        int sum;

        public SumTask(int first, int last) {
            this.FIRST = first;
            this.LAST = last;
            this.sum = 0;
        }

        @Override
        public void run() {
            log("작업 시작");
            sleep(2000);
            for (int i = FIRST; i <= LAST; i++) {
                sum += i;
            }
            log("작업 완료: sum= " + sum);
        }

    }

}
```
> join(ms) 을 호출하는 스레드는 대상 스레드가 ms 동안 대기한다.  
> ms 이전에 해당 스레드가 종료되면 ms 동안 기다리지 않고 호출한 스레드가 실행된다.  

</div>
</details>

<br>
<hr>

# ***Interupt***

<details>
<summary><span style="color:orange" class="point"><b>Inturrupt Code 1</b></span></summary>
<div markdown="1">

```java
public class ThreadStopMainV1 {

    public static void main(String[] args) {

        MyTask myTask = new MyTask();
        Thread thread = new Thread(myTask, "work");
        thread.start();

        sleep(4000);
        log("작업 중단 지시 runFlag=false");
        myTask.runFlag = false;

        /*
            17:55:21.971 [     work] 작업중
            17:55:24.978 [     work] 작업중
            17:55:25.964 [     main] 작업 중단 지시 runFlag=false
            17:55:27.990 [     work] 자원 정리
            17:55:27.991 [     work] 작업 종료

            문제점
                작업 중단 지시 2초 정도 이후에 자원을 정리하고 작업을 종료한다.
                main 스레드가 runFlag 를 false 로 변경해도, work 스레드는 sleep(3000) 을 통해 3초간 잠들어 있기 때문이다.

            어떻게 하면 sleep() 처럼 스레드가 대기하는 상태에서 스레드를 깨우고, 작업도 빨리 종료할 수 있을까?
            =>
        */

    }

    static class MyTask implements Runnable {

        volatile boolean runFlag = true;

        @Override
        public void run() {
            while (runFlag) {
                log("작업중");
                sleep(3000);
            }
            log("자원 정리");
            log("작업 종료");
        }
    }
}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>Inturrupt Code 2</b></span></summary>
<div markdown="1">

```java
public class ThreadStopMainV2 {

    public static void main(String[] args) {

        MyTask myTask = new MyTask();
        Thread myTaskThread = new Thread(myTask, "work");
        myTaskThread.start();

        sleep(4000);
        log("작업 중단 지시 myTaskThread.interrupt()");
        myTaskThread.interrupt(); 
        log("work 스레드 인터럽트 상태1 = " + myTaskThread.isInterrupted());

        /*
            18:04:31.477 [     work] 작업 중
            18:04:34.494 [     work] 작업 중
            18:04:35.475 [     main] 작업 중단 지시 myTaskThread.interrupt()
            18:04:35.487 [     main] work 스레드 인터럽트 상태1 = true
            18:04:35.487 [     work] work 스레드 인터럽트 상태2 = false
            18:04:35.488 [     work] interrupt message=sleep interrupted
            18:04:35.489 [     work] state=RUNNABLE
            18:04:35.490 [     work] 자원 정리
            18:04:35.490 [     work] 작업 종료
        */
    }

    static class MyTask implements Runnable {

        @Override
        public void run() {
            try {
                while (true) {
                    log("작업 중");
                    Thread.sleep(3000);
                }
            } catch (InterruptedException e) {
                log("work 스레드 인터럽트 상태2 = " + Thread.currentThread().isInterrupted());
                log("interrupt message=" + e.getMessage());
                log("state=" + Thread.currentThread().getState());
            }
            log("자원 정리");
            log("작업 종료");
        }
    }

}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>Inturrupt Code 3</b></span></summary>
<div markdown="1">

```java
public class ThreadStopMainV3 {

    public static void main(String[] args) {

        MyTask myTask = new MyTask();
        Thread myTaskThread = new Thread(myTask, "work");
        myTaskThread.start();

        sleep(100);
        log("작업 중단 지시 - myTaskThread.interrupt()");
        myTaskThread.interrupt(); 
        log("work 스레드 인터럽트 상태1 = " + myTaskThread.isInterrupted());

        /*
            10:41:13.651 [     work] 작업중 ...
            10:41:13.651 [     work] 작업중
            10:41:13.652 [     main] 작업 중단 지시 - myTaskThread.interrupt()
            10:41:13.652 [     work] 작업중
            10:41:13.652 [     main] work 스레드 인터럽트 상태1 = true
            10:41:13.652 [     work] work 스레드 인터럽트 상태2 = true
            10:41:13.652 [     work] 자원 정리 시도
            10:41:13.652 [     work] 자원 정리 실패 - 자원 정리 중 인터럽트 발생
            10:41:13.652 [     work] work 스레드 인터럽트 상태3 = false
            10:41:13.652 [     work] 작업 종료
        */

    }

    static class MyTask implements Runnable {

        @Override
        public void run() {

            while (!Thread.currentThread().isInterrupted()) {
                log("작업중");
            }
            log("work 스레드 인터럽트 상태2 = " + Thread.currentThread().isInterrupted());

            try {
                log("자원 정리 시도");
                Thread.sleep(1000); // 인터럽트 상태가 ture 일 경우 sleep() 을 호출한다면, 해당 코드에서 인터럽트 예외가 발생하게 된다.
                log("자원 정리 완료");
            } catch (InterruptedException e) {
                log("자원 정리 실패 - 자원 정리 중 인터럽트 발생");
                log("work 스레드 인터럽트 상태3 = " + Thread.currentThread().isInterrupted());
                // 스레드의 인터럽트 상태를 정상적으로 돌리지 않으면 계속 인터럽트가 발생하기에 내부에서 false 로 변환한다.
            }
            log("작업 종료");
        }

    }

}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>Inturrupt Code 4</b></span></summary>
<div markdown="1">

```java
public class ThreadStopMainV4 {

    public static void main(String[] args) {

        MyTask myTask = new MyTask();
        Thread myTaskThread = new Thread(myTask, "work");
        myTaskThread.start();

        sleep(100);
        log("작업 중단 지시 - myTaskThread.interrupt()");
        myTaskThread.interrupt();
        log("work 스레드 인터럽트 상태1 = " + myTaskThread.isInterrupted());

    }

    static class MyTask implements Runnable {

        @Override
        public void run() {

            while (!Thread.interrupted()) {
                log("작업중");
            }
            log("work 스레드 인터럽트 상태2 = " + Thread.currentThread().isInterrupted());

            try {
                log("자원 정리 시도");
                Thread.sleep(1000);
                // 인터럽트 상태가 ture 일 경우 sleep() 을 호출한다면, 해당 코드에서 인터럽트 예외가 발생하게 된다.
                log("자원 정리 완료");
            } catch (InterruptedException e) {
                log("자원 정리 실패 - 자원 정리 중 인터럽트 발생");
                log("work 스레드 인터럽트 상태3 = " + Thread.currentThread().isInterrupted());
                // 스레드의 인터럽트 상태를 정상적으로 돌리지 않으면 계속 인터럽트가 발생하기에 내부에서 false 로 변환한다.
            }
            log("작업 종료");
        }

    }

}
```
> `isInterrupted()`  
>   특정 스레드의 상태를 변경하지 않고 확인만 한다.  
> `Thread.interrupted()`  
>   현재 스레드의 인터럽트 상태를 확인하고, 인터럽트 상태를 초기화한다.  
>   인터럽트가 true 일 경우 false 로 초기화한다.  

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>Printer Code 1</b></span></summary>
<div markdown="1">

```java
public class MyPrinterV2 {

    public static void main(String[] args) {
        Printer printer = new Printer();
        Thread printerThread = new Thread(printer, "printer");
        printerThread.start();

        Scanner scanner = new Scanner(System.in);
        while (true) {
            log("프린트할 문서를 입력하세요. 종료 (q): ");
            String input = scanner.nextLine();
            if ("q".equals(input)) {
                printerThread.interrupt();
                break;
            }
            printer.addJob(input);
        }

    }

    static class Printer implements Runnable {
        Queue<String> jobQueue = new ConcurrentLinkedQueue<>();

        @Override
        public void run() {
            while (!Thread.interrupted()) {
                if (jobQueue.isEmpty()) continue;
                try {
                    String job = jobQueue.poll();
                    log("출력 시작: " + job + ", 대기 문서:" + jobQueue);
                    Thread.sleep(3000);
                    log("출력 완료: " + job);
                } catch (InterruptedException e) {
                    log("인터럽트!");
                    break;
                }
            }
            log("프린터 종료");
        }

        void addJob(String input) {
            jobQueue.offer(input);
        }

    }

}
```
> main 스레드: 사용자 입력을 받는다.  
> printer 스레드: 사용자의 입력을 출력한다.  

</div>
</details>

<br>
<hr>

# ***Yield()***

- Thread.yield()
  - 현재 실행 중인 스레드가 자발적으로 CPU 를 양보하여 다른 스레드가 실행될 수 있도록 한다.
  - yield() 메서드를 호출한 스레드는 RUNNABLE 상태를 유지하면서 CPU 를 양보한다.
  - yield() 는 RUNNABLE 상태를 유지하기 때문에, 쉽게 이야기해서 양보할 사람이 없다면 본인 스레드가 계속 실행될 수 있다.
  
<details>
<summary><span style="color:orange" class="point"><b>Printer Code 2</b></span></summary>
<div markdown="1">

```java
public class MyPrinterV3 {

    public static void main(String[] args) {

        Logger logger = new Logger();
        Thread loggerThread = new Thread(logger, "logger");
        loggerThread.start();

        Printer printer = new Printer();
        Thread printerThread = new Thread(printer, "printer");
        printerThread.start();

        Scanner scanner = new Scanner(System.in);
        while (true) {
            log("프린트할 문서를 입력하세요. 종료 (q): ");
            String input = scanner.nextLine();
            if ("q".equals(input)) {
                printerThread.interrupt();
                loggerThread.interrupt();
                break;
            }
            printer.addJob(input);
        }

    }

    static class Printer implements Runnable {
        Queue<String> jobQueue = new ConcurrentLinkedQueue<>();

        @Override
        public void run() {
            while (!Thread.interrupted()) {
                if (jobQueue.isEmpty()) {
                    // jobQueue 에 작업이 비어있으면 yield() 를 호출해서, 다른 스레드에 작업을 양보
                    Thread.yield();
                    continue;
                }
                try {
                    String job = jobQueue.poll();
                    log("출력 시작: " + job + ", 대기 문서:" + jobQueue);
                    Thread.sleep(3000);
                    log("출력 완료: " + job);
                } catch (InterruptedException e) {
                    log("프린터 인터럽트!");
                    break;
                }
            }
            log("프린터 종료");
        }

        void addJob(String input) {
            jobQueue.offer(input);
        }

    }

    static class Logger implements Runnable {
        @Override
        public void run() {
            while (!Thread.interrupted()) {
                log("로거 실행중");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    log("로거 인터럽트!");
                    break;
                }
            }
            log("로거 종료");
        }
    }

}
```
> Thread.yield()를 추가하여 Printer 스레드가 CPU를 양보하여 Logger 스레드가 더 자주 실행될 수 있게 된다.  
> 반면, Thread.yield()를 삭제하면 Printer 스레드가 CPU를 계속 점유할 가능성이 높아져 Logger 스레드의 실행 빈도가 줄어들 수 있다.  

</div>
</details>

<br>
<hr>

# ***volatile***

<details>
<summary><span style="color:orange" class="point"><b>Volatile Code 1</b></span></summary>
<div markdown="1">

```java
public class VolatileFlagMain {

    public static void main(String[] args) {
        MyTask myTask = new MyTask();
        Thread myThread = new Thread(myTask, "myTask");
        log("runFlag= " + myTask.runFlag);
        myThread.start();

        sleep(1000);
        log("runFlag: true → false");
        myTask.runFlag = false;
        log("runFlag= " + myTask.runFlag);
        log("메인 스레드 종료");
    }

    static class MyTask implements Runnable {
        boolean runFlag = true;
        @Override
        public void run() {
            log("task 시작");
            while (runFlag) {
                log("실행중");
            }
            log("task 종료");
        }
    }

    /*
        15:40:55.367 [ main] runFlag = true
        15:40:55.367 [ work] task 시작
        15:40:56.374 [ main] runFlag를 false로 변경 시도
        15:40:56.374 [ main] runFlag = false
        15:40:56.375 [ main] main 종료

        내 코드에서는 "task 종료"가 출력되었지만 실행환경에 따라 미출력될 수 있다.
     */
}
```

</div>
</details>

- 상위 코드에 대한 예상 메모리 접근 방식
  - <img src="/assets/img/thread/7.png" width="600px" />
- 실제 메모리 접근 방식
  - 현대의 CPU 대부분은 코어 단위로 캐시 메모리를 각각 보유하고 있고, 처리 성능을 개선하기 위해 중간에 캐시 메모리를 사용한다. 
  - <img src="/assets/img/thread/8.png" width="600px" />
  - <img src="/assets/img/thread/9.png" width="600px" />
  - 캐시 메모리를 메인 메모리에 반영하거나, 메인 메모리의 변경 내역을 캐시 메모리에 다시 불러오는 것은 CPU 설계 방식과 실행 환경에 따라 다르다. 
  
### ***메모리 가시성***

- 멀티 스레드 환경에서 한 스레드가 변경한 값이 다른 스레드에서 언제 보이는지에 대한 문제
- 해당 문제를 해결하기위해서는 값을 읽을 때, 쓸 때 모두 메인 메모리에 직접 접근하면 된다. 
  - **자바에서 제공하는 키워드 volatile**
  - 여러 스레드에서 같은 값을 읽고 써야 한다면 volatile 키워드를 사용하면 된다. 
  - 단 캐시 메모리를 사용할 때 보다 성능이 느려지는 단점이 있기 때문에 꼭! 필요한 곳에만 사용하는 것이 좋다.
  
<details>
<summary><span style="color:orange" class="point"><b>Volatile Code</b></span></summary>
<div markdown="1">

```java
public class VolatileCountMain {

    public static void main(String[] args) {

        MyTask myTask = new MyTask();
        Thread t = new Thread(myTask, "work");
        t.start();

        sleep(1000);
        myTask.flag = false;
        log("flag = " + myTask.flag + ", count = " + myTask.count + " in main");

        /*
            volatile x (메모리 가시성 확인)
                15:25:29.547 [     work] flag = true, count = 100000000 in while()
                15:25:29.777 [     work] flag = true, count = 200000000 in while()
                15:25:29.986 [     work] flag = true, count = 300000000 in while()
                15:25:30.173 [     work] flag = true, count = 400000000 in while()
                15:25:30.309 [     main] flag = false, count = 472079158 in main
                15:25:30.352 [     work] flag = true, count = 500000000 in while()
                15:25:30.352 [     work] flag = false, count = 500000000 종료

            volatile o
                15:29:23.806 [     work] flag = true, count = 100000000 in while()
                15:29:23.985 [     main] flag = false, count = 123342843 in main
                15:29:23.985 [     work] flag = false, count = 123342843 종료
         */

    }

    static class MyTask implements Runnable {

        boolean flag = true;
        long count;
        // volatile boolean flag = true;
        // volatile long count;

        @Override
        public void run() {
            while (flag) {
                count++;
                // 1억번에 한 번씩 출력한다.
                if (count % 100_000_000 == 0) {
                    log("flag = " + flag + ", count = " + count + " in while()");
                }
            }
            log("flag = " + flag + ", count = " + count + " 종료");
        }

    }

}
```

</div>
</details>
  
### ***자바 메모리 모델(JMM: Java Memory Model)***

- 자바 프로그램이 어떻게 메모리에 접근하고 수정할 수 있는지를 규정
- 특히 멀티 스레드 프로그래밍에서 스레드 간의 상호작용을 정의

#### ***happens-before***

- JMM에서 스레드 간의 작업 순서를 정의한다. 
- happens-before 관계는 스레드 간의 메모리 가시성을 보장하는 규칙이다.
- A 스레드가 B 스레드보다 happens-before 관계에 있다면 A 스레드에서 변경된 내용은 B 스레드가 시작되기 전에 모두 메모리에 반영된다. 
- happens-before 관계를 활용하여 프로그래머가 멀티스레드 프로그램을 작성할 때 예상치 못한 동작을 피할 수 있다.

- 스레드 시작 규칙
  - 한 스레드에서 Thread.start() 를 호출하면, 해당 스레드 내의 모든 작업은 start() 호출 이후에 실행된 작업보다 happens-before 관계가 성립한다.
  - 
      ```java 
      Thread t = new Thread(task);
      t.start(); 
      ```
    - 여기에서 start() 호출 전에 수행된 모든 작업은 새로운 스레드가 시작된 후의 작업보다 happens-before 관계를 가진다.
  
- 스레드 종료 규칙
  - 한 스레드에서 Thread.join() 을 호출하면, join 대상 스레드의 모든 작업은 join() 이 반환된 후의 작업보다 happens-before 관계를 가진다. 예를 들어, thread.join() 호출 전에 thread 의 모든 작업이 완료되어야 하며, 이 작업은 join() 이 반환된 후에 참조 가능하다.
  
- 인터럽트 규칙
  - 한 스레드에서 Thread.interrupt() 를 호출하는 작업이, 인터럽트된 스레드가 인터럽트를 감지하는 시점의 작업보다 happens-before 관계가 성립한다. 즉, interrupt()  호출 후, 해당 스레드의 인터럽트 상태를 확인하는 작업이 happens-before 관계에 있다. 만약 이런 규칙이 없다면 인터럽트를 걸어도, 한참 나중에 인터럽트가 발생할 수 있다.
  
- 객체 생성 규칙
  - 객체의 생성자는 객체가 완전히 생성된 후에만 다른 스레드에 의해 참조될 수 있도록 보장한다. 즉, 객체의 생성자에서 초기화된 필드는 생성자가 완료된 후 다른 스레드에서 참조될 때 happens-before 관계가 성립한다.
  
- 모니터 락 규칙
  - 한 스레드에서 synchronized 블록을 종료한 후, 그 모니터 락을 얻는 모든 스레드는 해당 블록 내의 모든 작업을 볼 수 있다. 예를 들어, synchronized(lock) { ... }  블록 내에서의 작업은 블록을 나가는 시점에 happensbefore 관계가 형성된다. 뿐만 아니라 ReentrantLock 과 같이 락을 사용하는 경우에도 happens-before 관계가 성립한다.
  
- 전이 규칙 (Transitivity Rule)
  - 만약 A가 B보다 happens-before 관계에 있고, B가 C보다 happens-before 관계에 있다면, A는 C보다 happensbefore 관계에 있다.
  
***정리***  
**volatile 또는 스레드 동기화 기법(synchronized, ReentrantLock)을 사용하면 메모리 가시성의 문제가 발생하지 않는다.**  
  
<br>
<hr>

# ***동기화 - synchronized***

- 멀티스레드를 사용할 때, 가장 주의해야할 점은 같은 자원(리소스)에 여러 스레드가 동시에 접근할 때 발생하는 동시성 문제이다.
- 공유 자원: 여러 스레드가 접근하는 자원(e.g. 인스턴스 필드)
- 멀티스레드를 사용할 때는 이런 공유 자원에 대한 접근을 적절하게 동기화(synchronization)해서 동시성 문제가 발생하지 않게 방지하는 것이 중요하다.
  
<details>
<summary><span style="color:orange" class="point"><b>동시성 문제</b></span></summary>
<div markdown="1">

```java
public interface BankAccount {
    boolean withdraw(int amount);
    int getBalance();
}

public class BankAccountV1 implements BankAccount {

    private int balance;
    public BankAccountV1(int initialBalance) {
        this.balance = initialBalance;
    }

    @Override
    public boolean withdraw(int amount) {

        log("거래 시작: " + getClass().getSimpleName());
        log("[검증 시작] 출금액: " + amount + ", 잔액: " + balance);

        if (balance < amount) {
            log("[검증 실패] 출금액: " + amount + ", 잔액: " + balance);
            return false;
        }
        log("[검증 완료] 출금액: " + amount + ", 잔액: " + balance);

        sleep(1000); // 출금에 걸리는 시간으로 가정
        balance = balance - amount;
        log("[출금 완료] 출금액: " + amount + ", 변경 잔액: " + balance);

        log("거래 종료");
        return true;

    }

    @Override
    public int getBalance() {
        return balance;
    }
}

public class WithdrawTask implements Runnable {

    private BankAccount bankAccount;
    private int amount;
    public WithdrawTask(BankAccount bankAccount, int amount) {
        this.bankAccount = bankAccount;
        this.amount = amount;
    }

    @Override
    public void run() {
        bankAccount.withdraw(amount);
    }

}

public class BankMain {

    public static void main(String[] args) throws InterruptedException {

        BankAccount account = new BankAccountV1(1000);

        // 한 계좌에서 출금을 2번한다.
        Thread t1 = new Thread(new WithdrawTask(account, 800), "t1");
        Thread t2 = new Thread(new WithdrawTask(account, 800), "t2");
        t1.start();
        t2.start();

        // 검증 완료까지 잠시 대기한다.
        sleep(500);
        log("t1 state: " + t1.getState());
        log("t2 state: " + t2.getState());

        // main 스레드는 join() 을 사용해서 t1 , t2 스레드가 출금을 완료한 이후에 최종 잔액을 확인한다.
        t1.join();
        t2.join();
        log("최종 잔액: " + account.getBalance());

        /*
            동시성 문제 발생
            
            16:40:01.144 [       t1] 거래 시작: BankAccountV1
            16:40:01.144 [       t2] 거래 시작: BankAccountV1
            16:40:01.155 [       t1] [검증 시작] 출금액: 800, 잔액: 1000
            16:40:01.155 [       t2] [검증 시작] 출금액: 800, 잔액: 1000
            16:40:01.157 [       t1] [검증 완료] 출금액: 800, 잔액: 1000
            16:40:01.157 [       t2] [검증 완료] 출금액: 800, 잔액: 1000
            16:40:01.630 [     main] t1 state: TIMED_WAITING
            16:40:01.630 [     main] t2 state: TIMED_WAITING
            16:40:02.166 [       t1] [출금 완료] 출금액: 800, 변경 잔액: 200
            16:40:02.166 [       t2] [출금 완료] 출금액: 800, 변경 잔액: -600
            16:40:02.167 [       t1] 거래 종료
            16:40:02.168 [       t2] 거래 종료
            16:40:02.170 [     main] 최종 잔액: -600
         */

    }

}
```
> t1이 아직 잔액(balance)를 줄이지 못했기 때문에 t2는 검증 로직에서 현재 잔액을 1000원으로 확인한다.  
> 참고: balance 값에 volatile 을 도입하면 문제가 해결되지 않을까? 그렇지 않다. volatile 은 한 스레드가 값을 변경했을 때 다른 스레드에서 변경된 값을 즉시 볼 수 있게 하는 메모리 가시성의 문제를 해결할 뿐이다. 예를 들어 t1 스레드가 balance 의 값을 변경했을 때, t2 스레드에서 balance 의 변경된 값을 즉시 확인해도 여전히 같은
문제가 발생한다. 이 문제는 메모리 가시성 문제를 해결해도 여전히 발생한다.

</div>
</details>
  
- 이런 문제가 발생하는 근본 원인은 여러 스레드가 함께 사용하는 공유 자원을 여러 단계로 나누어 사용하기 때문이다. 
- 공유 자원
  - balance는 여러 스레드가 함께 사용하는 공유 자원이다.
  - A 스레드가 공유 자원에 접근하는 로직을 실행중일 때, B 스레드가 공유자원에 접근하면 안된다.

### ***임계 영역(Cretical Section)***

- **여러 스레드가 동시에 접근해서는 안되는 공유 자원을 접근하거나 수정하는 부분**
- 출금을 진행할 때 잔액을 검증하는 단계부터 잔액의 계산을 완료할 때 까지가 임계 영역이다. 이런 임계 영역은 한 번에 하나의 스레드만 접근할 수 있도록 안전하게 보호해야 한다.
- 자바는 synchronized 키워드를 통해 아주 간단히 임계 영역을 보호할 수 있다. 
  

<details>
<summary><span style="color:orange" class="point"><b>synchronized Code 1</b></span></summary>
<div markdown="1">

```java
/**
 * 각 메소드에 synchronized 키워드 추가 
 * 메서드를 synchronized 로 선언해서, 메서드에 접근하는 스레드가 하나뿐이도록 보장한다.
 */
public class BankAccountV2 implements BankAccount {

    private int balance;
    public BankAccountV2(int initialBalance) {
        this.balance = initialBalance;
    }

    @Override
    public synchronized boolean withdraw(int amount) {

        log("거래 시작: " + getClass().getSimpleName());
        log("[검증 시작] 출금액: " + amount + ", 잔액: " + balance);

        if (balance < amount) {
            log("[검증 실패] 출금액: " + amount + ", 잔액: " + balance);
            return false;
        }
        log("[검증 완료] 출금액: " + amount + ", 잔액: " + balance);

        sleep(1000); // 출금에 걸리는 시간으로 가정. sleep 을 주석처리 해도 동시성 문제 해결 불가능하다.
        balance = balance - amount;
        log("[출금 완료] 출금액: " + amount + ", 변경 잔액: " + balance);

        log("거래 종료");
        return true;

    }

    @Override
    public synchronized int getBalance() {
        return balance;
    }
}

public class BankMain {

    public static void main(String[] args) throws InterruptedException {

//        BankAccount account = new BankAccountV1(1000);
        BankAccount account = new BankAccountV2(1000); // 인스턴스 락 존재

        // 한 계좌에서 출금을 2번한다.
        Thread t1 = new Thread(new WithdrawTask(account, 800), "t1");
        Thread t2 = new Thread(new WithdrawTask(account, 800), "t2");
        t1.start();
        t2.start();

        // 검증 완료까지 잠시 대기한다.
        sleep(500);
        log("t1 state: " + t1.getState());
        log("t2 state: " + t2.getState());

        // main 스레드는 join() 을 사용해서 t1 , t2 스레드가 출금을 완료한 이후에 최종 잔액을 확인한다.
        t1.join();
        t2.join();
        log("최종 잔액: " + account.getBalance());

        /*
            synchronized 키워드로 인한 동시성 문제 해결
            
            17:15:38.879 [       t1] 거래 시작: BankAccountV2
            17:15:38.889 [       t1] [검증 시작] 출금액: 800, 잔액: 1000
            17:15:38.890 [       t1] [검증 완료] 출금액: 800, 잔액: 1000
            17:15:39.369 [     main] t1 state: TIMED_WAITING
            17:15:39.369 [     main] t2 state: BLOCKED
            17:15:39.891 [       t1] [출금 완료] 출금액: 800, 변경 잔액: 200
            17:15:39.892 [       t1] 거래 종료
            17:15:39.893 [       t2] 거래 시작: BankAccountV2
            17:15:39.895 [       t2] [검증 시작] 출금액: 800, 잔액: 200
            17:15:39.896 [       t2] [검증 실패] 출금액: 800, 잔액: 200
            17:15:39.897 [     main] 최종 잔액: 200
         */

    }

}
```

</div>
</details>

- 모니터 락
  - 모든 인스턴스는 내부에 자신만의 락(lock)을 가지고 있는데 해당 락을 모니터 락(Monitor Lock) 이라고 한다. 
  - 스레드가 synchronized 키워드가 있는 메서드에 진입하려면 반드시 해당 인스턴스의 락이 있어야 한다.
  
- 내부 흐름
  - t1: withdraw() 호출 → 인스턴스 lock 획득 → t2: lock 획득 시도 → 해당 lock을 t1이 가지고 있어 lock을 획득할 때까지 RUNNABLE 상태에서 BLOCKED 상태로 무한정 대기 → t1: 메소드 호출 종료 후 lock 반납 → t2: lock 획득 성공 → t2: BLOCKED 상태에서 RUNNABLE 상태로 전환 → t2: 코드 실행
  
- 참고
  - 락을 획득하는 순서는 보장되지 않는다.
  - volatile 를 사용하지 않아도 synchronized 안에서 접근하는 변수의 메모리 가시성 문제는 해결된다.
  
<details>
<summary><span style="color:orange" class="point"><b>synchronized Code 2</b></span></summary>
<div markdown="1">

```java
public class BankAccountV3 implements BankAccount {

    private int balance;
    public BankAccountV3(int initialBalance) {
        this.balance = initialBalance;
    }

    @Override
    public boolean withdraw(int amount) {

        log("거래 시작: " + getClass().getSimpleName());

        synchronized (this) {
            log("[검증 시작] 출금액: " + amount + ", 잔액: " + balance);
            if (balance < amount) {
                log("[검증 실패] 출금액: " + amount + ", 잔액: " + balance);
                return false;
            }
            log("[검증 완료] 출금액: " + amount + ", 잔액: " + balance);
            sleep(1000); // 출금에 걸리는 시간으로 가정. sleep 을 주석처리 해도 동시성 문제 해결 불가능하다.
            balance = balance - amount;
            log("[출금 완료] 출금액: " + amount + ", 변경 잔액: " + balance);
        }

        log("거래 종료");
        return true;

    }

    @Override
    public synchronized int getBalance() {
        return balance;
    }
}
```
> 필요한 코드만 안전한 임계 영역으로 만든다.

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>Test Code 1</b></span></summary>
<div markdown="1">

```java
public class SyncTest1BadMain {

    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        Runnable task = new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10000; i++) {
                    counter.increment();
                }
            }
        };
        Thread thread1 = new Thread(task);
        Thread thread2 = new Thread(task);
        thread1.start();
        thread2.start();

        // join() 을 호출하는 main 스레드는 해당 스레드들의 상태가 terminated 가 될 때까지 기다린다.
        thread1.join();
        thread2.join();
        System.out.println("결과: " + counter.getCount());
        /*  
            결과: 20000 이하

            공유 변수 경합 상태에 의해 두 스레드가 계산한 값을 거의 동시에 count 에 저장하게 되면,
            실제로는 두 번 증가해야 할 count 가 한 번만 증가하게 된다.
         */
    }

    static class Counter {
        private int count = 0;
        public void increment() {
            count = count + 1;
        }
        public int getCount() {
            return count;
        }
    }

}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>Test Code 2</b></span></summary>
<div markdown="1">

```java
/*
    실행 결과 예측
 */
public class SyncTest2BadMain {

    public static void main(String[] args) throws InterruptedException {

        MyCounter myCounter = new MyCounter();
        Runnable task = new Runnable() {
            @Override
            public void run() {
                myCounter.count();
            }
        };
        Thread thread1 = new Thread(task, "Thread-1");
        Thread thread2 = new Thread(task, "Thread-2");
        thread1.start();
        thread2.start();
    }

    static class MyCounter {
        public void count() {
            int localValue = 0;
            for (int i = 0; i < 1000; i++) {
                localValue = localValue + 1;
            }
            log("결과: " + localValue);
        }
    }

    /*
        18:32:10.673 [ Thread-1] 결과: 1000
        18:32:10.673 [ Thread-2] 결과: 1000

        localValue 는 지역 변수
        지역 변수는 절대로! 다른 스레드와 공유되지 않는다.

     */

}
```

</div>
</details>

<details>
<summary><span style="color:orange" class="point"><b>Test Code 3</b></span></summary>
<div markdown="1">

```java
class Immutable {

  private final int value;

  public Immutable(int value) {
    this.value = value;
  }

  public int getValue() {
    eturn value;
  }

}
/*
  value 필드(멤버 변수)는 공유되는 값이다. 멀티스레드 상황에서 문제가 될 수 있을까?
  
  여러 스레드가 공유 자원에 접근하는 것 자체는 사실 문제가 되지 않는다. 진짜 문제는 공유 자원을 사용하는 중간에 다른 스레드가 공유 자원의 값을 변경해버리기 때문에 발생한다. 결국 변경이 문제가 되는 것이다.
  value는 상수이므로 변경 자체가 불가능하여 문제가 되지 않는다. 
 */
```

</div>
</details>

***정리***  
**synchronized: 임계영역에서 하나의 스레드만 보장하는 것**  
**임계영역: 여러 스레드가 동시에 접근해서는 안되는 공유 자원을 접근하거나 수정하는 부분**  