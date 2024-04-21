---
title: Jque
description: Jquery
date: 2024-01-23
categories: [ JavaScript, Asynchronous ]
tags: [ JavaScript, Asynchronous ]
---

## HTTP 통신 방법

* 동기 통신 <br/>
  페이지 전체가 리로딩된다. <br/>
	**Single-Thread** ( 통신을 하는 동안 다른 처리는 못하고 통신에만 집중한다. ) <br/>

* 비동기 통신 <br/>
	페이지는 가만히 있고 일부만 리로딩된다. <br/>
	**Multi-Thread** ( 통신을 하면서 다른 처리를 동시에 병렬적으로 처리한다. ) <br/>
	처리하는 순서를 제어할 수 없어 원하는 결과가 나오지 않을 경우가 있다. <br/>
	=> 이 때, async/await 를 사용해 순서제어가 가능하다. <br/>

<br/>

## xml, json, yaml 

* 어떤 구조를 가진 정보를 한 줄의 텍스트로 표현해서 전달하는 데이터 형식이다. 
* 즉, 서버와 주고 받는 적합한 데이터 형식인 "텍스트"를 기술하기 위한 데이터 형식이다.

<br/>

## 비동기 통신

1. **Ajax ( Asynchronous JavaScript + XML )** <br/>
	JS를 이용해 클라이언트와 서버 간 데이터를 주고 받는 비동기 HTTP 통신이다. <br/>
	XMLHttpRequest(XHR) 객체를 이용해 일부 필요한 데이터만 가지고 온다. <br/>
	
2. **Fetch** <br/>
	ES6에서 추가된 기능으로 서버로 네트워크 요청을 보내고 응답을 받을 수 있도록 하는 메서드이다. <br/>
	Promise 기반으로 동작하므로 데이터를 가공하거나 처리가 편리하다. <br/>
	JavaScript에서 제공되는 API 중 하나( 자바스크립트 내장 라이브러리 )이므로 별도의 패키지 설치가 필요 없다. <br/>
	JS 내장 라이브러리이기 때문에 JS업데이트에도 바로 대응이 가능하다. <br/>

3. **Axios** <br/>
	XMLHttpRequest 기반의 HTTP 통신 라이브러리( 별도의 패키지 설치 필요 )이다. <br/>
	Promise 기반으로 동작한다. <br/>
	운영 환경에 따라 브라우저의 XMLHttpRequest 객체 또는 Node.js 의 http api 를 사용한다. <br/>
	HTTP 요청과 응답을 JSON 형태로 자동 변경 가능하다. <br/>

* Ajax vs Fetch <br/>
	XHR 은 모든 요청을 한 번에 받아오는 반면, fetch 는 나눠서 가져오기 때문에 캐싱도 가능하고 진행도를 알 수 있다. <br/>
	fetch 는 no-cors request 가능하지만, ajax ( XMLHttpRequest 방식 )는 지원하지 않는다. <br/>
	
* Axios vs Fetch <br/>
	axios 는 response timeout 처리 방법( fetch 에 없는 기능 )이 존재한다. <br/>
	axios 는 data 전송 시 직렬화( JSON.stringify() )해줄 필요가 없다. <br/>
	fetch 의 경우 ES6를 지원하지 않는 브라우저에는 사용 불가능하다. <br/>

<br/>

## Source Code

#### Ajax

```javascript
const apiReq = function (url, data, type, json, form) {
    let dataType;
    let contentType;

    if (type != "get" && type != "GET") {
        type = "POST";
        if (json != "" && json != null) {
            data = JSON.stringify(data);
            dataType = "json";
            contentType = 'application/json; charset=utf-8';
        }
    }
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url,
            type: type,
            dataType: dataType,
            data: data,
            contentType: contentType,
            success: function (resultData) {
                if (resultData.statusCode === 200) {
                    resolve(resultData);
                }
            },
            error: function () {
                reject(null);
                console.error();
            }
        })
    })
		
};

// 파일 포함한 form post 전송방식
$.ajax({
	url: url,
	data: formData,
	type: 'POST',
	enctype:'multipart/form-data',
	dataType:'json',
	processData:false, // processData 가 false 로 설정되어 있으면 Query String 으로 설정하지 않는다.
	contentType:false,
	cache:false,
	success: function (resultData) {},
	error: function (xhr, status, error) {}
});


```
* contentType <br/>
	서버로 보내는 데이터의 유형을 지정한다. 주로 post 방식으로 데이터를 전송할 때 사용한다. <br/>
	contentType 기본값은 "application/x-www-form-urlencoded" 이다. <br/>
	json 형식으로 보낼 경우 contentType : "application/json" 으로 지정해줘야 한다. <br/>

* dataType <br/>
	서버로부터 받아온 응답 데이터의 유형을 지정한다. <br/>
	주로 get 요청 후 서버로 받은 데이터를 어떤 형식으로 처리할지를 지정한다. <br/>

* data <br/>
	**new FormData(), $("#listForm").serialize()** 로 데이터를 지정해주면, url?id=1&name=ojg 와 같이 **쿼리스트링 형식**으로 서버에 값을 보낸다 ( json 형식 x ) <br/>
	form 형식은 서버에서 @ModelAttribute, @RequestParam 으로 넘어온 데이터를 받는다. <br/>
	json 형식은 서버에서 @RequestBody 로 넘어온 데이터를 받는다. <br/>

* **@RestController(controller) , @ResponseBody(method)** <br/>
	해당 컨트롤러나 메서드에서 반환되는 값들을 JSON 형태로 변환하여 응답을 보낸다. <br/>
	return objectMapper.writeValueAsString(object); <br/>

<br/>

#### Fetch

```javascript
// Fetch Get 호출 (Get 방식은 요청 전문을 받지 않기 때문에 옵션 인자가 필요없다.)
fetch('http://example.com/api/data?id=123')
	.then((response) => response.json())
  .then((data) => console.log(data));

// Fetch Post 호출
fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Test",
    body: "I am testing!",
    userId: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));

// 사용개선 코드 ( POST )
async function apiPost(urlPath, body, headers = {}) {
	const url = urlPath;
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: JSON.stringify(body),
	};
	const res = await fetch(url, options);
	const data = await res.json(); // .json() : HTTP 응답(Response)의 내용을 JSON 형식으로 파싱하여 JavaScript 객체로 변환한다.
	if (res.ok) {
		return data;
	} else {
		throw Error(data);
	}
}
// JSON 형식으로 넘기니 서버에서 @RequestBody 로 받는다.

apiPost("/test.com", {
	title: "Test",
	body: "I am testing!",
	userId: 1,
})
	.then((data) => console.log(data))
	.catch((error) => console.log(error));

```