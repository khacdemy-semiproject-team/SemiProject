/** 페이지 네이션 작업
 *  11.29 파라미터 추가 이유는 게시판마다 가져올 함수를 구별할 방법이 떠오르지 않아서 입니다.
 * 선언 참조 /js/boards/note.js 74번 라인 참고해서 참고하기
 * @author 신동국
 */
function pagination(pagination, boardTypeNo) {

  let pageUl = document.querySelector(".pagination");

  if (pageUl != null ) {
    
    pageUl.innerHTML = "";

  } else {
    // 페이지네이션을 미작성 시 시작
    pageUl = document.createElement("ul");
    pageUl.classList.add("pagination");

    // 주의 사항 note.js 전역 1번라인에 선언했습니다. 그냥은 못 가져와요.
    // 참고해서 각자의 전역에 선언해두세요
  }

  // 이미 페이지네이션을 만들었을 시 지우고 시작
  

  // ul 안에 구성할 li 선언 후 testBox append
  const firstPage = document.createElement("li");
  const prevPage = document.createElement("li");
  const nextPage = document.createElement("li");
  const lastPage = document.createElement("li");

  // 첫페이지로 이동
  firstPage.innerHTML = "&lt;&lt;";
  firstPage.value = 1;

  // 이전 페이지로  이동
  prevPage.innerHTML = "&lt;";
  prevPage.value = pagination['prevPage'];

  // 다음 페이지로 이동
  nextPage.innerHTML = "&gt;";
  nextPage.value = pagination['nextPage'];

  // 마지막 페이지로 이동
  lastPage.innerHTML = "&gt;&gt;";
  lastPage.value = pagination['maxPage'];

  pageUl.append(firstPage);  
  pageUl.append(prevPage);

  let currentMaxPage = nextPage.value < lastPage.value ? pagination['startPage'] + 9 : lastPage.value;

  for(let i = pagination['startPage'] ; i <= currentMaxPage ; i++ ) {
    const page = document.createElement("li");
    page.innerText = i;
    page.value = i;

    if( i == pagination['currentPage']) page.classList.add("current");
    
    pageUl.append(page);
  }

  pageUl.append(nextPage);  
  pageUl.append(lastPage);

  testBox.append(pageUl);
  
  const pages = document.querySelectorAll(".pagination li");
  

  for(let page of pages) {

    // 현재 페이지는 요청 안 함
    if( page.value == pagination['currentPage']) {
      page.style.cursor = "default";
      continue;
    }

    // 11.29 추가 파라미터 가져올 방법이 안 떠오름
    switch (boardTypeNo) {
      case 1:
        page.addEventListener("click", e => boardSelectCp(e.target.value));
        break;
        
      case 2:
        page.addEventListener("click", e => noteSelectCp(e));
        break;

      case 3:
        page.addEventListener("click", e => visitorSelectCp(e.target.value));
        break;

      case 4:
        page.addEventListener("click", e => noteSelectCp(e.target.value));
        break;

      default:

        alert("시스템 문제 발생 저희에게 문의 해주세요");

    }
    // 페이지 이동 요청 이벤트
  }
}


// 12.05일 신동국 추가
const logoutBtn = document.querySelector("#logoutBtn");

if(logoutBtn !== null ) {

  logoutBtn.addEventListener("click", () => {
    location.href = "/member/logout"
  })

}

// 방문용 멤버 넘버 얻어오기
// 12 08일 신동국 추가


const randomMember = document.querySelector("#random-member");

let uid = window.location.search;
uid = uid.substring(uid.indexOf('=') + 1, uid.length);

if( randomMember !== null ) {
  randomMember.addEventListener("click", () => {

    fetch("/member/random")
    .then(resp => resp.text())
    .then(memberNo => {

      location.href = "/boards/main?uid=" + memberNo;
    })
  });
}

const boardsMain = document.querySelector(".boards-main");
const boardMain = document.querySelector(".board-main");
const photoMain = document.querySelector(".photo-main");
const visitorMain = document.querySelector(".visitor-main");
const noteMain = document.querySelector(".note-main");

// 공지사항 이동
if(boardsMain !== null ) {
  boardsMain.addEventListener("click", () => {
    const path = uid == "" ? "/boards/main": "/boards/main?uid=" + uid;
    location.href = path;
  });
}

// 게시판 이동
if(boardMain !== null ) {
  boardMain.addEventListener("click", () => {
    // const path = uid == "" ? "/board/main": "/board/main?uid=" + uid;
    const path = "/board/main";
    location.href = path;
  });
}

// 사진첩 이동
if(photoMain !== null ) {
  photoMain.addEventListener("click", () => {
    // const path = uid == "" ? "/photo/main": "/boards/main?uid=" + uid;
    const path = "/photo/main";
    location.href = path;
  });
}

// 방명록 이동
if(visitorMain !== null ) {
  visitorMain.addEventListener("click", () => {
    const path = uid == "" ? "/visitor/main": "/visitor/main?uid=" + uid;
    location.href = path;
  });
}

document.querySelector(".back-home").addEventListener("click", () => {
  location.href = "/boards/main";
});

if( uid !== "" ) {
  noteMain.classList.add("hidden");
  document.querySelector(".profile-edit").classList.add("hidden");
  document.querySelector(".back-home").classList.remove("hidden");
}




calendarInit();

// 달력 이용 
function calendarInit() {

  // 날짜 정보 가져오기
  var date = new Date(); // 현재 날짜(로컬 기준) 가져오기
  var utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000); // uct 표준시 도출
  var kstGap = 9 * 60 * 60 * 1000; // 한국 kst 기준시간 더하기
  var today = new Date(utc + kstGap); // 한국 시간으로 date 객체 만들기(오늘)

  var thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // 달력에서 표기하는 날짜 객체

  var currentYear = thisMonth.getFullYear(); // 달력에서 표기하는 연
  var currentMonth = thisMonth.getMonth(); // 달력에서 표기하는 월
  var currentDate = thisMonth.getDate(); // 달력에서 표기하는 일

  // 캘린더
  renderCalender(thisMonth);

  function renderCalender(thisMonth) {

      // 데이터 정리
      currentYear = thisMonth.getFullYear();
      currentMonth = thisMonth.getMonth();
      currentDate = thisMonth.getDate();

      // 이전 달의 마지막 날 날짜와 요일 구하기
      var startDay = new Date(currentYear, currentMonth, 0);
      var prevDate = startDay.getDate();
      var prevDay = startDay.getDay();

      // 이번 달의 마지막날 날짜와 요일 구하기
      var endDay = new Date(currentYear, currentMonth + 1, 0);
      var nextDate = endDay.getDate();
      var nextDay = endDay.getDay();

      // 현재 월 표기
      document.querySelector(".year-month").innerHTML = currentYear + '.' + (currentMonth + 1);

      // 렌더링 html 요소 생성
      calendar = document.querySelector('.dates')
      calendar.innerHTML = '';
      
      // 지난달
      for (var i = prevDate - prevDay; i <= prevDate; i++) {
          calendar.innerHTML = calendar.innerHTML + '<div class="day prev disable">' + i + '</div>'
      }
      // 이번달
      for (var i = 1; i <= nextDate; i++) {
          calendar.innerHTML = calendar.innerHTML + '<div class="day currentMonth">' + i + '</div>'
      }
      // 다음달
      for (var i = 1; i <= (7 - nextDay == 7 ? 0 : 7 - nextDay - 1); i++) {
          calendar.innerHTML = calendar.innerHTML + '<div class="day next disable">' + i + '</div>'
      }

      // 오늘 날짜 표기
      if (today.getMonth() == currentMonth) {
          todayDate = today.getDate();
          var currentMonthDate = document.querySelectorAll('.dates .currentMonth');
          currentMonthDate[todayDate -1].classList.add('today');
      }
      
      // 이벤트는 요소를 추가할것 아니면 안됨
      // console.log(currentMonth); fetch api 사용
  }

  // 이전달로 이동
  document.querySelector(".go-prev").addEventListener("click", () => {
    thisMonth = new Date(currentYear, currentMonth - 1, 1);
    renderCalender(thisMonth);
  });

  // 다음달로 이동
  document.querySelector(".go-next").addEventListener("click", () => {
    thisMonth = new Date(currentYear, currentMonth + 1, 1);
    renderCalender(thisMonth); 
  });
}


// 12.10 우수민 작성
function homepageColor() {
  
  fetch("/boards/backgroundColor")
  .then(resp => resp.text())
  .then(color => {
    document.querySelector("body").style.backgroundColor = color;
    document.querySelector(".calendar").style.backgroundColor = color;
    document.querySelector(".profile").style.backgroundColor = color;
    document.querySelector(".center-box").style.backgroundColor = color;

  });
  
}



homepageColor();
