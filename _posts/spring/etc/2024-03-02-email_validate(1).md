---
title: Spring, 이메일 인증 회원가입(1).
description: 프로젝트 설정 및 기초 앤티티 설계
date: 2024-03-02T14:30:000
categories: [ Spring, Jpa ]
tags: [ back-end, spring, jpa, entity mapping ]
---

- 회원 가입시 이메일을 인증받아 회원가입시키는 흐름 구성
  - 프로젝트 셋팅
  - ```user```, ```role```, ```role_authority```, ```role``` 테이블 구성
  - 기초 데이터 셋팅을 위한 유틸 서비스 구성
  - Email 서비스 연동
  - ```security``` 인증 단계에서 이메일 인증이 진행 중인 상태에 따라 회원가입 플로우 진행

<br>


<h2>프로젝트 셋팅 및 테이블과 Entity 구성</h2>


- 프로젝트 환경
  - ```java17```, ```spring boot 3.2.3```


- ```build.gradle``` : 주요 설정
  - ```DAO``` : ```spring-boot-starter-data-jpa``` DB 접근 기술
  - ```Email``` : ```spring-boot-starter-mail``` 이메일 서비스
  - ```Security``` : ```spring-boot-starter-security``` 보안 설정
  - ```tamplate-engine``` : ```spring-boot-starter-thymeleaf``` 템플릿 설정
  - ```gateway``` : ```spring-cloud-starter-openfeign``` 외부 서버와 통신을 위한 설정
  - ```database``` : ```com.mysql:mysql-connector-j```  ```mysql``` 사용


```text
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.3'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'org.spring.oauth2'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '17'
}

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

ext {
    set('springCloudVersion', "2023.0.0")
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-mail'

    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity6'
    implementation 'org.springframework.cloud:spring-cloud-starter-openfeign'

    compileOnly 'org.projectlombok:lombok'
    runtimeOnly 'com.mysql:mysql-connector-j'
    annotationProcessor 'org.projectlombok:lombok'
    testAnnotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
    }
}

tasks.named('test') {
    useJUnitPlatform()
}
```

<br>

- 유저, 역할, 역활_권한, 권한 테이블 설계

![entity](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/bcd8e418-397e-4ff7-9150-5400310d8b38)


<br>

<h2> MappedSuperclass, BaseEntity </h2>

- 공통 테이블 컬럼 정의
  - ```@MappedSuperclass``` : 부모 클래스 정의
  - ```@EntityListeners(AuditingEntityListener.class)``` :
    - ```@CreatedDate```, ```@LastModifiedDate``` : 다음과 같은 어노테이션이 동작할수 있도록 하는 어노테이션

```java

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

  @Column(name = "created_by")
  private String createdBy;

  @CreatedDate
  @Column(name = "created_date")
  private LocalDateTime createdDate;

  @Column(name = "last_modified_by")
  private String lastModifiedBy;

  @LastModifiedDate
  @Column(name = "last_modified_date")
  private LocalDateTime lastModifiedDate;

  @Column(name = "used")
  private boolean used;

}
```

<br>

<h2>User</h2>

- ```UserDetails```를 구현하여 실제 검증할때 해당 ```Entity```를 사용할 수 있게 설정.
  - Security를 통한 인증, 인가 부분을 구현하면서 바뀌는 부분이 많아질 예정, 딱히 설명할부분은 없다.

```java

@Getter
@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity implements UserDetails {

  @Id
  @Column(name = "user_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "user_email", nullable = false, unique = true)
  private String userEmail;

  @ColumnDefault("1")
  @Column(name = "account_non_expired", nullable = false)
  private boolean accountNonExpired;

  @ColumnDefault("1")
  @Column(name = "account_non_locked", nullable = false)
  private boolean accountNonLocked;

  @ColumnDefault("1")
  @Column(name = "credentials_non_expired", nullable = false)
  private boolean credentialsNonExpired;

  @ColumnDefault("1")
  @Column(name = "enabled", nullable = false)
  private boolean enabled;

  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "role_id")
  private Roles roles;

  public User(String userEmail, String password) {
    this.userEmail = userEmail;
    this.password = password;
    this.accountNonExpired = true;
    this.accountNonLocked = true;
    this.credentialsNonExpired = true;
    this.enabled = true;
  }

  @Override
  public String toString() {
    return "User{" +
      "password='" + password + '\'' +
      ", userEmail='" + userEmail + '\'' +
      '}';
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return roles.getRoleAuthorities().stream()
      .map(a -> new SimpleGrantedAuthority(
        a.getAuthorityId().getAuthorityName()
      )).collect(Collectors.toList());
  }

  @Override
  public String getPassword() {
    return this.password;
  }

  @Override
  public String getUsername() {
    return this.userEmail;
  }

  @Override
  public boolean isAccountNonExpired() {
    return this.accountNonExpired;
  }

  @Override
  public boolean isAccountNonLocked() {
    return this.accountNonLocked;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return this.credentialsNonExpired;
  }

  @Override
  public boolean isEnabled() {
    return this.enabled;
  }

}
```

<br>

<h2>Roles</h2>

- 역할 테이블, 유저의 역할을 매핑하기 위함

```java

@Entity
@Getter
@Table(name = "roles")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Roles extends BaseEntity {

  @Id
  @Column(name = "role_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long roleId;

  @Column(name = "role_name", unique = true, nullable = false)
  private String roleName;

  @OneToMany(mappedBy = "roles", fetch = LAZY)
  private List<User> users = new ArrayList<>();

  @OneToMany(mappedBy = "roleId", fetch = LAZY)
  private List<RoleAuthority> roleAuthorities = new ArrayList<>();

}
```

<br>


<h2>RoleAuthority</h2>

- 역할과 권한을 중간에서 연결해주는 중간 테이블, 외래키를 복합키로 갖게되는 구조가 된다.
  - ```@EmbeddedId``` 복합키를 사용할 때 쓰이는 어노테이션
    - 자매품으로 ```@IdClass```가 있지만 여기서는 ```@EmbeddedId``` 사용

```java

@Entity
@Getter
@Table(name = "role_auth")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoleAuthority extends BaseEntity {

  @EmbeddedId
  private RoleAuthorityId id;

  @MapsId("roleId")
  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "role_id")
  private Roles roleId;

  @MapsId("authorityId")
  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "authority_id")
  private Authority authorityId;

}
```

- ```EmbeddedId```


```java

@Getter
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class RoleAuthorityId implements Serializable {

  private Long roleId;
  private Long authorityId;

}
```

<br>


<h2>Authority</h2>

- 권한들이 들어가게 되는 테이블 딱히 설명할게 없다.

```java

@Entity
@Getter
@Table(name = "authorities")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Authority extends BaseEntity {

  @Id
  @Column(name = "authority_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long authorityId;

  @Column(name = "authority_name", nullable = false, unique = true)
  private String authorityName;

  @Column(name = "end_point", nullable = false)
  private String endPoint;

  @OneToMany(mappedBy = "authorityId", fetch = LAZY)
  private List<RoleAuthority> roleAuthorities = new ArrayList<>();

}
```

<br>

- 다음에 할것
  - 기초 데이터 셋팅을 위한 유틸 서비스 구성
