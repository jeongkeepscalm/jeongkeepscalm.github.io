---
title: JavaScript from work
description: JavaScript from work
date: 2023-08-15
categories: [ JavaScript, Work ]
tags: [ JavaScript, Work ]
---

## PromiseAll

```javascript
function getEduList(selectedYear, type) {

        const url1 = '/.../.../...';
        const url2 = '/.../.../...';

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
          let updateTitleUrl = '/.../.../...';
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
> updateTitle() 함수 매개변수를 활용해서 다른 서비스를 호출하고 싶을 경우, return { 함수명 : () => {} } 을 줘서 updateTitle.callInnerFunction() 처럼 활용할 수 있다.  

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

## eval

```javascript 
let scriptElement = $(res).filter("script");
if (scriptElement.length > 0) {
    let scriptCode = scriptElement.text();
    eval(scriptCode);
}
```
> What the problem was : api로 불러온 html 안 스크립트 태그가 실행되지 않아 eval 로 실행했었음.  

<br/>

```javascript
/** form 안 input value 초기화 **/
function fnResetInput(inputIds) {
    inputIds.forEach((item) => {
        $("#" + item).val('');
    })
}
```

<br/>

```javascript
/** 휴대폰 번호 입력 시, '-' 붙여주는 형식으로 바꾸기 **/ 
function telInputValidator(input){
    let telno = input.value
        .replace(/[^0-9]/g, '')
        .replace(/(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g, "$1-$2-$3");
    input.value = telno;
}
```

<br/>

```javascript
/** 데이터를 받아와 form 안 input hidden 으로 값을 세팅해준다. **/
function appendInputHidden(jsonData, formId) {
    const form = document.getElementById(formId);
    Object.entries(jsonData).forEach((item)=>{
        if(item[1] !== "" && item[1] !== null ){
            let inputEl = document.createElement('input');
            inputEl.setAttribute('type','hidden');
            inputEl.setAttribute('name',item[0]);
            inputEl.setAttribute('value',item[1]);
            form.appendChild(inputEl);
        }
    })
}
```

<br/>

```javascript
/** 이메일 유효성 검사 **/
function emailUpdate(){
    const regExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/;

    if($('#password').val() == ''){
        $('#passAlarm').text("※ 비밀번호를 입력해주세요.")
        return;
    }

    if($('#emailAdres').val() == ''){
        $('#emailAlarm').text("※ 이메일을 입력해주세요.")
        return;
    }

    if(!regExp.test($('#emailAdres').val())){
        $('#emailAlarm').text("※ 입력 형식에 맞지 않습니다.")
        return;
    }

    ... 
}
```

<br/>

## validation

```javascript
validation : function () {
    return new Promise(async (resolve) => {
        if (prop.data.param.authName.trim() === "") {
            ...
            resolve(false);
        }
        if (prop.data.param.isAccessedToUpdate !== "true") {
            let authNameExists = await prop.api.checkAuthName();
            if (authNameExists > 0) {
                ...
                resolve(false);
            }
        }
        if (prop.data.param.chosenMenuArray.length === 0) {
            ...
            resolve(false);
        }
        resolve(true);
    });
},
save : function () {
    this.validation().then(res => {
        if (res) {
            let payLoad = JSON.parse(JSON.stringify(prop.data.param));
            $.ajax({
                url: "/.../.../...",
                data: payLoad,
                type: 'POST',
                success: function (res) {
                    if (res.success) {
                        
                    }
                }
            });
        }
    })
},
```
> validation 함수 내, 비동기 통신으로 데이터를 받아와야 하는 값이 있어 async await 을 사용했고,   
> return 값을 promise 객체로 준 뒤, 조건에 만족 할 때 save 함수를 실행한다.   

<br/>

## Input type=file

```javascript
function attachFile (id) {

    let input = document.createElement("input");
    input.type = "file";
    input.id = "inputFile";
    input.name = "inputFile";

    input.onchange = function (e) {
        document.getElementById(id).value = e.currentTarget.files[0].name
        objjs.data[id] = e.currentTarget.files[0];
    }

    input.click();

    // let formData = new formData();
    // formData.append('files', file);
}
```
> let formData = new formData();  
> formData.append('files', file);  
> 비동기 통신으로 form을 넘긴다. 매개변수 VO 안에는 필드명 private List<MultipartFile> files 를 가지고 있고, files에 담기게 된다.   

