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
        log("runFlag: true -> false");
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
  
***요약***  
**volatile 또는 스레드 동기화 기법(synchronized, ReentrantLock)을 사용하면 메모리 가시성의 문제가 발생하지 않는다.**  
  
<br>
<hr>

# ***동기화 - synchronized***

