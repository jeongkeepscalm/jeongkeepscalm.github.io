---
title: "Social Login Flow"
description: Social Login Flow
date: 2024-08-14
categories: [ Spring, Social Login ]
tags: [ Spring, Social Login ]
---

## Social Login Flow

1. 구글, 네이버, 카카오 계정 인증시 클라이언트로 302 Redirect URI 인가 코드 전달 
2. 클라이언트에서 토큰 요청 후(POST /oauth/token) 토큰 발급 
  - 설정파일 내 provider 코드가 해당 역할을 한다. 
  - GOOGLE 의 경우 provider 생략 가능(기본 제공 사용)
3. 사용자 로그인 처리
  - `GOOGLE`: OidcService 상속받아 사용
  - `NAVER, KAKAO`: DefaultOAuth2UserService 상속받아 사용
  - loadUser() 메소드 오버라이딩해야하며 리턴값은 principal 에 저장된다. 

<br/>
<hr/>

## Security Code

```java
private void oAuth2LoginConfig() throws Exception {

        httpSecurity.oauth2Login(oauth2 -> oauth2
                .loginPage("_____________________")
                .authorizationEndpoint(endpoint -> endpoint
                        .baseUri("_____________________")
                )
                .redirectionEndpoint(endpoint -> endpoint
                        .baseUri("_____________________")
                )
                .userInfoEndpoint(endpoint -> endpoint
                        .userService(aService)
                )
                .successHandler(auth2SuccessHandler)
                .failureHandler((request, response, exception) -> {
                    // 실패 원인 로그 출력
                    exception.printStackTrace();
                    // 추가 로그 출력
                    log.info("OAuth2 로그인 실패: {}" , exception.getMessage());
                    // 요청 URL과 본문 출력
                    log.info("요청 URL: {}", request.getRequestURL());
                    log.info("요청 본문: {}", request.getQueryString());
                })
                .permitAll()
        );

    }
```
> aService: DefaultOAuth2UserService 상속 받은 클래스  
> bService: OidcService 상속 받은 클래스이지만, OIDC 요청이 들어오면 Spring Security는 자동으로 OidcUserService를 사용하여 사용자 정보를 로드하기에 코드에 명시할 필요가 없다.  

<br/>
<hr/>

## yaml file

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          kakao:
            client-id: ____________________ # rest api key
            redirect-uri: ____________________
            authorization-grant-type: authorization_code
            client-authentication-method: client_secret_post
            scope:
            # scope: profile, account_email
        provider:
          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize
            token-uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user-name-attribute: id

-----------------------------
spring:
  security:
    oauth2:
      client:
        registration:
          naver:
            client-id: ____________________ # rest api key
            client-secret: ____________________
            redirect-uri: "____________________"
            authorization-grant-type: authorization_code
            scope: profile, email
        provider:
          naver:
            authorization-uri: https://nid.naver.com/oauth2.0/authorize
            token-uri: https://nid.naver.com/oauth2.0/token
            user-info-uri: https://openapi.naver.com/v1/nid/me
            user-name-attribute: response

-----------------------------
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ____________________
            client-secret: ____________________
            redirect-uri: "____________________"
            scope: openid, profile, email
            # openid 생략했더니, DefaultOAuth2UserService 를 상속받은 클래스를 거쳤다. 

logging:
  level:
    org.springframework.security.oauth2.client: DEBUG
    org.springframework.web.client.RestTemplate: DEBUG
    # 소셜로그인 실패 원인을 찾기 위해 사용
```
> 구글은 기본 제공 provider 를 사용하여 생략  

<br/>
<hr/>

# failure of social login

- 로컬 환경에서는 소셜로그인이 문제없이 잘 동작하였는데, 운영에 배포하여 확인해보니 동작이 되질않았다. 
- 실패 원인을 파악하기 위한 노력
  - yaml 파일 내 시큐리티 관련 로그 추가
  - 시큐리티 failureHandler 코드 추가
  - 운영환경에 출력되는 로그 분석
  
- 결과
  - <img src="/assets/img/log/1.png" width="600px" />  
  - <img src="/assets/img/log/2.png" width="600px" /> 
  - 고객사 운영서버에 권한이 없다고 판단되어 관련 메일 송부했더니, 해결되었다.