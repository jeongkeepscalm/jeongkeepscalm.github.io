---
title: "[Issue] DNS with www"
description: "[Issue] DNS with www"
date: 2024-10-07
categories: [ Working, Issues ]
tags: [ Working, Issues ]
---

## Issue 

- "www" 포함이 안된 도메인은 `본인 인증` 및 `소셜 로그인` 작동 x
- **해결방안**: ENUM 혹은 redirectUri 에 하드코딩 된 도메인 정보를 Request 객체를 활용하여 분기처리
  
***본인 인증***

```java

@Value("${spring.profiles.active}")
private List<String> SPRING_PROFILES_ACTIVE;
private String CERTIFICATION_PASS_PATH = SwitchUrl.LICENSE_PATH.getName();

private void setSiteUrlAndRootDir(HttpServletRequest request) {

  // 운영 환경
  if (SPRING_PROFILES_ACTIVE.contains("prod")) {
    // 하드코딩 된 ENUM을 사용하지 않고 request를 활용하여 코드 적용
    // SITE_URL = SwitchUrl.PROD.getName();
    SITE_URL = getCurrentDomainUrl(request);
  } else {
    // 로컬 환경
    SITE_URL = SwitchUrl.LOCAL.getName();
    ROOT_DIR = CERTIFICATION_PASS_PATH;
    try {
      ROOT_DIR = new ClassPathResource(CERTIFICATION_PASS_PATH).getFile().getAbsolutePath();
    } catch (IOException ioException) {
      log.info("test");
    }
  }

}

private String getCurrentUrl(HttpServletRequest request) {
  String scheme = request.getScheme();
  String serverName = request.getServerName();
  int serverPort = request.getServerPort();

  String url = scheme+"://"+serverName;
  if((scheme.equals("http") && serverPort != 88)) url += ":" + serverPort;

  return url;
}
```

<br/>

***소셜 로그인***

```java
// set bean in config file
@Bean
public OAuth2AuthorizationRequestResolver customAuthorizationRequestResolver() {
  return new CustomAuthorizationRequestResolver(clientRegistrationRepository);
}

// CustomAuthorizationRequestResolver.java
@Slf4j
public class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

  private final OAuth2AuthorizationRequestResolver defaultResolver;

  public CustomAuthorizationRequestResolver(ClientRegistrationRepository clientRegistrationRepository) {
      this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(
          clientRegistrationRepository, "/api/auth/oauth2");
  }

  @Override
  public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
    OAuth2AuthorizationRequest authorizationRequest = defaultResolver.resolve(request);
    return customizeAuthorizationRequest(authorizationRequest, request);
  }

  @Override
  public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
    OAuth2AuthorizationRequest authorizationRequest = defaultResolver.resolve(request, clientRegistrationId);
    return customizeAuthorizationRequest(authorizationRequest, request);
  }

  private OAuth2AuthorizationRequest customizeAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request) {
    if (authorizationRequest == null) {
      return null;
    }

    String registrationId = extractRegistrationId(request);
    String redirectUri = determineRedirectUri(request, registrationId);

    return OAuth2AuthorizationRequest.from(authorizationRequest)
        .redirectUri(redirectUri)     // redirectUri 직접 설정
        .additionalParameters(authorizationRequest.getAdditionalParameters())
        .build();
  }

  private String extractRegistrationId(HttpServletRequest request) {
    String requestUri = request.getRequestURI();
    String[] uriParts = requestUri.split("/");
    return uriParts[uriParts.length - 1];
  }

  private String determineRedirectUri(HttpServletRequest request, String registrationId) {
    String host = request.getHeader("host");
    String baseUri = "https://" + (host != null && host.contains("www.") ? "www." : "") + "test.co.kr/api/auth/oauth2/callback/";

    switch (registrationId) {
      case "kakao":
        return baseUri + "kakao";
      case "google":
        return baseUri + "google";
      case "naver":
        return baseUri + "naver";
      default:
        throw new IllegalArgumentException("Unknown registrationId: " + registrationId);
    }
  }
}

// SecurityConfig.java
private void oAuth2LoginConfig() throws Exception {
  httpSecurity.oauth2Login(oauth2 -> oauth2
    .loginPage(MAIN_LOG_IN_PAGE)
    .authorizationEndpoint(endpoint -> endpoint
        .authorizationRequestResolver(customAuthorizationRequestResolver())
    )
    ...
    .permitAll()
  );
}
```
> determineRedirectUri 매서드를 통해 yaml 파일에 설정된 redirectUri를 분기처리하여 재설정한다.
