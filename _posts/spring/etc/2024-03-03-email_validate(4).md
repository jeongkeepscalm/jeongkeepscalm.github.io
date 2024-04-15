---
title: Spring, 이메일 인증 회원가입(4).
description: 기초 데이터 설정 및 이메일 서비스 연동
date: 2024-03-03T19:00:000
categories: [ Spring ]
tags: [ back-end, spring, email sender ]
---

[이메일_인증_회원가입(3)](https://angrypig123.github.io/posts/email_validate(1)/){:target="\_blank"}

- 이번에 할것
  - 토큰 인증 화면 구성(사용자에게 보내지는 메일을 꾸며주는 템플릿)
  - 역할_권한 중간 테이블에 데이터 넣는 ```API```추가

<br>

<h2> JavaMailSender 수정 </h2>

- 템플릿에 포함된 내용을 ```UTF-8``` 형식으로 인코딩 하기 위한 설정 해당 설정을 안할시 한글이 깨져서 보인다
  - ```mailSender.setDefaultEncoding("UTF-8")```

```java

@Bean
public JavaMailSender javaMailSender() {
  JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
  mailSender.setDefaultEncoding("UTF-8");
  mailSender.setHost("smtp.gmail.com");
  mailSender.setPort(587);
  mailSender.setUsername(USER_NAME);
  mailSender.setPassword(PASSWORD);
  mailSender.getJavaMailProperties().put("mail.smtp.starttls.enable", "true");
  return mailSender;
}
```

<br>


<h2> thymeleaf template engine </h2>

- 파싱할 thymeleaf 파일을 생성후 직접 값을 바인딩하여 해당 ```html```을 내용으로하는 메일을 보내는 설정

- ```private final TemplateEngine templateEngine```
  - 템플릿 엔진을 사용할 수 있도록 해주는 의존성
- ```MimeMessage``` : 이메일에 텍스트, HTML, 첨부 파일 등 다양한 형식의 콘텐츠를 포함할 수 있도록 표준을 정의
  - ```new MimeMessageHelper(message, false)``` : 해당 생성자의 두번째 인자는 ```multipart```사용을 명시한다.
- ```Context context = new Context()``` : ```thymeleaf```에 바인딩할 값을 설정할 수 있게 해주는 클래스
  - ```${title}```과 같은 표현으로 타임리프에서 값을 바인딩 할 수 있게 해준다.
- ```templateEngine.process("/email/greeting", context)```
  - ```/email/greeting``` 경로의 템플릿에 ```context```를 넘겨서 반환할 ```html```에 바인딩한다.

```java

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailSenderServiceImpl implements EmailSenderService {

  private final JavaMailSender javaMailSender;
  private final TemplateEngine templateEngine;

  @Override
  public boolean sendEmailTest(EmailSendDto emailSendDto) {
    MimeMessage message = javaMailSender.createMimeMessage();

    try {
      MimeMessageHelper helper = new MimeMessageHelper(message, false);
      helper.setTo(emailSendDto.getToEmailAddress());
      helper.setSubject(emailSendDto.getEmailTitle());
      Context context = new Context();
      context.setVariable("title", emailSendDto.getEmailTitle());
      context.setVariable("email", emailSendDto.getToEmailAddress());
      String htmlContent = templateEngine.process("/email/greeting", context);
      helper.setText(htmlContent, true);
      javaMailSender.send(message);
      return true;
    } catch (MessagingException messagingException) {
      return false;
    }
  }

}
```

- html

```html
<!DOCTYPE html>
<html lang="ko" xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="UTF-8"/>
  <title>Email Template</title>
</head>
<body>
<div class="container">
  <h1 class="email-title">이메일 타이틀 표시: <span th:text="${title}">기본 타이틀</span></h1>
  <p>인증에 관련된 안내 ..... ToDO 토큰 부분을 확인하고 다시 체크한다.</p>
  <p>수신자 : <span class="email-address" th:text="${email}">example@google.com</span></p>
  <hr>
</div>
</body>
</html>

```

<br>

- 테스트 컨트롤러

```java

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/email")
public class EmailController {

  private final EmailSenderService emailSenderService;

  @PostMapping(path = "/test")
  public ResponseEntity<Boolean> emailSendTest(
    @RequestBody EmailSendDto emailSendDto
  ) {
    boolean b = emailSenderService.sendEmailTest(emailSendDto);
    return new ResponseEntity<>(b, HttpStatus.OK);
  }
}

```

![email](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/397b08c1-2cdd-4b6c-a657-06a79edeb342)


<br>

<h2> Role Authority 중간 테이블에 값 넣기 </h2>

- 요청시 ```role_id```와 ```authority_id```를 Dto 형태의 리스트로 받아 ```insert```하는 컨트롤러 생성


- controller

```java

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/role-authority")
public class RoleAuthorityController {

  private final RoleAuthorityService roleAuthorityService;

  @PostMapping(path = "/establish")
  public ResponseEntity<List<RoleAuthorityDto>> givePermissionToAUser(
    @RequestBody List<RoleAuthorityDto> roleAuthorityDtoList
  ) {
    List<RoleAuthorityDto> roleAuthorityDtos = roleAuthorityService.insertRoleAuthority(roleAuthorityDtoList);
    log.info("roleAuthorityDtos = {}", roleAuthorityDtos);
    return new ResponseEntity<>(roleAuthorityDtos, HttpStatus.OK);
  }

}
```

- service
  - 전달받은 ```Dto```의 값을 검증하고 ```entity```로 반환 후 실제 존재하는 값들에 대해 ```insert``` 진행
  - ToDO 원래 이렇게 코드가 길어지는지 알아보자

```java
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class RoleAuthorityServiceImpl implements RoleAuthorityService {

    private final RolesRepository rolesRepository;
    private final AuthorityRepository authorityRepository;
    private final RoleAuthorityRepository roleAuthorityRepository;

    @Override
    public List<RoleAuthorityDto> insertRoleAuthority(List<RoleAuthorityDto> roleAuthorityDtoList) {
        List<RoleAuthorityId> roleAuthorityIds = roleAuthorityDtoList.stream().map(RoleAuthorityDto::toRoleAuthorityId).toList();
        List<RoleAuthority> roleAuthorities = roleAuthorityIds.stream()
                .map(item -> {
                    Optional<Authority> findAuthority = authorityRepository.findById(item.getAuthorityId());
                    Optional<Roles> findRoles = rolesRepository.findById(item.getRoleId());
                    if (findAuthority.isPresent() && findRoles.isPresent()) {
                        Authority authority = findAuthority.get();
                        Roles roles = findRoles.get();
                        RoleAuthorityId id = new RoleAuthorityId(roles.getRoleId(), authority.getAuthorityId());
                        return new RoleAuthority(id, roles, authority);
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .toList();
        List<RoleAuthority> resultList = roleAuthorityRepository.saveAll(roleAuthorities);
        return resultList.stream().map(RoleAuthority::toDto).toList();
    }

}
```

<br>

<h2> 전체 데이터 생성 후 역할 권한이 연결된 데이터 확인 </h2>


```text
SELECT
	*
from users u
inner join roles r ON r.role_id = u.role_id
inner join role_auth ra ON ra.role_id = r.role_id
inner join authorities a ON a.authority_id  = ra.authority_id
where user_id = 41;
```

![data_check](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/b0783b7a-416a-4e1a-9d34-8c03edd6cedf)


<br>

<h2> api 목록 확인 </h2>

![swagger](https://github.com/AngryPig123/AngryPig123.github.io/assets/86225268/35aeef6e-9ecf-4fb9-a7bb-561a6dd99425)


- 다음에 할 것
  - 이메일 검증시 사용할 토큰 설계
  - 이메일 검증 방식 세우기
  - 이메일 검증 ```API``` 만들기
  - 이메일 검증 플로우 문서화 시키기
