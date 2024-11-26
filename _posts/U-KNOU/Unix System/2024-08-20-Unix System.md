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
# 그룹 생성
groupadd sales
```
