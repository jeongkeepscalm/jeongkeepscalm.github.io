---
title: "[U-KNOU] UNIX 시스템"
description: "[U-KNOU] UNIX 시스템"
date: 2024-08-20
categories: [ U-KNOU, UNIX System ]
tags: [ U-KNOU, UNIX System ]
---

# ***1장. 유닉스와 리눅스***

### ***유닉스 개요*** 

- UNIX의 특징
  - 다중 사용자, 다중 작업을 지원하는 신뢰성 높은 운영체제
  - 뛰어난 이식성
  - 강력한 네트워킹 기능
  - 셸 스크립트
  - 파이프라인
  - 명령행 기반 인터페이스(CLI)
  - 단순하고 모듈화된 설계
  
- 유닉스와 리눅스
  - UNIX의 무료 공개 버전
  - 초기에 PC용 운영체제로 개발되었음
  
- UNIX 발전사
  - 최초의 UNIX
    - Multics
      - `assembly 언어`로 작성된 최초의 `시분할 운영체제`(1969년)
    - Unics → Unix
      - 작고 심플한 운영체제로 다시 작성됨
      - `C언어`로 다시 작성(1973년)
  - 대표적인 UNIX 시스템
    - BSD계열: Free BSD, SunOS, GNU/Linux
    - System V계열: HP-UX(HP), AIX(IBM), Solaris(Oracle)
    - Linux

### ***리눅스 개요***

- 리눅스 등장
  - 리처드 스톨만 `GNU 프로젝트` 시작(1983)
  - 소프트웨어 상업화 반대, 소스코드 공유, 자유로운 사용 및 배포 주장
  - `GNU 선언문`(Menifesto) 발표(1985) 
  - `GPL` 발표(1989)
  - 현재 Fres Software Foundation(FSF) 이름으로 활동 == OSS
  - `리눅스 토발즈`가 리눅스 커널 작성하여 발표(1991)
    - 커널: 하드웨어 제어하고 응용 프로그램과의 상호작용을 제공하는 운영체제의 핵심
  - MCC Interim 리눅스 발표: 최초 리눅스 배포판(1992)
  - IBM과 Oracle이 리눅스 지원 발표(1998)
  
- 리눅스 특징
  - 다중 사용자, 다중 작업 지원
  - 뛰어난 이식성
  - 모듈화되어 업데이트 용이
  - CUI, GUI 지원
  - 오픈 소스
  - 여러 종류의 파일 시스템 지원
  - 효율적인 하드웨어 활용
  - 다양한 응용 프로그램과 소프트웨어 개발 환경 제공

### ***오픈소스와 라이선스***

- 오픈소스 소프트웨어(OSS) <-> proprietary(closed) 소프트웨어
  
- 소프트웨어 라이선스
  - 지식재산권으로 보호받는 저작물
  - 저작자가 공표, 복제, 배포, 개작할 권한을 갖는다.
  - 타인에게 일정한 대가나 조건을 전제로 권한을 부여할 수 있다. 
  - OSS도 보호받을 저작물이며 OSS 라이선스 존재
  
- 오픈소스의 장점
  - 프로그램 개발에 효율적
  - 여러사람에 의해 테스트되어 안전
  - 오픈소스 운동의 철학: 커뮤니티를 통한 협력, 공유, 개방이 발전을 위해 효율적이다. 
  
- GNU 프로젝트와 자유 소프트웨어 운동
  - 목적에 상관없이 프로그램 실행
  - 프로그램을 복제 및 공유
  - 소스코드 개작
  - 개작된 프로그램 배포
  
- 리눅스의 라이선스
  - 리눅스는 독점/베타되지 않는 `자유 소프트웨어`이다. 
  - 주로 `GPL`(GNU General Public License)를 따른다. 
  - 일부는 `LGPL`(GNU Lesser General Public License)를 따른다.
  - X Window는 MIT 라이선스
  
- GNU GPL
  - 자유롭게 사용, 수정, 복제, 배포
  - 수정하여 배포할 경우 소스코드 공개 필수
  - 수정된 소프트웨어에 저작권자를 표시하고 똑같이 GPL 조건으로 배포해야 한다. 
  
- 다양한 오픈소스 소프트웨어 라이선스
  - GPL > LGPL > MPL
    - 카피 레프트 라이선스(소스코드 공개)
    - LGPL: 주로 오픈소스 라이브러리에 적용된다. 
    - MPL 코드와 결합하여 프로그램 만들때, MPL 코드 없는 파일은 공개 의무 없다. 
    - 소스코드 공개 범위는 다르게 정의된다. 
  - BSD, Apache, MIT 라이선스
    - 배포시 소스코드의 비공개 허용
    - Permissive 라이선스
    - 코드의 재사용성 높이려는 목적

### ***리눅스 배포판***

- 리눅스 배포판 역사
  - 리눅스 배포판: 리눅스 커널 외 시스템 유틸리티, 응용프로그램, 설치 프로그램 포함
  - 리눅스 커널 개발(1991년) 
  - 최초의 배포판 발표(1992년)
  - 주요 배포판 배포(1993년)
  
- 주요 리눅스 배포판 종류
  - Debian 계열: Debian, Ubuntu 등..
  - Slackware 계열: Slackware, SUSE 등..
  - Red Hat 계열: Redhat, Fedora, CentOS, Rocky Linux 등..
  
- Debian 리눅스
  - 자유 운영체제
  - Ian Murdock 비영리 조직으로 설립(1994년)
  - GNU의 공식적인 후원을 받는 유일한 배포판
  - 세 가지 릴리즈 유지
    - stable, testing, unstable
    - 숫자 버전 외 코드명을 가진다. 
    - unstable 버전의 코드명은 항상 sid
  
- Red Hat 리눅스
  - 가장 널리 알려진 리눅스 배포판
  - Red Hat Linux: 2003년 지원 중단(마지막 버전 9)
  - Red Hat Enterprise Linux(RHEL): 최신 버전 9
  - Fedora & CentOS 오픈소스 프로젝트 지원
  - RPM(Red Hat Package Manager)
  
- CentOS 리눅스
  - Red Hat 리눅스로부터 파생
  - Red Hat Enterprise Linux(RHEL) 기반 무료 버전
  - 서버용으로 많이 사용
  - 현재 RHEL의 업스트림 버전인 'CentOS Stream' 만 지원됨
  
- Rocky 리눅스
  - 기존 CentOS 리눅스의 대체품
    - CentOS 릴리즈 정책이 변경됨
    - CentOS Stream은 RHEL 안정적 버전이 아닌 개발 버전
  - RHEL 소스 코드 기반의 다운스트림 버전
    - RHEL과 실행 코드 호환
  
- SuSE 리눅스
  - Slackware 리눅스로부터 파생
  - 독일에서 만듦(유럽에서 많이 사용)
  - Software Und System Entwicklung 약자
  - 기능, 안정성, 보안 기능 포함
  - Novell 사에 의해 지원
  - 두 가지 종류
    - SUSE Linux Enterprise(유료)
    - openSUSE(무료)    
  
- Slackware 리눅스
  - SLS 리눅스로부터 파생
  - 가장 오래된 배포판
  - Patrick Volkerding 이 만듦(1992년)
  - the KISS principle 
    - 간결함
    - 현재 GNOME desktop이 제외되어 있다.
  - 유닉스 자체 학습에 적합
  
- Ubuntu 리눅스
  - Debian 리눅스로부터 파생
  - 영국 기업 Canonical 의 지원
  - GNOME 사용
  - Debian 리눅스에 비해 사용 편의성 높음
  - 개인 사용자에게 인기

<br>
<hr>

# ***3장. 셸 사용하기***

- 셸(shell)
  - 명령어를 해석하고 관리하는 프로그램
  - 커널과 사용자 간의 가교 역할을 하는 명령어 해석기
  
- Bash Shell(Bourne Again Shell)
  - 리눅스 배포판에서 기본 셸로 사용된다.
  - $: 기본 프롬프트
  - #: 루트 사용자
  

### ***기본 명령어***  

```bash
whoami
who -u -H
ls -l /etc/passwd     # ls: 파일/디렉토리 목록의 정보
grep ojg /etc/passwd

# 기본 셸 변경
chsh ${options} ${username}

date
pwd
users

# type
type cd
type case
type rm
type -a ls

# which
which rm

# whereis: which 명령어와 유사하나 소스와 매뉴얼 페이지가 존재할 경우 해당 파일도 찾아 출력
whereis which

# manual
man whereis
mkdir --help

# history: 이전 명령어 불러오기 
history 30
!22 

# ;: 명령어 구분
cd; ls -l; pwd

# |, >: 파이프와 입출력 리다이렉션
cat /etc/passwd | sort        
cat /etc/passwd | sort | more
sort < /etc/passwd # == cat /etc/passwd | sort
echo "Hello, World!" > testFile.txt

# /usr/include/ 디렉토리 내의 모든 파일에서 typedef 문자열을 포함하는 모든 줄이 typedef.out 파일에 저장
grep typedef /usr/include/* > typedef.out

# 명령 치환($ 변수가 먼저 실행)
ls -l $(which passwd)
echo "There are $(ls | wc -w) files in this directory."

# 인용부호 
# '': 특수문자 기능 제거
echo "$(date)"
echo "\$(date)"
echo Here     is
echo "Here     is"
echo $(cal)
echo "$(cal)"
echo 'Today is $(date)'

# 수식과 변수의 확장(Arithmetic Expansion)
echo "I am $[2024-1993] years old."
echo "I am $((2024-1993)) years old."

# 환경변수: 현재 셸로부터 새로운 서브셸이 만들어 질 때 전달되는 변수
FOO=bar
export FOO
sh  # 서브셸
echo $FOO
printenv FOO
unset FOO
``` 

<br/>

### ***로그인과 환경 설정 파일***

- 로그인 셸
  - 로그인 성공시 수행되는 셸
  - su -l [username]: 유저 전환
  
- 셸 시작할 때 수행되는 초기화 스크립트
  - /etc/profile
    - 모든 사용자에게 적용되는 환경 설정 파일
  - ~/.bash_profile
    - 로그인 시 수행
    - 개별 사용자에게 적용되는 환경 설정 파일
  - ~/.bashrc
    - 로그인 후 셸을 시작할 때 수행
  - /etc/bashrc
    - 로그인 후 셸을 시작할 때 가장 먼저 수행
    - 모든 사용자에게 적용되는 환경 설정 파일
  - ~/.bash_logout
    - 로그아웃 수행 시 실행되는 스크립트

<br/>
<hr>

# ***4장. 파일과 디렉토리***

- 리눅스 시스템은 전체적으로 하나의 파일 시스템으로 관리된다.
- 윈도우 운영체제는 C:\ 또는 D:\ 처럼 드라이브마다 루트 디렉토가 존재하지만 리눅스에서는 단 하나의 루트 디렉토리만 존재한다. 

<br>

- 파일의 종류
  - 디렉토리
    - 파일이나 서브디렉토리의 이름과 위치 정보를 가지고 있는 파일
    - 리눅스에서는 디렉토리도 파일로 취급한다. 
  - 심벌릭 링크 
    - 윈도우 운영체제의 '바로가기'와 유사
    - 절대경로/상대경로를 사용하여 다른 파일이나 디렉토리를 카리킨다. 
  - 블록 디바이스
    - 블록 단위로 데이터를 읽고 쓸 수 있는 디바이스
    - e.g. sda1, CD-ROM
  - 문자 디바이스
    - 한 번에 한 문자씩 데이터를 주고받는 디바이스
  - 파이프 디바이스
    - 프로세스 간 통신을 위한 특수한 파일
    - mkfifo 명령을 사용하여 생성 가능
  - 소켓 디바이스
    - 소켓은 한 호스트 안에서 프로세스 간 통신의 목적으로 자두 사용되는 인터페이스이다. 
    - 소켓 파일은 'Unix domain socket'을 표현하며 바이트 스트림 외에 데이터그램 전송도 가능하다.
  
- 디바이스 드라이버
  - 하드웨어를 제어하는 프로그램
  - 커널에서 디바이스 관련 코드가 분리된 것
  - 프로그램은 디바이스 파일을 이용해 디바이스를 보통의 파일처럼 다룬다. 
  - 
    ```bash
      # 다바이스 출력
      ls /dev
      ls -l /dev/sda*
    ```

### ***기본 명령어***

```bash
# -l(long): 긴 포맷의 출력 제공
# -a(all): 숨긴 파일 포함
# -t(time): 수정시간 기준으로 파일을 정렬
# -S(size): 파일 크기 순서로 결과 출려
ls -lat

# 파일 유형 확인
file typedef.out
    typedef.out: ASCII text

# 현재 작업 디렉토리 확인 (pwd: print working directory)
pwd

# 파일 생성
mkdir dir1
rmdir dir1

# 파일 복사
echo "Hello, World!" > world.txt
echo "" > world2.txt
copy -i world.txt world2.txt # 덮어쓰기
mkdir testFolder
cp world.txt testFolder # 특정파일 특정폴더로 복사

# 파일 이동
mv -i testFile.txt testFile2.txt testFolder
mv testFile.txt testFile2.txt ../

# 파일 삭제
# -r: 디렉토리를 재귀적으로 삭제
# -f: 묻지않고 무조건 삭제
rm -rf world.txt
```

### ***접근권한 명령어***

- 9개의 비트를 사용하여 파일이나 디렉토리에 소유자(u), 그룹(g), 기타(o)의 세 부류 각각에 관해 읽기, 쓰기, 실행 권한을 설정할 수 있다. 

```bash
# 권한 확인
# -: 정규파일
# 소유자와 그룹 구성원 외의 사용자는 dog.txt 파일의 내용을 볼 수는 있으나 내용을 수정하거나 삭제할 수는 없다. 
ls -l dog.txt
    -rw-rw-r--. 1 ojg ojg 789 12월 2 18:43 dog.txt

# 디렉토리 접근 권한 확인
mkdir dir1
ls -ld dir1

# 접근권한 변경
# 읽기: 4, 쓰기: 2, 실행: 1
# e.g. chmod 755: rwxr-xr-x
# -R: 해당 디렉토리에 포함된 모든 파일 및 디렉토리의 권한 변경
mkdir testFolder
chmod 644 testFolder
ls -ld testFolder
    drw-r--r-- 2 ojg ojg 4096 Nov 25 14:09 testFolder/
chmod -R 777 testFolder/

ls -ld testFolder
    drwxr-xr-x 2 ojg ojg 4096 Nov 25 14:09 testFolder
chmod go+w testFolder
ls -ld testFolder
    drwxrwxrwx 2 ojg ojg 4096 Nov 25 14:09 testFolder

# 초기 접근권한 설정
# 파일 생성: 666 - umask 
# 폴더 생성: 777 - umask
umask 002
umask 033 # == umask u=rwx,go=r

# 파일 소유자 변경
chown [user] file/folder
```

### ***링크***

- 하드 링크
  - 하나의 파일에 다른 이름을 부여하여 다른 이름으로도 다룰 수 있게 하는 것
  - 하드 링크 생성 시 링크카운트 증가. 삭제 시 링크카운트 감소
  - 실제 원본 파일과 하드 링크는 같은 것
- 심볼릭 링크
  - 원본 파일을 가리키는 바로가기 목적의 새로운 파일
  - 심볼릭 링크 삭제시 링크만 삭제하는 것
  - 디렉토리의 경우 심볼릭 링크만 만들 수 있다. 

```bash
# 링크생성
# -s: 심볼릭 링크 생성(해당 옵션이 없으면 하드 링크 생성)
ln -s testFolder testFolder.s1
ls -li testFolder*
  2245367 lrwxrwxrwx 1 ojg ojg   10 Nov 25 15:22 testFolder.s1 -> testFolder
touch testFolder.s1/newfile.txt
rm testFolder.s1/newfile.txt
```

### ***파일 내용 확인***

```bash
more /etc/services
less /etc/passwd

# -f: 계속하여 지정된 파일을 감시
head -5 /etc/passwd
tail -f /var/log/messages

cat > cat1.txt
    test 1
    ctrl + d
cat cat1.txt

cat > cat2.txt
    test 2
    ctrl + d
cat cat2.txt

cat cat*.txt > total.txt
cat total.txt
```

<br>
<hr>

# ***5장. 리눅스의 시작과 종료***

- 부트스트래핑(bootstrapping) == 부팅
- 부트 스트랩 로더(부트 로더)
  - 운영체제를 부팅하기위한 부트 프로그램
- 부트스트래핑 과정
  1. 전원 켜기 (Power On)  
  2. BIOS 실행  
    - 프로세서가 ROM에 저장된 BIOS(Basic Input/Output System)를 실행
    - BIOS는 하드웨어 초기화 및 시스템 구성 요소를 검사
  3. 부트 로더 로드  
    - BIOS는 부트 디바이스(예: 하드 드라이브, SSD)의 MBR(Master Boot Record)을 읽는다.
    - MBR에 저장된 부트 로더를 메모리에 로드하고 실행
  4. 운영 체제 로드  
    - 부트 로더는 운영 체제를 메모리에 로드하고 제어를 운영 체제에 넘김

### ***리눅스의 부트스트래핑***

- 서버용 리눅스는 시스템 점검이 아닌 이상 시스템을 종료하지 않는다. 
- 리눅스 부트 로더 프로그램
  - 과거: LILO(LInux LOader)
  - 현재: GRUB(GRand Unified Bootloader)
  
- 리눅스 부트스트래핑 절차
  1. BIOS/부트 펌웨어가 부트 로더를 로드하고 실행시킨다.
  2. 부트 로더가 디스크에서 커널 이미지를 찾아 메모리에 로드하고 시작시킨다.
  3. 커널이 디바이스를 찾고 디바이스 드라이버를 로드
  4. 커널이 루트파일 시스템을 마운트
  5. 커널은 /sbin/init 프로그램을 시작하고 제어권을 넘긴다. 
  6. /sbin/init 프로그램은 시스템 초기화 작업을 실행
  7. 사용자가 로그인을 수행할 수 있도록 화면 등장
  
- 초기화 데몬(초기화 시스템)
  - `systemd`: 초기화 데몬으로 초기화 작업을 수행한다. 
  - ps -e | head 명령어로 PID 1 프로세스가 systemd인 것을 확인 가능

### ***systemd***

- 정의
  - `리눅스 운영체제의 시스템 및 서비스 관리자`
  - 커널이 사용자 환경을 준비하기 위해 가장 처음 실행시키는 사용자 프로세스
  - PID 1번을 가지는 특별한 프로세스
  - 커널 프로세스를 제외한 모든 사용자 프로세스의 부모/조상 프로세스
  - 초기화 데몬이라고도 불림
  - 커널은 systemd를 실행시킨 후 모든 제어권을 systemd에 넘긴다. 
  
- 기능 요약
  - 초기화
  - 파일 시스템 마운트
  - 시스템 서비스 활성화
  - 의존성 해결
  - 로그인 서비스 시작
  - 시스템 상태 모니터링
  - 데몬 관리
  
- `유닛`
  - systemd가 관리하는 대상을 의미
  - systemd에서 사용하는 유닛의 종류
    - service
    - target
    - device
    - mount
    - path
    - socket
    - snapshot
  
- systemd의 기본 설정 파일
  - /etc/systemd/system.conf
  
- `런레벨(Runlevel)`
  - 전통적인 System V(init) 기반의 리눅스 시스템에서 사용되는 시스템 상태를 나타내는 숫자(0~6)
  - 주요 값의 의미
    - 0: 시스템 종료 (halt)
    - 1: 단일 사용자 모드 (Single User Mode) - 관리자 유지보수를 위한 모드
    - 2: 다중 사용자 모드, 네트워크 기능 없음
    - 3: 다중 사용자 모드, 텍스트 기반 (CLI 환경)
    - 4: 사용자 정의 (일반적으로 사용되지 않음)
    - 5: 다중 사용자 모드, GUI 환경
    - 6: 시스템 재부팅 (reboot)
  
- `타깃 (Target)`
  - 현대 리눅스 배포판에서 사용하는 Systemd의 개념으로, 런레벨을 대체하는 방식. 시스템의 상태를 더 유연하고 구체적으로 정의
  - 주요 값의 의미
    - poweroff.target: 시스템 종료 (런레벨 0과 유사)
    - rescue.target: 단일 사용자 모드 (런레벨 1과 유사)
    - multi-user.target: 다중 사용자 모드, CLI 환경 (런레벨 3과 유사)
    - graphical.target: 다중 사용자 모드, GUI 환경 (런레벨 5와 유사)
    - reboot.target: 시스템 재부팅 (런레벨 6과 유사)
  - 
    ```bash
      systemctl get-default 
        graphical.target
      systemctl set-default graphical.target

      systemctl isolate multi-user.target
      systemctl isolate graphical.target
    ```
  
***서비스 실행과 상태를 확인을 위한 명령어***  
```bash
systemctl start name.service
systemctl stop name.service
systemctl restart name.service
systemctl try-restart name.service
systemctl reload name.service
systemctl status name.service
systemctl is-active name.service
systemctl list-units --type service --all
```
  
***서비스 활성화와 서비스 종속성 확인을 위한 명령어***  
```bash
systemctl enable name.service
systemctl disable name.service
systemctl status name.service
systemctl is-enabled name.service
systemctl list-unit-files name.service
systemctl list-depencencies --after name.service
systemctl list-depencencies --before name.service
```

### ***웹 콘솔 사용***

```bash
sudo apt update
sudo apt install cockpit
sudo systemctl enable --now cockpit.socket
sudo systemctl status cockpit.socket
```
> localhost:9090 접속 가능  

### ***시스템 종료***

```bash
# 전원 관리 systemctl 명령어
systemctl halt          # 시스템 종료
systemctl poweroff      # 시스템 종료 후 전원 끔
systemctl reboot
systemctl suspend       # 시스템 일시 중단
systemctl hibernate     # 시스템 최대 절전모드 전환
systemctl hybrid-sleep  # 최대 절전모드 + 일시 중단 모드

# shutdown
# -r: 재부팅
# -H: 전원을 끄지 않고 시스템 종료
shutdown [options] time [message]
showdown -r + 10        # 10분뒤 재부팅
shutdown -c             # 이전 예약 셧다운 명령어 취소
```

### ***데스크톱***

- Rocky Linux / CentOS 같은 레드햇 계열의 리눅스에서 제공되는 데스크톱 환경
  - GNOME
    - C언어, macOS와 유사
    - GNOME3: 대부분 리눅스에서 기본으로 사용하는 데스크톱 환경
  - KDE
    - 윈도우 환경과 유사

<br/>
<hr>

# ***6장. 사용자 계정***

- 계정
  - 루트 계정
    - UID 0 
  - 사용자 계정
  - 시스템 계정(로그인 불가)

### ***기본 명령어***

```bash
# su: switch user
sudo su -
exit

# -c: 일회성 명령어 실행 후 기존 사용자로 돌아온다. 
sudo -c 'ls -l /root/*'

# 사용자 생성 및 비밀번호 설정
sudo useradd -c "test" testor
sudo passwd testor
```
> sudo를 사용한 명령 실행은 /etc/sudoers 파일의 설정에 근거한다.  

### ***사용자 계정 만들기***

- `/etc/passwd 파일`
  - 평문의 파일로 사용자 계정에 관한 정보를 가지고 있는 매우 중요한 파일
  - /etc/passwd 파일의 형식은 매우 엄격
  - 사용자 등록을 위해 이 파일을 직접 수정하는 것은 나쁜 방법이다. 
  - 사용자 계정외 관한 7개 필드
    - 사용자 계정
    - 비밀번호
    - 사용자 아이디
    - 그룹 아이디
    - 설명
    - 홈 디렉토리
    - 기본 셸
  
- `/etc/shadow 파일`
  - 실제 사용자의 비밀번호를 암호화시켜 저장한 파일
  - root 사용자만 읽기 권한을 갖는다.
  
- 사용자 생성 시, `/etc/login.defs`와 `/etc/default/useradd` 파일에 저장된 설정으로 계정의 기본값이 설정된다. 
  
- `/etc/skel 디렉토리`
  - 
    ```bash
      ls -a /etc/skel 
        .  ..  .bash_logout  .bashrc  .profile
    ```

### ***사용자 계정 수정, 삭제***

```bash
# ojg 계정에 root 그룹을 추가
usermod -g root ojg

# user 삭제
userdel -rf jg
```

### ***그룹 계정과 관리***

- `/etc/group`: 그룹 정보 저장
- `/etc/gshadow`: 그룹별로 암호화된 비밀번호

```bash
# 그룹 번호가 1100인 그룹 생성
groupadd -g 1100 sales

# 사용자 계정을 부 그룹을로 sales 그룹으로 추가한다.
# 각 사용자는 0개 이상의 부 그룹에 속할 수 있다.
usermod -aG sales ojg
id ojg

# 파일의 그룹을 sales로 지정
newgrp sales
touch file2
ls -l file2

# root 사용자만 가능
# 그룹생성 후 구성원 지정, 관리자 지정 후 관리자로 변경하여 비밀번호 설정 
groupadd -g 1101 marketing
gpasswd -M cskim,jjpark,kdhong marketing
gpasswd -A cskim
su -l cskim
gpasswd marketing

# 그룹명 변경
groupmod -n salesGroup sales

# 그룹 삭제
groupdel salesGroup
```
> /etc/group: 그룹 정보  
> /etc/gshadow: 그룹별로 암호화된 비밀번호  

<br>

⭐​ **정리**  
- root 사용자의 UID는 0
- sudo를 사용한 명령 실행은 /etc/sudoers 파일 설정에 근거
- 사용자 계정 생성과 관련있는 기본값은 /etc/login.defs, /etc/default/useradd 파일의 설정에 근거
- 패스워드 에이징
  - 관리자가 비밀번호 만료에 관한 정보 변경 시, useradd, usermod, passwd 명령 등을 사용하여 관리하는 방법
- 사용자 계정의 그룹 계정을 사용하여 그룹 단위로 권한을 부여할 수 있다. 

<br>
<hr>

# ***7장. 텍스트 편집***

***텍스트 편집***  

```bash
# 처음, 중간, 마지막 라인으로 이동
H M L

# 커서 위치의 한 문자를 삭제
x

# 현재 라인 삭제
dd

# 현재 라인 복사
yy

# 커서 오른쪽에 붙여넣기
# (복사된 텍스트가 라인이면 현재 커서라인 밑에 붙여넣기 실행)
p

# 단어 검색
# n: 다음 검색된 단어 보기
# ?: 역순 검색
/ojg
?ojg
?[oO]jg

# Search and Replace
# g: 전체 라인
# s: replace 수행
# this 를 포함하는 모든 라인에서 file -> File로 변경한다.
:g/this/s/file/File
# this is file. -> this is File.
# this is file. -> this is File.
# that is file.

```

***파일 찾기***  

```bash
locate .bashrc

# find [pathnames] [expression]
# find 검색은 상당한 오류메시지를 출력하므로 2> /dev/null 명령어를 붙인다.
# 2>: 표준 오류 리다이렉션
# /dev/null: 출력을 버린다. 
# i: 대소문자 구분 x
find /etc -name passwd
find /etc -name passwd 2> /dev/null
find /etc -iname "*passwd*" 2> /dev/null

# |: find 명령과 다른 프로그램을 연결 시켜준다. 
# 파일 총 개수 출력
find ~ | wc -l

# 현재 위치에서의 디렉토리 개수 출력
find . -type d | wc -l

# 현재 위치에서의 파일 개수 출력
find . -type f | wc -l

# 여러 파일 생성
touch memo{1..5}
touch {a..c}{1..4} # a1 ... a4, b1 ... b4, c1 ... c4

# 찾은 파일 출력 후 삭제
find . -name "memo*" -print
find . -name "memo*" -delete

# 여러 예제들
find /usr/share -size +10M
find /home -user ojg -ls
find /home -user ojg -or -group staff -ls
find /bin -perm 755 -ls
find /home/ojg/ -perm -444 -type d -ls
```

***파일 내용 검색***  

```bash
grep ojg /etc/passwd

# r: 명시된 디렉토리의 서브디렉토리들도 다 검색
grep -r updatedb /etc

# 파이프 기능을 사용하여 grep 명령과 연결
ip addr show | grep inet
```

<br>

⭐​ **정리**  
- vi 사용 편집 작업은 명령모드, 입력모드, 라인모드의 세 가지 모드로 구분된다.
- locate: 파일의 부분 문자열을 가지고 검색
- find: 파일이 가진 속성으로 파일을 찾거나 검색된 파일에 대해 특별한 액션을 취할경우 사용

<br>
<hr>

# ***8장. 파일 시스템 관리***

- 저장장치 관리
  - 저장장치 내 파티션 생성  
    → 파티션 내 파일 시스템 생성  
    → 생성된 파일 시스템을 특정 디렉토리에 마운트하여 운영체제가 해당 파일 시스템의 데이터를 접근할 수 있도록 한다.  
  
- ***마운트***
  - 파일 시스템을 특정 디렉토리에 연결하여 **운영체제가 해당 파일 시스템의 내용을 접근할 수 있도록 하는 과정**
  
- 가상 파일 시스템
  - swap
    - 스왑 파일 시스템: 스왑 영역을 관리
  - tmpfs
    - 휘발성 메모리인 RAM에서 일시적으로 파일을 저장하기 위해 사용하는 파일 시스템
  - proc
    - 커널이 가진 프로세스 정보, 시스템 정보를 사용자 공간에 알려줄 때 사용
  - sysfs
    - 커널이 가진 하드웨어, 드라이버 정보를 사용자 공간에 알려줄 때 사용
  - devpts
    - 가상 터미널을 제어하기 위해 사용
  
- `/etc/mtab`: mount, unmount 명령 실행시 해당 내용이 파일에 기록됨
- `/etc/fstab`: 리눅스 부팅 과정에서 마운트 작업을 위해 해당 파일 참조
  
- 파티션
  - 하나의 물리적 디스크를 논리적으로 나눈 구역
  
- 리눅스에서 사용되는 파티션 관리 도구
  - parted
  - gparted
  - fdisk
  - gdisk
  
- 파티션  
  - 부트 블록
  - 슈퍼 블록
  - inode 테이블
  - 데이터 블록
  
- 파일 시스템 유형
  - ext4
  - ISO9660: CD-ROM과 같은 광학 디스크에서 표준으로 사용
  - FAT 계열: 과거 DOS 나 Windows 에서 사용
  - HFS+: 매킨토시 시스템에 사용
  - Btrfs: 개발 중인 리눅스 차세대 파일 시스템
  
- 저널링
  - 변경을 기록하는 로그를 두어 시스템의 비정상 종료 시 파일 시스템 복구를 쉽게 하는 방법

<br>

***파일 시스템***  

```bash
# 파일 시스템 만들기
mkfs [-t fs-type] device

# 파일 시스템 검사
fsck /dev/sdc1

# 스왑
mkswap [device]
swapon [device]

# 디스크 남은 공간 보기
df

# 디스크 사용 공간 보기
du
```

<br>

⭐​ **정리**  
- 마운트: 파일 시스템을 특정 디렉토리(마운트 지점)에 붙여 운영체제가 사용할수 있게 하는 것
- /etc/fstab: 부팅 시 자동으로 마운트되는 파일 시스템이 기록되어 있음
- 논리 볼륨은 파티션과 일치하나 크기 조정 가능
- inode는 파일 이름을 제외한 파일의 모든 정보를 가지고 있다.

<br>
<hr>

# ***9장. 프로세스 관리***

- 프로세스 생성
  - fork()
    - 부모 프로세스가 자신의 복사본 형태로 자식 프로세스 생성
    - systemd 프로세스를 제외한 모든 사용자 프로세스는 fork() 시스템 호출의 결과
  - exec()
    - 기존 프로세스를 새로운 프로세스로 대체
  
- 시스템 호출
  - 커널에 서비스를 요청
  
- 포어 그라운드
  - 보통 셸에서 명령을 실행 시 수행되고 있는 모드
- 백그라운드 프로세스 
  - 보이지 않는 곳에 숨어 동작하는 프로그램
  - 명령어 뒤에 &를 붙여 수행
  
- /etc/passwd 파일을 수정할 수 있는 세가지 권한
  - SetUID: s
  - SetGID: s
  - StickyBit: t
  
```Bash
ls -l $(which passwd)
    -rws-r-xr-x. 1 root root ...
ls -ld /tmp
    drwxrwxrwt 18 root root ...
```
<br>

***프로세스의 상태***  

```bash
# ps 명령어는 -ef aux 옵션이 자주 사용된다. 
# e: 프로세스 정보에 환경변수 정보를 포함시켜 출력
# f: 포레스트 트리를 출력
# a: 터미널과 연결된 모든 프로세스 출력
# u: 사용자 친화적으로 자세히 출력
# x: 현재 사용자가 소유한 모든 프로세스 출력. 터미널과 연결되어 있지 않은 프로세스도 출력
ps -ef --forest
ps aux
```
  
- ps 명령에서 STAT 항목이 가지는 값의 의미
  - R: 실행중 / 실행가능한 상태
  - S: 인터럽트될 수 있는 수면상태. 종료를 기다린다.
  - D: 인터럽트 불가능한 수면상태. 입출력 중인 상태
  - T: 시그널에 의해 멈춰진 상태
  - X: 죽은 상태
  - Z: 좀비 프로세스. 작업이 종료되었으나 부모 프로세스로 회수되지 않아 프로세스 테이블 목록에 남아있음
  - <: 높은 우선순위
  - N: 낮은 우선순위
  - L: 메모리 암에서 페이지가 잠긴 상태
  - s: 세션 리더
  - l: 멀티스레드 상태
  - +: 포어그라운드 프로세스
  
***프로세스의 관리***  

- top
  - 프로세스 상태를 실시간으로 모니터
  
- 관리자 관점에서 가장 자주 사용하는 시그널 KILL(9), TERM(15)
- TERM: 프로세스에 정리작업 후 스스로 종료할 갓을 요청
  
- 시그널
  - 식별 번호
  - 이름
  
- 리눅스에서 사용되는 시그널
  - HUP: Hang-up: 부모 프로세스나 터미널이 종료될 때 연결된 프로세스에 보내지는 시그널
  - INT: Interrupt: 프로그램을 종료시킨다.
  - KILL: 프로세스 강제 종료
  - TERM: Termenate: kill 명령의 기본 시그널
  - CONT: Continue: STOP 시그널로 종료된 프로세스를 재개
  - STOP: 프로세스 중단
  - TSTP: Terminal Stop: STOP 과 달리 무시될 수 있음
  
- 우선순위의 조정: nice, renice
  - nice
    - 가장 높은 우선순위: -20
    - 가장 낮은 우선순위: +19
    - 기본값: 0
    - 일반 사용자는 프로세스 NI 값을 0 이상으로만 지정 가능
  - renice 
    - 실행 중인 프로세스의 NI 값을 바꾸는 명령어
  - 
    ```bash
      nice -5 top     # NI 값 5 증가
      nice --5 top    # NI 값 5 감소

      # 소유자가 ojg 이거나 pid가 6410인 프로세스의 NI 값을 10으로 지정
      renice 10 -u ojg -p 6410
    ```

### HUP, NOHUP

- HUP
  - 터미널로 작업도중 exit 명령으로 터미널 창을 종료하면 백그라운드 프로세스에도 HUP 시그널이 보내진다. 이는 백그라운드 프로세스도 같이 종료되어야 한다는 의미이다.
- NOHUP 
  - HUP 시그널의 수신과 관계없이 해당 작업이 완료되게 한다.
  
```bash
nohup find -size +100k > log.txt &
```
> 터미널이 종료되더라도 계속 작업을 수행한다.  
> 크기가 100k 보다 큰 파일을 찾아 log.txt 파일에 기록한다.  
> 만약 표준출력이 종료된 터미널일 경우 표준출력과 표준에러는 nohup.out 파일에 기록된다.  

### cron

- cron 서비스
  - 지정된 시간에 맞추어 주기적으로 수행되는 계획된 작업을 수행할 때 cron 서비스를 사용한다. 
  - /var/spool/cron/crontabs
- crond
  - 시스템 부팅 후 계속 수행되는 데몬 프로그램
  - 1분 간격으로 시스템 또는 일반 사용자의 contab 파일의 내용을 검사하여 정해진 시간에 작업을 수행한다.
  
```bash
# 매시 1분마다 cron.hourly 디렉토리에 있는 실행파일이나 스크립트 파일이 실행된다.
01 * * * * root run-parts/etc/cron.hourly

# 월~금 매 6시간마다 메일을 보낸다.
0 */6 * * 1-5 /bin/mail -s "Hello" ojg@localhost

# crontab 적용
crontab -e
    * * * * * date >> ~/date.txt
crontab -l # 현재 사용자에 대한 모든 크론탭 작업을 나열
cat date.txt
    Tue Nov 28 09:16:01 PM KST 2024
    Tue Nov 28 09:17:01 PM KST 2024
    Tue Nov 28 09:18:01 PM KST 2024

# 특정 사용자에 대한 모든 크론탭 출력
crontab -u [사용자이름] -l 

# 특정 시간에 일회성 작업을 예약할 경우: at
at 00:10 08.04.23
    at> date >> list.txt
    at> <EOT>
    ctrl + d
    job 1 at sat Apr 8 00:10:00 2023
```
  
- anacron
  - 리눅스 서버가 오랫동안 중단되었다 시작될 경우 cron 작업들이 과부하 걸릴 수 있다. 그래서 365일 가동될 필요없는 서버의 경우 anacron을 사용한다.
  - 설정파일: /etc/anacrontab
  - 지난 며칠 동안 실행된 적 없는 경우 몇 분의 여유를 두고 작업을 실행

<br>

⭐​ **정리**  
- 프로세스는 커널에 등록된 실행중인 프로그램이다.
- 백그라운드 프로세스는 터미널로 출력은 가능하나 키보드 입력을 받을 수 없다.
- SetUID가 설정된 프로그램을 실행시키면 프로세스는 파일 소유자의 권한으로 실행된다. 
- kill 명령은 지정한 프로세스에 다양한 시그널을 보내는 기능을 수행한다. 

<br>
<hr>

# ***10장. 소프트웨어 관리***

- 리눅스 배포판 사이에서는 소프트웨어 패키징 방법이 다르기 때문에 소프트웨어 패키지가 호환되지 않는다. 
- 패키징 방법
  - 데비안 계열
    - DEB
  - 레드햇 계열
    - 저수준 관리도구
      - RPM
    - 고수준 관리도구 
      - YUM, DNF(YUM 업그레이드 버전)

### ***압축***

- 시스템 파일을 적절히 백업해두기 위해 공간 절약을 위해 파일을 압축하여 보관한다. 
  
- gzip
  - 압축 파일의 형식이자 압축과 해제에 사용되는 리눅스 프로그램
  - Lempel-Ziv
  - gzip [options] [files]
  - gzip file 명령을 사용하여 압축하면 원본 파일은 없어지고 원본 파일과 이름이 같은 .gz이라는 확장자를 가진 압축파일이 생성된다. 
  - -number 옵션: 1~9(기본값 6)
    - 1: 압축속도 가장 빠름. 압축률은 낮음.
  - 
    ```bash
      # 압축한다. 
      gzip test.txt

      # 압축된 파일의 무결성 검사 후 결과를 출력한다. 
      # t: 무결성 검사
      # v: 파일 이름과 압축 률을 출력
      gzip -tv test.txt.gz

      # -d: 압축 해제(== gunzip test.txt.gz)
      gzip -d test.txt.gz
    ```
  
- bzip2
  - Burrows-Wheeler 블록 정렬 알고리즘 사용
  - gzip 보다 압축 속도는 느리지만 효율이 좋다. 
  
- tar(tape archive)
  - 원래는 테이프 관련 장치를 이용하여 파일을 백업할 때 사용하는 명령어
  - 현재는 주어진 여러 개의 파일을 하나의 아카이브 파일로 묶거나 아카이브 파일을 원래 파일로 풀어주는 명령어
  - 묶어줄 대상으로 파일 대신 디렉토리를 지정하면 서브 디렉토리까지 함께 묶어준다. 
  - .tar: 압축되지 않은 형식

***tar 명령 사용 예시***  

```bash
# c: 아카이브 생성
# x: 아카이브에서 파일 추출
# v: 화면에 출력
# f: 아카이브 파일을 지정
# 

# 현재 디렉토리에서 .txt로 끝나는 모든 파일을 foo.tar로 묶어 만들어 진행 결과를 출력
tar cvf foo.tar *.txt

# 아카이브 foo.tar에 있는 파일 목록 출력
tar tvf foo.tar

# 현재 디렉토리에 foo.tar 아카이브를 푼다.
tar xvf foo.tar

# 디렉토리 backup 의 내용을 묶어 아카이브 bar.tar를 만든다.
tar cvf bar.tar backup/
# 위와 같으나 아카이브 생성 시 gzip을 이용하여 압축한다. 
tar cvfz baz.tar.gz backup/

# gzip으로 압축된 아카이브를 푼다. 
tar xvfz baz.tar.gz

# 명령 확장을 통해 find 명령을 사용하여 현재 디렉토리의 모든 파일과 서브 디렉토리 각각을 묶어 아카이브를 만드는데, 리다이렉션을 사용하여 backup.tar 아카이브를 생성한다. 
tar cvf -`find . -print` > backup.tar
```

<br>

⭐​ **정리**  
- 소프트웨어를 설치하고 관리하려면 패키지 관리 도구가 필요하다.
- RPM 패키지 파일은 패키지 관리의 기본 단위로 패키지를 구성하는 파일들을 묶은 압축 파일이다.
- 패키지를 설치할 때 선행 패키지가 설치되어 있지 않으면 의존성 문제로 인해 설치가 어렵다.
- DNF는 의존성 문제를 해결한 YUM의 차세대 버전으로 고수준 패키지 관리도구이다.
- DNF의 설정 파일은 패키지 저장소에 관한 정보를 가지고 있다. 

<br>
<hr>

# ***11장. 셸 스크립트***

- 하나의 명령어처럼 실행될 수 있는 실행 가능한 프로그램
  
- 셸 스크립트 실행 방법
  1. bash [file]
  2. 스크립트 파일의 이름을 명령어로 사용
  3. source [file] / . [file]

<br>

***변수 사용***   

```bash
cat > myScript.sh
    echo Hello Linux
    echo $0 $1 $2
    ls -l $0
cat myScript.sh
chmod u+x myScript.sh
./myScript.sh Seoul Pusan
    Hello Linux
    ./myScript.sh Seoul Pusan
    -rwxrw-r-- 1 ojg ojg 40 Nov 29 09:32 ./myScript.sh


cat my_page.sh 
    var1="This is a"
    echo 
    "<HTML>
      <HEAD>
        <title>Page Title</title>
      </HEAD>
      <BODY>
        <h1>$var1 Heading.</h1>
        <p>$var1 paragraph</p>
      </BODY>
    </HTML>"
bash my_page.sh > my_page.html
firefox my_page.html&


cat > arg.sh
    echo "This script name is : $0"
    echo Argument 1: $1
    echo Argument 2: $2
cat arg.sh 
    echo "This script's name is : $0"
    echo Argument 1: $1
    echo Argument 2: $2
ls -l arg.sh 
    -rw-rw-r-- 1 ojg ojg 74 Nov 29 09:56 arg.sh
chmod u+x arg.sh 
ls -l arg.sh 
  -rwxrw-r-- 1 ojg ojg 74 Nov 29 09:56 arg.sh
./arg.sh first second
    This script name is : ./arg.sh
    Argument 1: first
    Argument 2: second

```

<br>

***함수***   

```bash
cat > whoson.sh
    whoson () {
      date
      user=$USER
      echo "$user currently logged on"
    }
    echo "Step 1"
    whoson
    echo "Step 3"
. whoson.sh
    Step 1
    Fri Nov 29 10:04:45 AM KST 2024
    ojg currently logged on
    Step 3
whoson
    Fri Nov 29 10:11:49 AM KST 2024
    ojg currently logged on
echo $user
    ojg
```

<br>

***조건문***   

```bash
cat isOrdFile.sh 
    if [ $# != 1 ]; then
      echo "You must supply one argument."
      exit 1
    fi 
    if [ ! -e "$1" ]; then
      echo "$1 does not exist."
    elif [ -f "$1" ]; then
      echo "$1 is an ordinary file."
    elif [ -d "$1" ]; then
      echo "$1 is a directory."
    else 
      echo "$1 is a special file."
    fi
./isOrdFile.sh 
    You must supply one argument.
./isOrdFile.sh /etc/passwd
    /etc/passwd is an ordinary file.


cat strCompare.sh 
    echo -n "word 1: "
    read word1
    echo -n "word 2: "
    read word2
    if test $word1 = $word2; then
      echo "same word"
    else
      echo "not same word"
    fi
./strCompare.sh 
    word 1: abc
    word 2: Abc
    not same word
./strCompare.sh 
    word 1: test
    word 2: test
    same word


cat intCompare.sh 
    if [ $# != 2 ]; then
      echo "You must supply two numbers as arguments."
      exit 1
    fi
    if [ $1 -eq $2 ]; then
      echo "$1 equals to $2."
    elif [ $1 -gt $2 ]; then
      echo "$1 is greater than $2."
    else
      echo "$1 is less then $2."
    fi
    echo "$1 + $2 is $[$1+$2]"
chmod u+x intCompare.sh 
./intCompare.sh 36 68
    36 is less then 68.
    36 + 68 is 104


cat caseTest.sh 
    clear
    echo "Please select:
    a. Display System Information
    b. Show Information about File Systems
    c. Summarize Disk Usage Information
    q. Quit
    "
    read -p "Enter selection [a, b, c, or q] >"
    case $REPLY in 
      a|A) 
        echo "Hostname: $HOSTNAME"
        uptime
        ;;
      b|B) 
        df -h
        ;;
      c|C) 
        if [ $(id -u) -eq 0 ]; then
          echo "All users' home disk Space utilization"
          du -sh /home/*
        else 
          echo "($USER)' home disk Space utilization"
                du -sh $HOME
        fi
        ;;
      q|Q) 
        echo "Program terminated."
        exit
        ;;
      *)	
        echo "Invalid entry" >&2
        exit 1
        ;;
    esac
chmod u+x catTest.sh
./catTest.sh
    Please select:
    a. Display System Information
    b. Show Information about File Systems
    c. Summarize Disk Usage Information
    q. Quit

Enter selection [a, b, c, or q] >c
    (ojg)' home disk Space utilization
    70M	/home/ojg
```

<br>

***반복문***   

```bash
for i in Kim Lee Park; do echo $i; done
    Kim
    Lee
    Park
echo {a..d}
    a b c d
for i in {a..d}; do echo $i; done
    a
    b
    c
    d


# for
cat > testFor.sh
    for FILE
    do 
      echo $FILE
    done
chomod u+x testFor.sh
./testfor.sh `ls`
    arg.sh
    caseTest.sh
    date.txt
    Desktop
    Documents
    Downloads


cat > testFor2.sh 
    LIMIT=10
    for ((a=0; a<LIMIT; a++)); do
      echo "$a"
    done
. testFor2.sh 
    0
    1
    ...
    8
    9


# while
cat > testWhile.sh
    N=1
    S=0
    while [ $N -le 10 ]; do
      echo -n "$N "
      S=$[$S+$N]
      N=$[$N+1] 
    done
    echo 
    echo $S 
. testWhile.sh 
    1 2 3 4 5 6 7 8 9 10 
    55

cat > testWhile2.sh
    LIMIT=10 
    ((a=0))
    while ((a<LIMIT)); do
      echo "$a"
      (( a++ ))
    done
. testWhile2.sh 
    0
    1
    ...
    8
    9


# until
cat testUntil.sh 
    N=1
    S=0
    until [ $N -gt 10 ]; do
      echo -n "$N "
      let S=$S+$N
      let N=$N+1
    done
    echo
    echo $S
. testUntil.sh 
    1 2 3 4 5 6 7 8 9 10 
    55

```

<br>

⭐​ **정리**  
- 키보드로부터 이력을 받을 때, read 명령을 사용한다.
- 선택 제어 구조: if, case
- 반복 제어 구조: for, while, until