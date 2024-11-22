---
title: "[U-KNOU] UNIX 시스템"
description: "[U-KNOU] UNIX 시스템"
date: 2024-08-20
categories: [ U-KNOU, UNIX System ]
tags: [ U-KNOU, UNIX System ]
---

# ***1강. 유닉스와 리눅스***

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

<hr>
<br>

# ***3강. 셸 사용하기***

- 셸(shell)
  - 명령어를 해석하고 관리하는 프로그램
  - 커널과 사용자 간의 가교 역할을 하는 명령어 해석기
  
- Bash Shell(Bourne Again Shell)
  - 리눅스 배포판에서 기본 셸로 사용된다.
  - $: 기본 프롬프트
  - #: 루트 사용자
  
