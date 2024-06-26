---
title: "HTTP Basic"
description: HTTP Basic
date: 2023-09-09
categories: [ HTTP, HTTP Basic ]
tags: [ HTTP, HTTP Basic, KYH ]
---

<h2> IP (Internet Protocol) </h2>

- 역할  
  - 지정한 IP 주소에 데이터 전달.  
  - 패킷 (packet) 이라는 통신단위로 데이터 전달.  
  
- IP Packet 정보 : 출발지 IP, 목적지 IP, 기타.., 전송데이터  
  
- IP 프로토콜의 한계  
  - 비연결성 : 패킷을 받을 대상이 없거나 서비스 불능 상태여도 패킷 전송  
  - 비신뢰성  
    1. 패킷이 중간에 소실되도 모른다.  
    2. 패킷의 전달 순서를 보장하지 않는다.   
  
- 프로토콜 계층  
  1. 프로그램이 데이터 생성.  
  2. SOCKET 라이브러리를 통해 전달.  
  3. TCP 정보 생성, 메시지 데이터 포함.   
  4. IP 패킷 생성, TCP 데이터 포함.  

<img src="/assets/img/TcpIp.jpg" width="600px" />

- PORT : 같은 IP 내에서 프로세스 구분  

<br>

<h2> TCP - 전송 제어 프로토콜(Transmission Control Protocol) </h2>

- 특징
  1. 연결지향 TCP 3 way handshake (가상연결)  
  2. 데이터 전달 보증  
  3. 순서 보장  
  4. 신뢰할 수 있는 프로토콜 (대부분 TCP 사용)  

<img src="/assets/img/TCP3.jpg" width="600px" />

<br>

## DNS (Domain Name System)

<img src="/assets/img/dns.jpg" width="600px"/>

<br>

<h2> URI (Uniform Resource Identifier) </h2>

- URI는 로케이터(locator), 이름(name) 또는 둘 다 추가로 분류될 수 있다.  
  - URL - Locator: 리소스가 있는 위치를 지정  
  - URN - Name: 리소스에 이름을 부여  

- URL 문법  
  - scheme://[userinfo@]host[:port][/path][?query][#fragment]  
    https://www.google.com:443/search?q=hello&hl=ko   
    프로토콜(https)  
    호스트명(www.google.com)  
    포트 번호(443)  
    패스(/search)  
    쿼리 파라미터(q=hello&hl=ko)  
  - 프로토콜: 어떤 방식으로 자원에 접근할 것인가 하는 약속 규칙   
    예) http, https, ftp 등등  
    http는 80 포트, https는 443 포트를 주로 사용, 포트는 생략 가능  
    https는 http에 보안 추가 (HTTP Secure)  
  
- 웹 브라우저 요청 흐름  
  - 요청 시  
    1. DNS 조회  
    2. HTTP 요청 메시지 생성  
    3. HTTP 메시지 전송  
      <img src="/assets/img/http2.jpg" width="600px" /> 
      <br>
      <img src="/assets/img/createPacket.jpg" width="600px" />
      <br>
      <img src="/assets/img/response.jpg" width="600px" />

<br>

<h2> HTTP </h2>

- HTTP 메시지에 모든 것을 전송한다.  
  html, text, image, 음성, 영상, 파일, json, xml ( 거의 모든 형태의 데이터 전송 가능 )  

- 특징  
  - 클라이언트 서버 구조 ( Request Response 구조 )  
  - Stateless, 비연결성 ( 서버가 클라이언트의 상태를 보존 x )  
    - 장점: 서버 확장성 높음(스케일 아웃)  
    - 단점: 클라이언트가 추가 데이터 전송  
  - http 메시지  
  - 단순함, 확장 가능  
  
- stateful / stateless  
  - stateful : 항상 같은 서버가 유지되어야 한다.  
    예) 로그인  
    일반적으로 브라우저 쿠키와 서버 세션등을 사용해서 상태 유지  
    상태 유지는 최소한만 사용  
  - stateless : 아무 서버나 호출해도 된다.( 서버가 장애가 나도 다른 서버에 요청하면 된다. )  
    예) 로그인이 필요 없는 단순한 서비스 소개 화면  
  
- 비 연결성(connectionless)  
  - HTTP는 기본이 연결을 유지하지 않는 모델  
  - 일반적으로 초 단위의 이하의 빠른 속도로 응답  
  - 서버 자원을 매우 효율적으로 사용할 수 있음  
  - TCP/IP 연결을 새로 맺어야 함 - 3 way handshake 시간 추가  
  
- Http Message 
<br>
<img src="/assets/img/http3.jpg" width="600px" />
<br>
- start line : http 버전, http 상태코드..
<br>
- HTTP Header  
  메시지 바디 내용  
  메시지 바디의 크기  
  압축  
  인증  
  요청 클라이언트 정보  
  서버 애플리케이션 정보  
  캐시 관리 정보  
  필요시 임의의 헤더 추가 가능 ( name : ojg )  
<br>
- message body  
  실제 전송할 데이터  
  html 문서, 이미지, 영상, json 등등 byte로 표현할 수 있는 모든 데이터 전송 가능.  
<br>

- HTTP 메서드 종류  
  - GET   
    리소스 조회  
    서버에 전달하고 싶은 데이터는 query(쿼리 파라미터, 쿼리 스트링)를 통해서 전달  
  
  - POST  
    요청 데이터 처리 ( 등록, 프로세스 처리 )  
    메시지 바디를 통해 서버로 요청 데이터 전달  
  
  - PUT  
    리소스( 필드 )가 있으면 대체, 없으면 생성.   
  
  - PATCH  
    리소스( 필드 )가 부분 변경.  
  
  - DELETE  
    리소스( 필드 ) 제거  

<br>
멱등, 캐시가능 정리 할 것
<br>

- **클라이언트 -> 서버 데이터 전송**
  1. 쿼리파라미터 ( GET )
  2. 메시지 바디를 통한 데이터 전송 ( POST, PUT, PATCH )

<br>

- HTML Form 데이터 전송
  - Content-Type: application/x-www-form-urlencoded 
  - form 내용을 메시지 바디를 통해서 전송 (key=value, 쿼리 파라미터 형식)
  - 전송 데이터를 url encoding 처리 ( abc김 ->  abc%EA%B9%80 )
  - HTML Form 전송은 GET, POST만 지원

<br>

- API 설계
  - POST 기반 등록
    - 회원 목록 /members -> GET
    - 회원 등록 /members -> POST
    - 회원 조회 /members/{id} -> GET
    - 회원 수정 /members/{id} -> PATCH, PUT, POST
    - 회원 삭제 /members/{id} -> DELETE
  
  - PUT 기반 등록
    - 파일 목록 /files -> GET
    - 파일 조회 /files/{filename} -> GET
    - 파일 등록 /files/{filename} -> PUT
    - 파일 삭제 /files/{filename} -> DELETE
    - 파일 대량 등록 /files -> POST

<br>

- HTML FORM 사용
  - 회원 목록 /members -> GET
  - 회원 등록 폼 /members/new -> GET
  - 회원 등록 /members/new, /members -> POST
  - 회원 조회 /members/{id} -> GET
  - 회원 수정 폼 /members/{id}/edit -> GET
  - 회원 수정 /members/{id}/edit, /members/{id} -> POST
  - 회원 삭제 /members/{id}/delete -> POST

<br>

<h2> HTTP STATUS CODE </h2>

- 1xx (Informational): 요청이 수신되어 처리중
- 2xx (Successful): 요청 정상 처리
- 3xx (Redirection): 요청을 완료하려면 추가 행동이 필요
- 4xx (Client Error): 클라이언트 오류, 잘못된 문법등으로 서버가 요청을 수행할 수 없음
- 5xx (Server Error): 서버 오류, 서버가 정상 요청을 처리하지 못함

<br>

- 리다이렉션 이해  
  - 웹 브라우저는 3xx 응답의 결과에 Location 헤더가 있으면, Location 위치로 자동 이동한다.  
  - 영구 리다이렉션 (301)  
    리다이렉트 시 요청 메서드가 GET으로 변함  
    리다이렉트 시 본문 메시지가 없음 (MAY)  
  - 영구 리다이렉션 (308)  
    리다이렉트 시 본문 메시지 유지. (처음 POST로 보내면 리다이렉트도 POST 유지)  
  
  - **일시적인 리다이렉션 (POST -> REDIRECT -> GET)**  
    **302 Found** : 리다이렉트시 요청 메서드가 GET으로 변하고, 본문이 제거될 수 있음(MAY). 많은 애플리케이션 라이브러리들이 302를 기본값으로 사용  
    307 Temporary Redirect : 302와 기능은 같고, 리다이렉트 시 요청 메서드와 본문 유지(요청 메서드를 변경하면 안된다. MUST NOT)   
    303 See Other : 302와 기능은 같고, 리다이렉트시 요청 메서드가 GET으로 변경  
    PRG를 하지 않을 경우의 예 : POST로 주문 후 웹 브라우저를 새로고침하면, 중복주문이 된다.  
  
  - 304 Not Modified   
    캐시를 목적으로 사용  
    클라이언트에게 리소스가 수정되지 않았음을 알려준다. 따라서 클라이언트는 로컬PC에 저장된 캐시를 재사용한다. (캐시로 리다이렉트 한다.)  
    304 응답은 로컬 캐시를 사용해야 하므로 응답에 메시지 바디를 포함하면 안된다.   
    조건부 GET, HEAD 요청시 사용  
  
  - 4xx - 클라이언트 오류 / 5xx - 서버 오류  
    400 Bad Request : 클라이언트가 잘못된 요청을 해서 서버가 요청을 처리할 수 없음.  
    401 Unauthorized   
      - 클라이언트가 해당 리소스에 대한 인증이 필요함  
      - 401 오류 발생시 응답에 WWW-Authenticate 헤더와 함께 인증 방법을 설명  
    403 Forbidden : 주로 인증 자격 증명은 있지만, 접근 권한이 불충분한 경우  
    404 Not Found : 요청 리소스를 찾을 수 없음  
    500 Internal Server Error : 서버 문제로 오류 발생, 애매하면 500 오류  
    503 Service Unavailable : 서버가 일시적인 과부하 또는 예정된 작업으로 잠시 요청을 처리할 수 없음  

<br>

<h2> HTTP 헤더 </h2>

- 엔티티 헤더는 엔티티 본문(메시지 바디)의 데이터를 해석할 수 있는 정보 제공 (데이터 유형(html, json), 데이터 길이, 압축 정보 등등)    
  - Content-Type: 표현 데이터의 형식 (text/html; charset=utf-8, application/json, image/png ...)  
  - Content-Encoding: 표현 데이터의 압축 방식 (gzip, deflate, identity... )   
  - Content-Language: 표현 데이터의 자연 언어 (ko, en, en-US...)  
  - Content-Length: 표현 데이터의 길이  
  
- 협상 (content negotiation ) : 클라이언트가 선호하는 표현 요청  
  - 협상 헤더는 요청시에만 사용 ( Accept-Language: ko 로 요청보내면, 한국어로 응답한다. 한국어가 지원되지 않을 경우, 우선순위 언어로 지원 )  
  - Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7 (1이 우선순위가 제일 높다)  
  - Referer : 이전 웹 페이지 주소이고, Referer를 사용해서 유입 경로 분석 가능하다  
  - Server : 요청을 처리하는 origin 서버의 소프트웨어 정보. 응답에서 사용.  
  - HOST : 요청한 호스트 정보(도메인)  
  - Retry-After : 유저 에이전트가 다음 요청을 하기까지 기다려야 하는 시간  
  - Authorization : 클라이언트 인증 정보를 서버에 전달  
  - WWW-Authenticate : 리소스 접근시 필요한 인증 방법 정의  
    - 리소스 접근시 필요한 인증 방법 정의  
    - 401 Unauthorized 응답과 함께 사용  
  
- 쿠키 (Cookie)  
  - http 는 stateless(무상태) 프로토콜이기에 사용자의 정보를 매 번 요청을 해야한다.   
  - Set-Cookie : 서버에서 클라이언트로 쿠키 전달(응답)한다  
  - Cookie : 클라이언트가 서버에서 받은 쿠키를 저장하고, HTTP 요청시 서버로 전달한다  
  - 쿠키 정보는 항상 서버에 전송된다  
    - 네트워크 트래픽 추가 유발  
    - 최소한의 정보만 사용 (세션 id, 인증 토큰)  
    - 서버에 전송하지 않고, 웹 브라우저 내부에 데이터를 저장하고 싶으면 웹 스토리지 (localStorage, sessionStorage) 참고  
  - 보안에 민감한 데이터는 저장하면 안된다  
  - 생명주기  
    - expires : 만료일이 되면 쿠키 삭제. 만료 날짜를 생략하면 브라우저 종료시 까지만 유지한다. (Set-Cookie: expires=Sat, 26-Dec-2020 04:39:21 GMT)  
    - max-age : 0이나 음수를 지정하면 쿠키삭제 (Set-Cookie: max-age=3600 (3600초))  
  - 도메인  
    예) domain=example.org  
    domain=example.org를 지정해서 쿠키 생성. example.org 는 물론이고, dev.example.org 도 쿠키 접근 가능하다.  
    - example.org 에서 쿠키를 생성하고 domain 지정을 생략하면, example.org 에서만 쿠키 접근가능. dev.example.org 는 쿠키 접근 불가능.  
  - path : 경로를 포함한 하위 경로 페이지만 쿠키 접근  
  - Secure, HttpOnly, SameSite  
    - Secure : 쿠키는 http, https를 구분하지 않고 전송한다. secure를 적용하면 https인 경우에만 전송.  
    - HttpOnly : XSS 공격 방지. 자바스크립트에서 접근 불가. http 전송에만 사용.  
    - SameSite : XSRF 공격 방지. 요청 도메인과 쿠키에 설정된 도메인이 같은 경우만 쿠키 전송  
  
- 캐시 (Cache)  
  - 캐시가 없을 경우  
    - 데이터가 변경되지 않아도 계속 네트워크를 통해 데이터를 다운로드 받아야 한다.  
    - 인터넷 네트워크는 매우 느리고 비싸다.  
    - 브라우저 로딩 속도가 느리다.  
  
  - 캐시 적용 시  
    - 캐시 덕분에 캐시 가능한 시간동안 네트워크를 사용하지 않는다. (브라우저 캐시에서 다운로드)  
    - 비싼 네트워크 사용량을 줄일 수 있다.   
    - 브라우저 로딩 속도가 빠르다.  
  - 적용  
    - Cache-Control: max-age 권장 ( expires: Mon, 01 Jan 1990 00:00:00 GMT x)  
    - Cache-Control: max-age와 함께 사용하면 Expires는 무시  
  
  - Last-Modified, If-Modified-Since  
    - 캐시 수명을 설정해 주며 (cache-control : max-age=60), 검증을 위해 Last-Modified 도 설정해준다. 캐시 수명이 다 했을 경우, 요청시 If-Modified-Since 정보를 보내어 두 날짜 정보가 같다면 즉, 데이터가 수정이 되지 않았다면 304 Not Modified + 헤더 메타 정보만 응답으로 보내 (바디 x) 기존 캐시 정보를 갱신한다. 클라이언트는 캐시에 저장되어 있는 데이터 재활용한다.  
    - 예 ) If-Modified-Since : 이후에 데이터가 수정되었으면?  
      - 데이터 미변경 예시  
        캐시: 2020년 11월 10일 10:00:00 vs 서버: 2020년 11월 10일 10:00:00  
        304 Not Modified, 헤더 데이터만 전송(BODY 미포함)  
        전송 용량 0.1M (헤더 0.1M)  
      - 데이터 변경 예시  
        캐시: 2020년 11월 10일 10:00:00 vs 서버: 2020년 11월 10일 11:00:00  
        200 OK, 모든 데이터 전송(BODY 포함)  
        전송 용량 1.1M (헤더 0.1M, 바디 1.0M)  
    - Last-Modified, If-Modified-Since 단점
      - 1초 미만(0.x초) 단위로 캐시 조정이 불가능
      - 날짜 기반의 로직 사용
  
    - ETag, If-None-Match  
      - ETag(Entity Tag)   
        - 캐시용 데이터에 임의의 고유한 버전 이름을 달아둠. (ETag: "v1.0", ETag: "a2jiodwjekjl3")  
        - 데이터가 변경되면 이 이름을 바꾸어서 변경함(Hash를 다시 생성) (ETag: "aaaaa" -> ETag: "bbbbb")  
        - **단순하게 ETag만 보내서 같으면 유지, 다르면 다시 받는다.**  

<br>
  ??? 프록시 캐시, 캐시무효화 정리 할 것 ???
<br>