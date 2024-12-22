---
title: "Clean Code - JS"
description: "Clean Code - JS"
date: 2024-12-21
categories: [ JavaScript, CleanCode ]
tags: [ JavaScript, CleanCode ]
---

### ***var 변수 지양***

- `var 변수`: **함수 스코프(function scope)**를 따르며, 코드 블록({}) 안에서 선언되더라도 해당 함수 전체에서 접근할 수 있어, 의도치 않는 값 변경이 일어날 수 있다. 
- `let, const 변수`: **블록 스코프(block scope)**를 따르기 때문에 더 안전하게 변수를 다룬다.

<br/>
<hr>

### ***전역 공간 사용 최소화***

- 최상위 객체
  - window(브라우저)
  - global(node.js)
  
- 여러 js 파일을 import 할 때, 전역 공간을 사용한 변수가 겹칠 시 원하는 로직 수행 불가

<br/>
<hr>

### ***임시변수 제거***

- 임시변수를 왜 제거해야할까?  
  1. 명령형으로 가득한 로직이 생성되므로 가독성이 안좋다.
  2. 디버깅이 힘들다.
  3. 추가적인 코드를 작성하고 싶은 유혹이 생긴다. (함수는 1기능 원칙 위배)
  
- 임시변수를 제거하려면?  
  1. 함수로 나눈다.
  2. 바로 반환한다. 
  3. 고차함수사용(map, filter, reduce...)
  4. 선언형 & 명령형
  
<details>
<summary><span style="color:orange" class="point"><b>Code</b></span></summary>
<div markdown="1">

```js
function badGetElements() {
  const result = {}; // 임시 저장 공간
  result.title = document.querySelector('.title');
  result.text = document.querySelector('.text');
  result.value = document.querySelector('.value');
  return result;
}

function goodGetElements() {
  return {
    title: document.querySelector('.title'),
    text: document.querySelector('.text'),
    value: document.querySelector('.value')
  }
}

// ------------------------------------

function badGetDateTime(targetDate) {
  let month = targetDate.getMonth();
  let day = targetDate.getDate();
  let hour = targetDate.getHours();

  month = month >= 10 ? month : '0' + month;
  day = day >= 10 ? day : '0' + day;
  hour = hour >= 10 ? hour : '0' + hour;

  return {month, day, hour}
}

function goodGetDateTime(targetDate) {
  const month = targetDate.getMonth();
  const day = targetDate.getDate();
  const hour = targetDate.getHours();

  return {
    month: month >= 10 ? month : '0' + month,
    day: day >= 10 ? day : '0' + day,
    hour: hour >= 10 ? hour : '0' + hour
  }

}
```

</div>
</details>


<br/>
<hr>

### ***호이스팅 주의***

- 호이스팅: 변수, 함수 선언 등이 코드의 실행 전에 최상위로 끌어올려지는 동작
  
- 호이스팅 문제점
  - 런타임 시 선언이 최상단으로 끌어올려져 초기화 이전 접근으로 인한 버그
  - 중복 선언으로 인한 예기치 않은 동작
  - 가독성과 유지보수성 문제
  
- 호이스팅 문제 해결방법
  - var 변수 사용 x
  - 함수 표현식 사용

<br/>
<hr>

### ***타입 검사***

```js
let arr = [1,2,3]
typeof arr // 'object'
Object.prototype.toString.call(arr) // '[object Array]'
```

<br/>
<hr>

### ***eqeqeq 사용***

- eqeq(==) 
  - 피연산자들의 자료형이 다를 경우, 비교하기 전에 **암묵적 타입 변환(implicit type conversion)**을 수행하여 값이 같을경우 true 반환
  - 암묵적 타입 변환을 수행하기 때문에, 비교 결과가 직관적이지 않은 경우가 많다.


<br/>
<hr>

### ***Number.isNaN() 사용***

- isNaN(): 암묵적 타입 변환하여 숫자가 아닌지 판단
- Number.isNaN(): 암묵적 타입 변환을 하지 않고, 값이 정확히 NaN인지 여부를 확인


<br/>
<hr>

### ***단축 평가(short-circuit evaluation)***

```js
true && true && '도달 O'
true && false && '도달 x'

false || false || '도달 O'
true || false || '도달 x'
```

<details>
<summary><span style="color:orange" class="point"><b>Code</b></span></summary>
<div markdown="1">

```JS
function badFetchData() {
  if (state.data) {
    return state.data;
  } else {
    return 'Fetching...';
  }
}

function goodFetchData() {
  return state.data || 'Fetching...';
}

// ------------------------------------

function badFavoriteDog(someDog) {
  let favoriteDog;
  if (someDog) {
    favoriteDog = dog;
  } else {
    favoriteDog = '냐옹';
  }
  return favoriteDog;
}

// someDog 가 falsy 일 경우 냐옹을 반환
function goodFavoriteDog(someDog) {
  return (someDog || '냐옹') + '입니다.';
}

// ------------------------------------

const badGetActiveUserName(user, isLogin) {
  if (isLogin && user) {
    if (user.name) {
      return user.name;
    } else {
      return 'Guest';
    }
  }
}

const goodGetActiveUserName(user, isLogin) {
  if (isLogin && user) {
    return user.name || 'Guest';
  }
}
```

</div>
</details>

<br/>
<hr>

### ***early return***

<details>
<summary><span style="color:orange" class="point"><b>Code</b></span></summary>
<div markdown="1">

```js
function badLoginService(isLogin, user) {
  if (!isLogin) {
    if (checkToken()) {
      if (!user.nickName) {
        return registerUser(user);
      } else {
        refreshToken();

        return '로그인 성공';
      }
    } else {
      throw new Error('No token');
    }
  }
}


function goodLoginService(isLogin, user) {

  if (isLogin) {
    return;
  }

  if (!checkToken()) {
    throw new Error('No token');
  }

  if (!user.nickName) {
    return registerUser(user);
  }
  
  refreshToken();
  return '로그인 성공';
}
```

</div>
</details>

<br/>
<hr>

### ***부정 조건문 지양하기***

- 부정 조건문을 왜 지양해야할까?
  - 생각을 여러번 해야할 수 있다.
  - 프로그래밍 언어 자체로 if문이 처음부터 오고 true 부터 실행시킨다.

- 부정 조건 예외
  - Early Return
  - Form Validation
  - 보안 / 검사 로직

<br/>
<hr>

### ***Default Case 고려***

<details>
<summary><span style="color:orange" class="point"><b>Code</b></span></summary>
<div markdown="1">

```JS
function badCreateElement(type, height, width) {
  const element = document.createElement(type);
  element.style.height = height;
  element.style.width = width;
  return element;
}
badCreateElement('div');


function goodCreateElement(type, height, width) {
  const element = document.createElement(type || 'div');
  element.style.height = String(height || 100) + 'px';
  element.style.width = String(width || 100) + 'px';
  return element;
}
goodCreateElement();

// ------------------------------------------------

function safe10진수ParseInt(number, radix) {
  return parseInt(number, radix || 10);
}
```

</div>
</details>

<br/>
<hr>

### ***??: Nullish coalescing operator***

<details>
<summary><span style="color:orange" class="point"><b>Code</b></span></summary>
<div markdown="1">

```js
function badCreateElement(type, height, width) {
  const element = document.createElement(type || 'div');
  element.style.height = String(height || 100) + 'px';
  element.style.width = String(width || 100) + 'px';
  return element;
}

// div, 100px, 100px
// height, width 가 0px인 dom을 만들 수 없는 코드
badCreateElement('div', 0, 0); 

function goodCreateElement(type, height, width) {
  const element = document.createElement(type || 'div');
  element.style.height = String(height ?? 100) + 'px';
  element.style.width = String(width ?? 100) + 'px';
  return element;
}
goodCreateElement('div', 0, 0); // div, 0px, 0px
```
> ??: 연산자는 왼쪽 피연산자가 null, undefined 일 경우에만 오른쪽 피연산자로 넘어간다.

</div>
</details>


<br/>
<hr>

### ***test***