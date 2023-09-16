---
layout: post
title: JavaScript
date: 2023-08-15 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: js-1.png # Add image post (optional)
tags: [Js, Conference] # add tag
---

## 비동기통신 

* dataType : 서버에서 어떤 타입을 받을 것인지를 의미한다. 생략했을경우에는 jQuery가 MIME타입들을 보면서 자동으로 결정한다.
  - dataType 종류 ( xml, html, script, json, text )
  - dataType : html 시, script 태그가 포함된 경우 처리한다. 
* contentType : 서버로 데이터를 보낼 때 어떤 타입으로 보낼 것인지를 지정한다. 
  - json 형식 - application/json; charset-utf-8
  - form 형식( Default ) -  application/x-www-form-urlencoded; charset=utf-8
* processData : ajax 통신을 통해 데이터를 전송할때, 기본적으로 key와 value값을 Query String으로 변환해서 보낸다. 데이터 값에 따라 (key=value&key=value) 또는 (key:value, key:value) 이런 식으로 보내게되는데, 이 때 processData 가 false 로 설정되어 있으면 Query String 으로 설정하지 않는다. (processData 는 파일 전송 시 사용)
  - processData : false 설정 후 데이터를 보내면 ( ...?[object%20Object] 형식으로 나오는걸 볼 수 있다. )

<br/>

* Content-Type 을 JSON 형식 ( 'application/json' )으로 보내면, 컨트롤러에서 @RequestBody 로 받는다. 
* new FormData() 객체를 생성해서 넘기거나 form태그 안의 데이터를 넘길 경우에는, 컨트롤러에서 @RequestParam 혹은 @ModelAttribute 로 받는다. 

<br/>
<hr>
<br/>

## PromiseAll

```javascript
function getEduList(selectedYear, type) {

        const url1 = '/kdrug/edumng/edusubmng/eduRecipientMngList.cm';
        const url2 = '/kdrug/edumng/edusubmng/eduSubjectMngList.cm';

        const payLoad = new FormData();
        payLoad.set('thYr', selectedYear);

        let responsePromise1 = fetch(url1, {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({thYr: selectedYear})});
        let responsePromise2 = fetch(url2, {method: 'POST', body: payLoad});

        Promise.all([responsePromise1, responsePromise2])
            .then(response => {
                const data1 = response[0].json();
                const data2 = response[1].json();
                return Promise.all([data1, data2]);
            })
            .then(data => {
                const [data1, data2] = data;
                let eduObject1 = document.getElementById('category1');
                let eduObject2 = document.getElementById('category2');

                if (type === 'recipient') {
                    getRecipientList(readyForSorting1);
                } else if (type === 'subject') {
                    getSubjectList(readyForSorting2);
                } else {
                    getRecipientList(readyForSorting1);
                    getSubjectList(readyForSorting2);
                }

                function getRecipientList(callBack) {
                    eduObject1.innerHTML = '';
                    data1.forEach((v,i) => {
                        let contextToAdd =
                            `
                              ...
                            `;
                        eduObject1.insertAdjacentHTML('beforeend', contextToAdd);
                    })
                    callBack();
                }
                function getSubjectList(callBack) {
                    eduObject2.innerHTML = '';
                    data2.forEach((v,i) => {
                        let contextToAdd =
                            `
                              ...
                            `;
                        eduObject2.insertAdjacentHTML('beforeend', contextToAdd);
                    })
                    callBack();
                }
            })
            .catch(error => {
                console.log('error : ', error);
            })
    }
```
> 비동기통신으로 받아온 데이터는 Promise 객체이고, 받아온 객체를 Promise.all([a, b, c ..]) 로 다룰 수 있다. 

<br/>
<hr>
<br/>

## innerFunction

```javascript
function updateTitle(type, pk, buttonId) {
  if (type === 'recipient') {
      let readOnly = document.getElementById('inputBox1Id'+pk).readOnly;
      if (readOnly === true) {
          document.getElementById('inputBox1Id'+pk).readOnly = false;
          document.getElementById(buttonId).innerText = '저장';
      } else {
          if (document.getElementById('smallEduMngPopup').innerHTML === '') {
              openSmallPopup("CoreEduStatus2Popup", {name : 'updateRecipientTitle', type : type, pk : pk, buttonId : buttonId});
          }
          let thisInputValue = document.getElementById('inputBox1Id'+pk).value;
          let selectedYear = document.getElementById('yearSelectBox').value;
          let updateTitleUrl = '/kdrug/edumng/edusubmng/updateEduRecipientTitle.cm';
          let param = {title : thisInputValue, thYr : selectedYear, lv1Cd : pk};
          return  {
              callInnerFunction: function () {
                  fetch(updateTitleUrl, {
                      method: 'post',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify(param)
                  })
                      .then(res => res.json())
                      .then(res => {
                          if (res === true) {
                              document.getElementById('inputBox1Id'+pk).readOnly = true;
                              document.getElementById(buttonId).innerText = '수정';
                              document.querySelector('.close-two').click();
                          }
                      });
              }
          }
      }
  }
}
```
> updateTitle() 함수 매개변수를 활용해서 다른 서비스를 호출하고 싶을 경우, return { 함수명 : () => {} } 을 줘서  updateTitle.callInnerFunction() 처럼 활용할 수 있다. 

<br/>
<hr>
<br/>

## Grouping

```javascript
let mapGroupedByCurriculumNo = new Map();
let mapGroupedByLectureNo = new Map();

groupedByCategory[i].forEach(v => {

    // 키로 설정할 값을 변수에 담고 (그룹핑할 값을 키로 설정),
    const curriculumNo = v.curriculumNo;
    const lectureNo = v.lectureNo;

    // 맵에 해당 키가 없으면, 빈 배열을 값으로 넣어준다.
    if (!mapGroupedByCurriculumNo.has(curriculumNo)) {
        mapGroupedByCurriculumNo.set(curriculumNo, []);
    }
    if (!mapGroupedByLectureNo.has(lectureNo)) {
        mapGroupedByLectureNo.set(lectureNo, []);
    }

    // 해당 키에 해당하는 배열을 가져와서 객체를 넣는다.
    mapGroupedByCurriculumNo.get(curriculumNo).push(v);
    mapGroupedByLectureNo.get(lectureNo).push(v);

})
```

<br/>
<hr>
<br/>

## filter

```javascript
Array1 = Array1.filter(item => !Array2.includes(item));
```
> Array2 에 포함되지 않는 값을 담은 배열로 Array1 를 업데이트한다. 

<br/>

```javascript
if (division !== "0") {
    filtered = filtered.filter(v => {
        return v.division === ""+division;
    })
}
```
> () => {} 중괄호로 가둘때는, return 을 해줘야한다.

<br/>
<hr>
<br/>

## async / await

* async
    - 함수 앞에 async 키워드를 붙여 비동기 함수로 정의한다. 

* await 
    - 비동기 작업의 결과를 기다릴 때 사용한다. 
    - await 뒤에 Promise 객체를 반환하는 비동기 함수 또는 작업이어야 한다. 
    -  비동기 작업이 완료될 때까지 실행을 일시 중지하고 결과를 기다리다. 

* async, await : 네트워크 요청, 파일 읽기/쓰기, 데이터베이스 쿼리 등과 같이 시간이 걸리는 작업을 다룰 때 유용하게 사용한다. 

```javascript
getData : async () => {
    try {
        const offlineData = await prop.api.getYeonsuOfflineList();
        const onlineData = await prop.api.getYeonsuOnlineList();

        offlineData.list.forEach((v, i) => {
            prop.data.list.push(v);
        });

        onlineData.list.forEach((v, i) => {
            prop.data.list.push(v);
        });

        prop.draw.fnc.table(1);

    } catch (error) {
        console.error("데이터 가져오는 오류:", error);
    }
},
```
> What the problem was : async, await 키워드를 쓰기 전, 데이터를 모두 불러오지 못한 상황에 새 배열에 담으려 하니까, 모든 데이터가 배열에 담기지 않았음. 

<br/>

```javascript
firstLiElement.onclick = async () => {
    prop.data.pagingVO.currentPage = 1;
    await prop.draw.fnc.table(1, data);
}
```
> await 키워드를 사용하여 비동기통신이 완료될 때까지 기다리게 해서, prop.data.pagingVO.currentPage 의 값이 초기화 될 시간을 준다.
> What the problem was : prop.data.pagingVO.currentPage 가 1로 초기화가 되지 않고 api 호출이 일어나서 페이징처리가 제대로 이루어지지 않았음.

<br/>
<hr>
<br/>

## hasOwnProperty

```javascript
if (list[i].certification === "Y") {
    for (let field in list[i]) {
        if (list[i].hasOwnProperty(field) && field === "lectureNo") {
            if (!prop.data.lectureNoArray.includes(list[i].lectureNo)) {
                prop.data.lectureNoArray.push(list[i].lectureNo);
                certification.appendChild(certificationButton);
            }
        }
    }
}
```

<br/>
<hr>
<br/>

## sort

```javascript 
list = list.sort((a,b) => {
    const dateA = new Date(a.regDt);
    const dateB = new Date(b.regDt);
    return dateB - dateA; // 날짜가 큰 순서대로 (desc)
})
```
> 객체가 담긴 배열을 객체의 특정 속성을 기준으로 재정렬한다. 

<br/>
<hr>
<br/>

## eval

```javascript 
let scriptElement = $(res).filter("script");
if (scriptElement.length > 0) {
    let scriptCode = scriptElement.text();
    eval(scriptCode);
}
```
> What the problem was : api로 불러온 html 안 스크립트 태그가 실행되지 않아 eval 로 실행했었음.



















