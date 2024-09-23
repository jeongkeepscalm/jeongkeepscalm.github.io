---
title: "Log Interceptor"
description: "Log Interceptor"
date: 2024-09-23
categories: [ Spring, Spring Basic ]
tags: [ Spring, Spring Basic ]
---

***preHandle()***

```java
@Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;

            // @Controller 어노테이션이 붙은 클래스에만 로그를 남긴다.
            if (handlerMethod.getBeanType().isAnnotationPresent(Controller.class)) {

                String requestURI = request.getRequestURI();
                log.info("REQUEST URI: {} ", requestURI);

                Enumeration<String> parameterNames = request.getParameterNames();

                // 파라미터가 존재하지 않을때, 로그인되어 있는 유저가 로그인 화면 진입시 메인 페이지로 보낸다.
                if (!parameterNames.hasMoreElements()) {
                    if ("/auth/loginPage".equals(request.getRequestURI())) {
                        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                        Object principal = authentication.getPrincipal();
                        if (principal instanceof NonMember || principal instanceof Member) {
                            response.sendRedirect("/main");
                        }
                    }
                }
            }
        }
        return true;
    }
```