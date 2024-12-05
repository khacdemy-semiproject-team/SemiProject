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
        page.addEventListener("click", e => noteSelectCp(e));
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