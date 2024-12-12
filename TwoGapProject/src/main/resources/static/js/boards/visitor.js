const testBox = document.querySelector(".test-box");
// const loginMember = fetch();
// console.log(loginMember);
/** 강의 예재 메뉴판 js 참조
 * 요소 생성 + 속성 추가 + 클래스 추가
 * @param {*} tag 요소
 * @param {*} attr 속성 - 스타일은 다른거임 잊지 말길 T.T
 * @param {*} cls 클래스
 * @returns 
 * @author 신동국
 */
const newEl = (tag, attr, cls) => {

  const el = document.createElement(tag);

  for (let ket in attr) {
    el.setAttribute(ket, attr[ket]);
  }

  for (let className of cls) {
    el.classList.add(className);
  }

  return el;
}


// 페이지네이션 클릭 시 이벤트
function visitorSelectCp(value) {
  fetch("/visitor/selectList?cp=" + value)
  .then(resp => resp.json())
  .then(result => {
    visitorList(result);
    pagination(result['pagination'], result.visitorList[0].boardTypeNo);
  });
}


// async 반환값은 async 함수에서만 이용이 가능하다 잊지 말기
// 게스트 생각해서 만들었지만 사용하지 않게 됨
async function sessionMemberNo() {
  let data = null;
  try {
    const response = await fetch("/getNo");
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    data = await response.text();

    return data;

  } catch (error) {
    console.error('Fetch error:', error);
  }
  return data;
}

let visitorUid = window.location.search;
visitorUid = visitorUid.substring(visitorUid.indexOf('=') + 1, visitorUid.length);

function selectVisitor() {
  const visitorContainer = newEl("div", {}, ["visitor-container"]);
  const boardTitle = newEl("div", {}, ["boards-title"]);
  boardTitle.innerHTML = "<h1>방명록</h1>"
  const divider = newEl("div", {}, ["divider"]);

  testBox.append(visitorContainer);
  visitorContainer.append(boardTitle);
  visitorContainer.append(divider);

  fetch("/visitor/selectList")
    .then(resp => resp.json())
    .then(result => {

      if (result.visitorList.length === 0) {

        let visitorContainer = document.querySelector(".visitor-container");
        visitorContentList = document.querySelector(".visitor-content-list");
      
        if( visitorContentList !== null ) visitorContentList.innerHTML = "";
        else {
          visitorContentList = newEl("div", {}, ["visitor-content-list"]);
          visitorContainer.append(visitorContentList);
        }

        visitorContentList.innerText = "방명록이 존재하지 않습니다";
        visitorContentList.style.cssText = "width: 100%; height: 100%; display: flex; "
        visitorContentList.style.cssText += "justify-content : center; align-items : center;";
        if(document.querySelector(".pagination") !== null ) document.querySelector(".pagination").remove();

        if( visitorUid !== "" ){
          writeForm = newEl("div", {}, ["write-form"]);
          const inputArea = newEl("textarea", { type: "text", placeholder: "방명록을 남겨주세요~~" }, []);
          const confirmBtn = newEl("button", {}, ["confirm-btn"]);
        
          visitorContainer.append(writeForm);
          writeForm.append(inputArea);
          writeForm.append(confirmBtn);
        
          confirmBtn.innerHTML = "등록";
        
          confirmBtn.addEventListener("click", () => visitorInsert(inputArea));
        }
        return;

      } else {
        pagination(result['pagination'], result.visitorList[0].boardTypeNo);
      }
      visitorList(result);
      
    })
  
}

async function visitorList(result) {

  let visitorContainer = document.querySelector(".visitor-container");
  visitorContentList = document.querySelector(".visitor-content-list");

  if( visitorContentList !== null ) visitorContentList.innerHTML = "";
  else {
    visitorContentList = newEl("div", {}, ["visitor-content-list"]);
    visitorContainer.append(visitorContentList);
  }
  const sessionNo = await sessionMemberNo(); // 세션 멤버 넘버 사용해야해서 얻어옴
  
  let writeForm = document.querySelector(".write-form");
  if( writeForm !== null ) writeForm.remove();
  
  if( visitorUid !== "" ){
    writeForm = newEl("div", {}, ["write-form"]);
    const inputArea = newEl("textarea", { type: "text", placeholder: "방명록을 남겨주세요~~" }, []);
    const confirmBtn = newEl("button", {}, ["confirm-btn"]);
  
    visitorContainer.append(writeForm);
    writeForm.append(inputArea);
    writeForm.append(confirmBtn);
  
    confirmBtn.innerHTML = "등록";
  
    confirmBtn.addEventListener("click", () => visitorInsert(inputArea));
  }

  for (let visitor of result.visitorList) {
    visitorItem(visitorContentList, visitor, sessionNo);
  }
  

}

function visitorItem(visitorContentList, visitor, sessionNo) {

  visitorContentList.style.cssText = "";
  const visitorItem = newEl("div", {}, ["visitor-item"]);
  const guestProfileImage = newEl("div", {}, ["guest-profile-image"]);
  const img = newEl("img", {}, []);
  const visitorText = newEl("div", {}, ["visitor-text"]);
  const visitorInfo = newEl("div", {}, ["visitor-info"]);
  const visitorContent = newEl("div", {}, ["visitor-content"]);
  const guestName = newEl("span", {}, ["guest-name"]);
  const visitorDate = newEl("span", {}, ["visitor-date"]);
  const editTools = newEl("div", {}, ["edit-tools"]);
  const updateSpan = newEl("span", {style: 'cursor: pointer;'}, []);
  const spaceP = newEl("span", {}, []);
  const deleteSpan = newEl("span", {style: 'cursor: pointer;'}, []);

  visitorContent.innerHTML = visitor.visitorContent.replaceAll("</br>", "\r\n");
  guestName.innerHTML = visitor.visitorMember.memberNickname;
  img.src = visitor.visitorMember.profileImg !== null ? visitor.visitorMember.profileImg : '/images/user.png';
  visitorDate.innerHTML = visitor.visitorDate;

  updateSpan.innerHTML = "수정";
  spaceP.innerHTML = "|";
  deleteSpan.innerHTML = "삭제";

  visitorContentList.append(visitorItem);
  visitorItem.append(guestProfileImage);
  guestProfileImage.append(img);
  visitorItem.append(visitorText);
  visitorText.append(visitorInfo);
  visitorText.append(visitorContent);
  visitorInfo.append(guestName);
  visitorInfo.append(visitorDate);
  visitorInfo.append(editTools);

  // 타인의 홈페이지를 방문하지 않을 시
  if (visitorUid === "" ) {
    editTools.append(deleteSpan);
  
  // 타인의 홈페이지 방문했을 때 로그인 유저의 글이 아닐때
  } else if( sessionNo == visitor.visitorMember.memberNo ) {
    editTools.append(updateSpan);
    editTools.append(spaceP);
    editTools.append(deleteSpan);
  }

  // 수정하기
  updateSpan.addEventListener("click", () => visitorUpdateModify(visitorText, visitorContent, editTools, visitorInfo, visitor.visitorNo))

  // 방명록 삭제하기
  deleteSpan.addEventListener("click", () => visitorDelete(visitor.visitorNo));
}

// 글쓰기 등록 이벤트
function visitorInsert(inputArea) {
  const inputVisitor = {
    visitorContent : inputArea.value.replaceAll(/(?:\r\n|\r|\n)/g, "<br>"),
    hostMemberNo : visitorUid
  }

  fetch("/visitor/insert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputVisitor)
  })
  .then(resp => resp.text()).then(result => {
    if( result > 0 ) {
      let cp = null;
      alert("게시글이 성공적으로 등록되었습니다.");
      if(document.querySelector(".current") !== null ) cp = document.querySelector(".current").value;
      else cp =1 ;
      visitorSelectCp(cp);
    }
  });
}

// 수정창으로 변경
function visitorUpdateModify(visitorText, visitorContent, editTools, visitorInfo, visitorNo) {
  const text = visitorContent.innerText.replaceAll("</br>", "\r\n");
  visitorContent.classList.add("hidden");
  editTools.classList.add("hidden");

  const visitorUpdateContent = newEl("textarea", {}, ["visitor-update-content"]);
  visitorUpdateContent.innerHTML = text;
  console.log(document.querySelector(".visitor-text"));
  visitorText.append(visitorUpdateContent);

  const confirmBox = newEl("div", {}, ["edit-tools"]);
  const confirmSpan = newEl("span", {style: 'cursor: pointer;'}, []);
  const spaceP = newEl("span", {}, []);
  const cancellSpan = newEl("span", {style: 'cursor: pointer;'}, []);

  confirmSpan.innerText = "확인";
  spaceP.innerText = "|";
  cancellSpan.innerText = "취소"; 

  confirmBox.append(confirmSpan);
  confirmBox.append(spaceP);
  confirmBox.append(cancellSpan);

  visitorInfo.append(confirmBox);

  confirmSpan.addEventListener("click", () => {
    const inputVisitor = {
      visitorContent : visitorUpdateContent.value.replaceAll(/(?:\r\n|\r|\n)/g, "<br>"),
      hostMemberNo : visitorUid,
      visitorNo : visitorNo
    }

    fetch("/visitor/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputVisitor)
    }).then(resp => resp.text())
    .then(result => {
      if( result > 0 ) {
        visitorContent.innerHTML = visitorUpdateContent.value.replaceAll(/(?:\r\n|\r|\n)/g, "<br>");
        visitorContent.classList.remove("hidden");
        editTools.classList.remove("hidden");
        visitorUpdateContent.remove();
        confirmBox.remove();
        alert("수정 성공");
      } else {
        alert("수정 실패");
      }
    })
});

  cancellSpan.addEventListener("click", () => {
    visitorContent.classList.remove("hidden");
    editTools.classList.remove("hidden");
    visitorUpdateContent.remove();
    confirmBox.remove();
  });
}

function visitorDelete(visitorNo) {
  if(!confirm("정말 삭제하시겠습니까")){
    return;
  }

  fetch("/visitor/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visitorNo)
  }).then(resp => resp.text())
  .then(result => {
    if( result > 0 ) {

      visitorSelectCp(document.querySelector(".current").value);
      alert("삭제 성공");
    } else {
      alert("삭제 실패");
    }
  })

}

selectVisitor();