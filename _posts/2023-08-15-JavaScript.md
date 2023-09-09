---
layout: post
title: JavaScript
date: 2023-08-15 00:00:00 +0900
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: js-1.png # Add image post (optional)
tags: [Js, Conference] # add tag
---

### Turn ( NodeList or HTMLCollection ) into Array

```javascript
Array.prototype.slice.call( [ NodeList or HTMLCollection ] )
  .forEach( function (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      ...
    }
  })
```
* NodeList 나 HTMLCollection 을 배열로 바꿔서 이벤트를 각 노드를에 이벤트를 줄 수 있다. 

<br/>
<hr>
<br/>

### 비동기통신 Content-Type

* 비동기통신에서 Content-Type 을 JSON 형식 ( 'application/json' )으로 보내면, 컨트롤러에서 @RequestBody 로 받는다. 
* new FormData() 객체를 생성해서 넘기거나 form태그 안의 데이터를 넘길 경우에는, 컨트롤러에서 @RequestParam 혹은 @ModelAttribute 로 받는다. 

<br/>
<hr>
<br/>

### PromiseAll

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
                              <li class="ui-state-default ui-sortable-handle" data-id="\${v.lv1Cd}">
                                  <div class="form-group_divide">
                                      <div class="form-group-child">
                                          <span class="input-frame01 block-100">
                                              <input type="text" placeholder="" id="inputBox1Id\${v.lv1Cd}" value="\${v.title}" class="inputValue block" readonly>
                                              <em class="del_btn01"><img src="/images/input_del.svg" alt="" id="delete1Id\${v.lv1Cd}" onclick="delY('recipient', \${v.lv1Cd}, this.id, \${v.tellDelYN})"></em>
                                          </span>
                                      </div>
                                      <div class="form-group-child flexnone ml10">
                                          <button class="button type02 whitcolor" id="button1Id\${v.lv1Cd}" onclick="updateTitle('recipient', \${v.lv1Cd}, this.id)">수정</button>
                                      </div>
                                  </div>
                              </li>
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
                              <li class="ui-state-default ui-sortable-handle" data-id="\${v.lv2Cd}">
                                  <div class="form-group_divide">
                                      <div class="form-group-child">
                                          <span class="input-frame01 block-100">
                                              <input type="text" placeholder="" value="\${v.title}" id="inputBox2Id\${v.lv2Cd}" class="inputValue block" readonly>
                                              <em class="del_btn01"><img src="/images/input_del.svg" alt="" id="delete2Id\${v.lv2Cd}" onclick="delY('subject', \${v.lv2Cd}, this.id, \${v.tellDelYN})" ></em>
                                          </span>
                                      </div>
                                      <div class="form-group-child flexnone ml10">
                                          <button class="button type02 whitcolor" id="button2Id\${v.lv2Cd}" onclick="updateTitle('subject', \${v.lv2Cd}, this.id)">수정</button>
                                      </div>
                                  </div>
                              </li>
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
* 비동기통신으로 받아온 데이터는 Promise 객체이고, 받아온 객체를 Promise.all([a, b, c ..]) 로 다룰 수 있다. 

<br/>
<hr>
<br/>

### innerFunction

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
* updateTitle() 함수 매개변수를 활용해서 다른 서비스를 호출하고 싶을 경우, return { 함수명 : () => {} } 을 줘서  updateTitle.callInnerFunction() 처럼 활용할 수 있다. 

<br/>
<hr>
<br/>