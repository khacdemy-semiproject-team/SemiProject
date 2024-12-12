const testBox = document.querySelector(".test-box");

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

  for(let ket in attr) {
      el.setAttribute(ket, attr[ket]);
  }

  for (let className of cls) {
      el.classList.add(className);
  }

  return el;
}


// 언팔 이벤트 
async function unFollowEvent(btn, memberNo) {

  const resp = await fetch("/follow/unFollow", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(memberNo)
  })

  const count = await resp.text();
  
    if(count > 0) {
      alert("팔로우를 해제했습니다");
      btn.innerHTML = "<i class='fa-solid fa-user-plus'></i>";
      btn.onclick = () => addFollowEvent(btn, memberNo);
    } else {
      alert("안대!");
    }
  
}

// 팔로우 이벤트
async function addFollowEvent(btn, memberNo) {

  const resp = await fetch("/follow/addFollow", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberNo)
    }
  )
  const count = await resp.text();

  if( count > 0 ) {
    alert("팔로우를 추가했습니다");
    btn.innerHTML = "<i class='fa-solid fa-user-minus'></i>";
    btn.onclick = () => unFollowEvent(btn, memberNo);
  } else {
    alert("안대!");
  }
}


///////////////////////////////////////////////////////////////////////////////////
// followBox 상단 머릿말 + 구분선
function followBox() {
  const followContainer = newEl("div", {}, ["follow-container"]);
  const followContainerHeader = newEl("div", {}, ["follow-container-header"]);
  const headerSpan = newEl("span", {}, []);
  headerSpan.innerText = "팔로우";
  const listButton = newEl("button", {}, []);
  listButton.style.cursor = "pointer";
  listButton.innerText = "목록으로";

  const searchSection = newEl("div", {}, ["search-section"]);
  const searchBox = newEl("div", {}, ["search-box"]);
  const searchInput = newEl("input", {placeholder:"검색할 유저를 검색하세요", name:"searchInput"}, ["search-input"]);
  const searchButton = newEl("button", {type:"button"}, ["search-button"]);
  searchButton.innerText = "검색";

  const divider = newEl("div", {}, ["divider"]);

  testBox.append(followContainer);
  followContainerHeader.append(headerSpan);
  followContainerHeader.append(listButton);
  followContainer.append(followContainerHeader);
  followContainer.append(searchSection);
  followContainer.append(divider);

  searchSection.append(searchBox);
  searchBox.append(searchInput);
  searchBox.append(searchButton);

  followListCreate(); // 팔로우 추가 해제 이후에 추가할 예정

  searchButton.addEventListener("click", () => followSearch());
  listButton.addEventListener("click", () => followListCreate());
}


///////////////////////////////////////////////////////////////////////////////////////////
// follow 검색 이벤트
function followSearch() {
  if(document.querySelector(".follow-tabs") !== null )document.querySelector(".follow-tabs").remove();
  if(document.querySelector(".follow-list-container") !== null )document.querySelector(".follow-list-container").remove();
  const searchValue = document.querySelector(".search-input").value;
  let searchUserList = document.querySelector(".search-user-list");
  
  if( searchValue.trim().length == 0 ) {
    alert("검색어를 입력 후 입력해주세요");
    return;
  }

  if(searchUserList !== null ) {
    searchUserList.innerHTML = "";
  } else {
    searchUserList = newEl("div", {}, ["search-user-list"]);
  }

  document.querySelector(".follow-container").append(searchUserList);

  fetch("/follow/search?searchName=" + searchValue)
  .then(resp => resp.json())
  .then(searchList => {

    // 검색된 유저가 없을 때
    if(searchList.length === 0 ) {
      searchUserList.innerHTML = "검색된 친구가 없다네요 ㅠㅠ";
      searchUserList.style.justifyContent = "center";
    } else {
      searchUserList.style.justifyContent = "start";

      createSearchItem(searchList);
    }

  }) 
}


///////////////////////////////////////////////////////////////////////////////////
// 검색 후 검색된 유저들 결과 리스트 출력 및 이벤트 추가
function createSearchItem(searchList) {
  
  for(let searchUser of searchList ) {
    // 어펜드할 div 얻어오기
    const searchUserList = document.querySelector(".search-user-list");
    // 추가할 냉용
    const followSearchItem = newEl("div", {}, ["follow-search-item"]);
    const followSearchInfo = newEl("div", {}, ["follow-search-info"]);
    const followSearchButton = newEl("button", {}, ["follow-search-button", "following"]);

    const followSearchImage = newEl("div", {}, ["follow-search-image"]);
    const profileSrc = searchUser.profileImg === null ? "/images/user.png": searchUser.profileImg;
    const profileImg = newEl("img", {src: `${profileSrc}`, alr: "프로필 이미지"}, []);
    const followSearchName = newEl("span", {}, ["follow-search-name"]);
    followSearchName.innerText = searchUser.memberNickname;

    searchUserList.append(followSearchItem);
    followSearchItem.append(followSearchInfo);
    followSearchItem.append(followSearchButton);
    followSearchInfo.append(followSearchImage);
    followSearchInfo.append(followSearchName);
    followSearchImage.append(profileImg);

    switch (searchUser.followState) {
      case 1: case 2:
        
        followSearchButton.innerHTML = "<i class='fa-solid fa-user-minus'></i>";
        followSearchButton.onclick = async (e) => {
          e.stopPropagation();
          await unFollowEvent(followSearchButton, searchUser.memberNo);
          followSearch();
        };
        break;

      case 3: case 4:
        followSearchButton.innerHTML = "<i class='fa-solid fa-user-plus'></i>";
        followSearchButton.onclick = async (e) => {
          e.stopPropagation();
          await addFollowEvent(followSearchButton, searchUser.memberNo);
          followSearch();
        };
        break;

      default:
        alert("시스템 문제 발생 저희에게 문의 해주세요");
    }
    followSearchItem.addEventListener("click", () => followPopup(searchUser, 2));
  }

}


///////////////////////////////////////////////////////////////////////////////////
// 조회 리스트 출력
function followListCreate() {

  fetch("/follow/selectList")
  .then(resp => resp.json())
  .then(memberList => {

    if( document.querySelector('.list-none') !== null ) 
    if(memberList.length === 0 ) {
      const div = document.createElement('div');
      div.style.width = "100%";
      div.style.height = "100%";
      div.style.height = "100%";
      div.style.display = "flex";
      div.style.cssText += "justify-content : center; align-items : center;";
      div.innerText = "팔로우 관계의 유저가 없습니다 T.T";
      div.classList.add("list-none");
      document.querySelector(".follow-container").append(div);
      return;
      
    }


    const searchUserList = document.querySelector(".search-user-list");
    if( searchUserList !== null) searchUserList.remove();

    let followTabs = document.querySelector(".follow-tabs");
    if( followTabs === null ) followTabs = newEl("div", {}, ["follow-tabs"]);
    else followTabs.innerHTML = "";
    
    const tab1 = newEl("div", {}, ["tab"]);
    const tab2 = newEl("div", {}, ["tab"]);
    const tab3 = newEl("div", {}, ["tab"]);

    tab1.innerHTML = "&nbsp맞팔&nbsp";
    tab2.innerText = "팔로잉";
    tab3.innerHTML = "팔로워";

    document.querySelector(".follow-container").append(followTabs);
    followTabs.append(tab1);
    followTabs.append(tab2);
    followTabs.append(tab3);

    let followListContainer = document.querySelector(".follow-list-container");
    if( followListContainer === null ) followListContainer = newEl("div", {}, ["follow-list-container"]);
    else followListContainer.innerHTML = "";
    document.querySelector(".follow-container").append(followListContainer);

    
    const followList1 = newEl("div", {}, ["follow-list"]);
    const followList2 = newEl("div", {}, ["follow-list"]);
    const followList3 = newEl("div", {}, ["follow-list"]);

    followListContainer.append(followList1);
    followListContainer.append(followList2);
    followListContainer.append(followList3);

    // 가져온 멤버들 정리
    for( let member of memberList) {

      
      switch(member.followState) {
        case 1:
          createFollowItem(followList1, member);
          break;
    
          
        case 2: 
          createFollowItem(followList2, member);
          break;
    
          
        case 3:
          createFollowItem(followList3, member);
          break;
    
        default:
          alert("문제 발생 문의 바람")
      }
      
    }
  })
}


// 목록 조회 팔로우 유저들 상태 표시
 function createFollowItem(followList, member) {

  const followItem = newEl("div", {}, ["follow-item"]);
  const followInfo = newEl("div", {}, ["follow-info"]);
  const followButton = newEl("button", {}, ["follow-button", "following"]);

  const followImage = newEl("div", {}, ["follow-image"]);
  const image = newEl("img", {alt: "프로필 이미지"}, []);
  const followName = newEl("span", {}, ["follow-name"]);
  image.src = member.profileImg === null ? "/images/user.png": member.profileImg;
  followName.innerText = member.memberNickname;

  followImage.append(image);
  followInfo.append(followImage);
  followInfo.append(followName);
  followItem.append(followInfo);
  followItem.append(followButton);
  followList.append(followItem);

  switch(member.followState) {
    case 1:
      followButton.innerHTML = "<i class='fa-solid fa-user-minus'></i>";
      followButton.onclick = async (e) => {
        e.stopPropagation();
        await unFollowEvent(followButton, member.memberNo);
        followListCreate();
      }
      break;

      
    case 2: 
      followButton.innerHTML = "<i class='fa-solid fa-user-minus'></i>";
      followButton.onclick = async (e) => {
        e.stopPropagation();
        await unFollowEvent(followButton, member.memberNo);
        followListCreate();
      }
      break;

      
    case 3:
      followButton.innerHTML = "<i class='fa-solid fa-user-plus'></i>";
      followButton.onclick = async (e) => {
        e.stopPropagation();
        await addFollowEvent(followButton, member.memberNo);
        followListCreate();
      }
      break;

    default:
      alert("문제 발생 문의 바람")
  }

  
  followItem.addEventListener("click", () => followPopup(member, 1));
}


// 팝업 띄우기
function followPopup(member, state) {

  const popupOutside = newEl("div", {}, ["popup-outside"]);
  const followPopup = newEl("div", {id : "follow-popup"}, []);
  const popupProfile = newEl("div", {}, ["popup-profile"]);
  const popupProfileImg = newEl("div", {}, ["popup-profile-img"]);
  const image = newEl("img", {alt : "프로필"}, []);
  image.src = member.profileImg === null ? "/images/user.png": member.profileImg;

  const popupProfileText = newEl("div", {}, ["popup-profile-text"]);
  const popupProfileNickname = newEl("div", {}, ["popup-profile-nickname"]);
  popupProfileNickname.innerHTML = member.memberNickname;
  const popupProfileButton = newEl("div", {}, ["popup-profile-button"]);
  const homeButton = newEl("button", {}, []);
  homeButton.innerHTML = "<i class='fa-solid fa-house'></i>";
  const followButton = newEl("button", {}, []);
  followButton.innerHTML = "<i class='fa-solid fa-user-plus'></i>";

  const popupIntroduction = newEl("div", {}, ["popup-introduction"]);
  const introduction = newEl("div", {}, []);
  introduction.innerHTML = member.introduction == null ? "안녕하세요. 잘 부탁드립니다.": member.introduction;

  followPopup.append(popupProfile);
  popupProfile.append(popupProfileImg);
  popupProfileImg.append(image);
  popupProfile.append(popupProfileText);
  popupProfileText.append(popupProfileNickname);
  popupProfileText.append(popupProfileButton);
  popupProfileButton.append(homeButton);
  popupProfileButton.append(followButton);
  followPopup.append(popupIntroduction);
  popupIntroduction.append(introduction);
  document.body.append(followPopup);
  document.body.append(popupOutside);


  switch(member.followState) {
    case 1: case 2:
      followButton.innerHTML = "<i class='fa-solid fa-user-minus'></i>";
      followButton.onclick = () =>  {
        unFollowEvent(followButton, member.memberNo);
        
      }
      break;
    case 3: case 4:
      followButton.innerHTML = "<i class='fa-solid fa-user-plus'></i>";
      followButton.onclick = () => {
        addFollowEvent(followButton, member.memberNo);
      }
      break;
  }

  homeButton.addEventListener("click", () => {
    location.href = '/boards/main?uid=' + member.memberNo;
  });

  popupOutside.addEventListener("click", () => {
    followPopup.remove();
    popupOutside.remove();
    popupButtonEvent(state);
  });


}


function popupButtonEvent(state) {
  switch(state) {
    case 1: followListCreate();
      break;
    case 2: followSearch(); 
      break;
    default:
      alert("오류가 났습니다. 고객센터에 문의를 남겨주시기 바랍니다.")
  }
}

// testBox 생성
followBox();