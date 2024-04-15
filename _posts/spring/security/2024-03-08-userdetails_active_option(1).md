---
title: Spring Security, UserDetails active option
description: 사용자 계정 활성화, 비활성화
date: 2024-03-08T13:00:000
categories: [ Spring, Security ]
tags: [ back-end, spring, security, user details ]
---

<br>

<h2> 사용자 정보 이메일 인증 기능 구현 전 UserDetails 살펴보기 </h2>

- ```UserDetails``` : 시큐리티에서 사용자에 대한 디테일 정보를 처리하기 위한 인터페이스
  - ```String getPassword()```, ```String getUsername()``` : 사용자의 자격 증명을 반환하는 메서드
  - ```Collection<? extends GrantedAuthority> getAuthorities()``` : 사용자의 권한을 컬렉션으로 반환받는 메서드
  - 사용자의 계정을 필요에 따라 활성화 또는 비활성화 하는 메서드
    - ```boolean isAccountNonExpired()```
    - ```boolean isAccountNonLocked()```
    - ```boolean isCredentialsNonExpired()```
    - ```boolean isEnabled()```

```java
public interface UserDetails extends Serializable {

  String getUsername();

  String getPassword();

  Collection<? extends GrantedAuthority> getAuthorities();

  boolean isAccountNonExpired();

  boolean isAccountNonLocked();

  boolean isCredentialsNonExpired();

  boolean isEnabled();

}
```

<br>

<h2> 인증 단계 구성 </h2>

- ```Email```인증 여부에 따라 사용자의 계정이 활성화. 비활성화 로직 흐름
  - 인증 단계(회원가입 시)
    - 1 ] 해당 이메일이 사용중인지 검증한다. 사용중일 경우 로직 종료 사용중이 아닐경우 단계를 계속 진행.
    - 2 ] 회원 정보를 ```User```테이블에 ```insert```한다 이때 이메일 인증이 완료되기 전에는 활성화 옵션을 풀지 않는다.
    - 3 ] 이메일 인증이 완료되면 ```User```테이블에서 해당 ```Email```에 해당하는 계정을 활성화 시킨다.
    - 4 ] 일정 시간이 지나면 인증되지 않는 회원 데이터를 삭제한다.

- 위의 절차를 구현하기 위해 ```Security```는 ```UserDetails``` 에서 어떻게 메서드를 지원하고 있는지 알아본다.

<br>

<h2> boolean isAccountNonExpired() </h2>

- 사용자의 계정이 완료되었는지 여부를 나타냄, 만료된 사용자 계쩡은 인증할 수 없다.
  - 사용자의 계정이 유효한지(만료되지 않았는지)여부에 따라 true, 유효하지 않는경우 false 반환

<br>

<h2> boolean isAccountNonLocked() </h2>

- 사용자의 계정이 잠겨있는지 여부를 나타냄
  - 사용자의 계정이 잠겨있지않으면 true 잠겨있으면 false

<br>

<h2> boolean isCredentialsNonExpired() </h2>

- 사용자의 비밀번호가 만료되었는지 여부
  - 사용자의 비밀번호가 만료되지 않았으면 true, 만료되었으면 false 반환

<br>

<h2> boolean isEnabled() </h2>

- 사용자의 활성화 여부
  - 활성화되었으면 true, 비활성화 되었으면 false 반환.


- 각 메서드의 목적에 맞게 로직을 구성하면 될거같다. Email 인증은 inEnabled()과 더 가까운거 같아 해당 기능을 사용하여 구현해볼 예정


