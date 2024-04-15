---
title: 유저, 역할, 권한 ERD 설계
description: Spring data jpa, erd
date: 2024-02-19T16:15:000
categories: [ Spring, Jpa ]
tags: [ back-end, spring, jpa, user role auth, erd ]
---

- 테이블 설계

- ```user``` : 유저 테이블
- ```role``` : 역할 테이블, 관리자, 유저, 방문자 등으로 나눈다.
- ```role_auth``` : 역할에 맞는 권한을 매칭 시키는 다대다 관계를 풀어주는 중간 테이블
- ```auth``` : 권한 테이블, 권한 목록 저장

| user          | role        | role_auth        | auth        |
|---------------|-------------|------------------|-------------|
| user_id(pk)   | role_id(pk) | role_auth_id(pk) | auth_id(pk) |
| email(unique) | name        | auth_id(fk)      | name        |
| password      | description | role_id(fk)      | description |
| name          |             |                  | url         |
| birth         |             |                  |             |
| address       |             |                  |             |
| role_id(fk)   |             |                  |             |

![erd](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/8faa7798-bc02-406a-b2d9-0f86dff0f209)


<br>

<h2> User Entity </h2>

```java
@Entity
@Getter
@Table(name = "user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "birth", nullable = false)
    private LocalDate localDate;

    @Column(name = "address")
    private String address;

    @ManyToOne
    @JoinColumn(name = "role_id", updatable = false)
    private Role role;

    @Builder
    public User(String email, String password, String address, Role role) {
        this.email = email;
        this.password = password;
        this.localDate = LocalDate.now();
        this.address = address;
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", localDate=" + localDate +
                ", address='" + address + '\'' +
                ", roleName=" + role.getName() +
                '}';
    }

}
```

<br>

<h2> Role Entity </h2>

```java
@Entity
@Getter
@Table(name = "role")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Role {


    @Id
    @Column(name = "role_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @OneToMany(mappedBy = "role")
    private List<RoleAuth> roleAuths = new ArrayList<>();

    @OneToMany(mappedBy = "role")
    private List<User> users = new ArrayList<>();

    @Builder
    public Role(String name, String description) {
        this.name = name;
        this.description = description;
    }

}
```

<br>

<h2> RoleAuth Entity </h2>


```java
@Entity
@Getter
@Table(name = "role_auth")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoleAuth {

    @Id
    @Column(name = "role_auth_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long authRoleId;

    @ManyToOne
    @JoinColumn(name = "role_id", updatable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "auth_id", updatable = false)
    private Auth auth;

    @Builder
    public RoleAuth(Role role, Auth auth) {
        this.role = role;
        this.auth = auth;
    }

    @Override
    public String toString() {
        return "RoleAuth{" +
                "roleName=" + role.getName() +
                ", authName=" + auth.getName() +
                '}';
    }
}
```

<br>


<h2> Auth Entity </h2>

```java
@Entity
@Getter
@Table(name = "auth")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Auth {

    @Id
    @Column(name = "auth_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long authId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "url", nullable = false)
    private String url;

    @OneToMany(mappedBy = "auth")
    private List<RoleAuth> roleAuths = new ArrayList<>();

    @Builder
    public Auth(String name, String description, String url) {
        this.name = name;
        this.description = description;
        this.url = url;
    }

}

```


