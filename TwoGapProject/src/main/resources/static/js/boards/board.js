const testBox = document.querySelector(".test-box");
// 현재 페이지 저장할 변수
 let cp = 1;

// 보드목록 조회
function boardSelect(e) {
  // board
  testBox.style.padding = "30px";

  let boardListTitle = document.querySelector(".boardList-title");
  let boardListTable = document.querySelector("table");

  if (boardListTitle != null) {
  } else {
    boardListTitle = document.createElement("div");
    boardListTitle.innerHTML = "<h1>게시판</h1>";
    boardListTitle.classList.add("boardList-title");
    testBox.append(boardListTitle);
  }

  if (boardListTable != null) {
    boardListTable.innerHTML = "";
  } else {
    boardListTable = document.createElement("table");
  }

  testBox.style.display = "flex";

  boardListTable.classList.add("boardList-table");

  testBox.append(boardListTable);


  // 테이블의 tbody 비동기 요청
  fetch("/board/selectList")
    .then((resp) => resp.json())
    .then((result) => {
      board(boardListTable, result.boardList);
      pagination(result["pagination"], result.boardList[0].boardTypeNo);
      cp = document.querySelector(".current").value;
    });

  document.querySelector(".board-write").onclick = () => boardInsert();
}

function boardSelectCp(value) {
  const boardListTable = document.querySelector("table");

  fetch("/board/selectList?cp=" + value)
    .then((resp) => resp.json())
    .then((result) => {
      board(boardListTable, result.boardList);
      pagination(result["pagination"], result.boardList[0].boardTypeNo);
      cp = document.querySelector(".current").value
    });
}

function board(boardListTable, boardList) {

  testBox.style.display = "flex";

  const boardThead = document.createElement("thead");

  const boardTr = document.createElement("tr");

  const boardTh1 = document.createElement("th");
  const boardTh2 = document.createElement("th");
  const boardTh3 = document.createElement("th");

  boardTh1.classList.add("boardList-number-column");
  boardTh2.classList.add("board-title");
  boardTh3.classList.add("boardList-date-column");

  boardListTable.append(boardThead);
  boardThead.append(boardTr);

  boardTh1.innerText = "번호";
  boardTr.append(boardTh1);

  boardTh2.innerText = "제목";
  boardTr.append(boardTh2);

  boardTh3.innerText = "날짜";
  boardTr.append(boardTh3);

  // 테이블의 tbody
  let boardTbody = document.querySelector("tbody");

  if (boardTbody !== null) {
    boardTbody.innerHTML = "";
  } else {
    boardTbody = document.createElement("tbody");
  }

  for (let board of boardList) {
    const tr = document.createElement("tr");

    const arr = ["boardNo", "boardTitle", "boardDate"];

    for (let x of arr) {
      const td = document.createElement("td");
      if( x == "boardDate") {
        td.innerText = board.boardUpdateDate === null ? board.boardDate : board.boardUpdateDate;
      } else {
        td.innerText = board[x];
      }
      tr.append(td);

      // 게시글 상세조회
      if (x == "boardTitle") {
        tr.addEventListener("click", () => selectBoard(board));
      }
    }

    boardTbody.append(tr);
  }

  boardListTable.append(boardTbody);
}

// 게시글 상세조회
function selectBoard(board) {
  // testbox dispaly: felx 해제
  testBox.style.display = "block";

  if( document.querySelector(".pagination") != null) document.querySelector(".pagination").remove();

  // 목록으로 버튼 생성
  const backList = document.createElement("button");
  backList.innerText = "목록으로";
  backList.classList.add("back-list");
  document.querySelector(".boardList-title").append(backList);

  // 내용 없애기
  let boardListTable = document.querySelector("table");
  boardListTable.innerHTML = "";

  // create
  const boardDetailPostHeader = document.createElement("div");

  const boardDetailPostTitle = document.createElement("sapn");
  const boardDetailDate = document.createElement("sapn");
  const boardDetailPostInfo = document.createElement("div");

  const boardDetailUpdateBtn = document.createElement("span");
  const boardDetailDeleteBtn = document.createElement("sapn");

  const boardDetailPostContent = document.createElement("div");


  // add
  boardDetailPostHeader.classList.add("boardDetail-post-header");

  boardDetailPostTitle.classList.add("boardDetail-post-title");
  boardDetailDate.classList.add("boardDetail-date");
  boardDetailPostInfo.classList.add("boardDetail-post-info");

  boardDetailUpdateBtn.classList.add("boardDetail-update");
  boardDetailDeleteBtn.classList.add("boardDetail-delete");

  boardDetailPostContent.classList.add("boardDetail-post-content");



  // append
  boardDetailPostTitle.innerText = board["boardTitle"];
  boardDetailPostHeader.append(boardDetailPostTitle);
  
  boardDetailDate.innerText = board.boardUpdateDate === null ? board.boardDate : board.boardUpdateDate;
  boardDetailPostHeader.append(boardDetailDate);

  testBox.append(boardDetailPostHeader);

  boardDetailUpdateBtn.innerText = "수정";
  boardDetailPostInfo.append(boardDetailUpdateBtn);

  boardDetailPostInfo.innerHTML += "<span>|</span>";

  boardDetailDeleteBtn.innerText = "삭제";
  boardDetailPostInfo.append(boardDetailDeleteBtn);

  boardDetailPostHeader.append(boardDetailPostInfo);

  testBox.append(boardListTable);

  boardDetailPostContent.innerText = board["boardContent"];
  boardListTable.append(boardDetailPostContent);

  



  // 상세조회 페이지(목록)로 돌아가기
  // 목록으로 버튼 클릭 시 이벤트
  backList.addEventListener("click", () => backListEvent(cp));

  // console.log(document.querySelector(".boardDetail-update"));
  // console.log(boardDetailUpdateBtn); // 트러블 슈팅

  // 게시글 수정하기
  // 수정 버튼 클릭 시 이벤트
  document.querySelector(".boardDetail-update")
    .addEventListener("click", () => boardDetailUpdate(board), {once: true});

  // 게시글 삭제하기
  // 삭제 버튼 클릭 시 이벤트
  boardDetailDeleteBtn.addEventListener("click", () => boardDetailDelete(board));

  // 글쓰기
  // 글쓰기 버튼 클릭 시 이벤트
}


// 게시글 목록으로 전환
function backListEvent(value) {
  // 버튼 삭제
  document.querySelector(".back-list").remove();

  // 제목 날짜 등등 삭제
  document.querySelector(".boardDetail-post-header").remove();

  // // 내용 감싸고 있는 테이블 삭제
  document.querySelector(".boardList-table").innerHTML = "";



  value = value === null ? 1 : value;

  fetch("/board/selectList?cp=" + value)
    .then((resp) => resp.json())
    .then((result) => {
      board(document.querySelector("table"), result.boardList);
      pagination(result["pagination"], result.boardList[0].boardTypeNo);
    });
}

// 게시글 수정
function boardDetailUpdate(board) {

  const boardDetailPostInfo = document.querySelector(".boardDetail-post-info");
  boardDetailPostInfo.innerHTML = "";

  const boardUpdateConfirmBtn = document.createElement("span");
  const boardUpdateCancelBtn = document.createElement("span");
  
  // 수정/삭제 -> 확인/취소
  // 확인
  boardUpdateConfirmBtn.classList.add("board-update-confirm");
  boardUpdateConfirmBtn.innerText = "확인";
  boardDetailPostInfo.append(boardUpdateConfirmBtn);

  boardDetailPostInfo.innerHTML += "<span>|</span>";
  // 취소
  boardUpdateCancelBtn.classList.add("board-update-cancel");
  boardUpdateCancelBtn.innerText = "취소";
  boardDetailPostInfo.append(boardUpdateCancelBtn);


  // 게시판 -> 게시글 수정
  const postUpdateTitle = document.querySelector(".boardList-title");
  postUpdateTitle.innerHTML = "<h1>게시글 수정</h1>";


  // 게시글 제목
  const boardDetailPostTitle = document.querySelector(
    ".boardDetail-post-title"
  );
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = board["boardTitle"];
  titleInput.classList.add("edit-title-input");
  boardDetailPostTitle.innerHTML = "";
  boardDetailPostTitle.appendChild(titleInput);

  // 게시글 내용
  const boardDetailPostContent = document.querySelector(".boardDetail-post-content");
  const contentTextarea = document.createElement("textarea");
  contentTextarea.value = board["boardContent"];
  contentTextarea.classList.add("edit-content-textarea");
  boardDetailPostContent.innerHTML = "";
  boardDetailPostContent.appendChild(contentTextarea);


  // 취소 버튼 클릭 시 이벤트
  boardUpdateCancelBtn.onclick = () => {
    alert("게시글 수정하기가 취소되었습니다.")
    document.querySelector(".boardDetail-post-header").remove();
    selectBoard(board);
  };

  // 확인버튼 클릭 시
  document.querySelector(".board-update-confirm").onclick = () => {

    const updatedTitle = document.querySelector(".edit-title-input").value;
    const updatedContent = document.querySelector(".edit-content-textarea").value;

    // 서버 요청
    board.boardTitle = updatedTitle;
    board.boardContent = updatedContent;

    // 서버로 수정 요청 보내기(비동기)
    fetch("/board/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    })
      .then((resp) => resp.json())
      .then((result) => {
        if (result > 0) {
          // 수정 성공 시
          document.querySelector(".boardDetail-post-header").remove();
          selectBoard(board);
          alert("게시글 수정에 성공 >.<");
        } else {
          // 수정 실패 시
          alert("게시글 수정에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("게시글 수정 중 오류가 발생했습니다.");
      });
  };

  // 취소버튼 클릭 시 게시글 상세조회로 돌아가기
  

}


// 게시글 삭제
// 게시글 삭제 함수
function boardDetailDelete(board) {
  // 삭제 확인 대화상자
  if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
    return; // 사용자가 취소를 선택하면 함수 종료
  }

  // 게시글 삭제 비동기 요청
  fetch("/board/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(board["boardNo"]),
  })
    .then((resp) => resp.json())
    .then((result) => {
      if (result > 0) {

        // 삭제 성공 시
        document.querySelector(".boardDetail-post-header").remove();
        document.querySelector(".back-list").remove();
        alert("게시글이 성공적으로 삭제되었습니다.");
        boardSelect(); // 게시판 목록으로 돌아가기

      } else {
        // 삭제 실패 시
        alert("게시글 삭제에 실패했습니다.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    });
}


// 게시글 글쓰기
// 게시글 작성 페이지로 이동
function boardInsert(insertBoard) {

  // 박스 초기화
  document.querySelector(".boardList-title").remove();
  document.querySelector(".boardList-table").remove();
  if(document.querySelector(".boardDetail-post-header") !== null) document.querySelector(".boardDetail-post-header").remove();
  if(document.querySelector(".pagination") !== null) document.querySelector(".pagination").remove();
  // if(document.querySelector(".board-write") !== null) document.querySelector(".board-write").remove();
  document.querySelector(".board-write").style.display = "none";

  // 등록 취소 버튼 클릭 시 잊지말기
  // document.querySelector(".board-write").style.display = "block";

  // const testBox = document.querySelector(".test-box");
  // testBox.innerHTML = "";
  // testBox.style.display = "block";
  // testBox.style.padding = "30px";

  // 제목 설정
  const boardWriteTitle = document.createElement("div");
  boardWriteTitle.classList.add("boardList-title");
  boardWriteTitle.innerHTML = "<h1>게시판 글쓰기</h1>";
  testBox.appendChild(boardWriteTitle);

  // 게시글 작성 폼 생성
  const writeForm = document.createElement("form");
  writeForm.classList.add("board-write-form");

  // 제목 입력 영역
  const titleWrapper = document.createElement("div");
  titleWrapper.classList.add("title-wrapper");
  const titleLabel = document.createElement("label");
  titleLabel.innerText = "제목";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.name = "boardWriteTitle";
  titleInput.classList.add("board-title-input");
  titleInput.placeholder = "제목을 입력해주세요";
  titleInput.required = true;
  titleWrapper.appendChild(titleLabel);
  titleWrapper.appendChild(titleInput);

  // 내용 입력 영역
  const contentWrapper = document.createElement("div");
  contentWrapper.classList.add("content-wrapper");
  const contentLabel = document.createElement("label");
  contentLabel.innerText = "내용";
  const contentTextarea = document.createElement("textarea");
  contentTextarea.name = "boardWriteContent";
  contentTextarea.classList.add("board-content-textarea");
  contentTextarea.placeholder = "내용을 입력해주세요";
  contentTextarea.required = true;
  contentWrapper.appendChild(contentLabel);
  contentWrapper.appendChild(contentTextarea);

  // 버튼 영역
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");

  // 등록 버튼
  const submitButton = document.createElement("button");
  submitButton.type = "button";
  submitButton.innerText = "등록";
  submitButton.classList.add("board-submit-btn");
  submitButton.addEventListener("click", () => boardWrite());

  // 취소 버튼
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.innerText = "취소";
  cancelButton.classList.add("board-cancel-btn");
  cancelButton.addEventListener("click", () =>boardSelect);

  buttonWrapper.appendChild(submitButton);
  buttonWrapper.appendChild(cancelButton);

  // if(document.querySelector(".board-write") !== null) document.querySelector(".board-write")

  // 폼에 요소 추가
  writeForm.appendChild(titleWrapper);
  writeForm.appendChild(contentWrapper);
  writeForm.appendChild(buttonWrapper);

  testBox.appendChild(writeForm);
}

// 게시글 작성 함수
function boardWrite() {
  const titleInput = document.querySelector(".board-title-input");
  const contentTextarea = document.querySelector(".board-content-textarea");

  // 유효성 검사
  if (titleInput.value.trim() === "") {
    alert("제목을 입력해주세요.");
    titleInput.focus();
    return;
  }

  if (contentTextarea.value.trim() === "") {
    alert("내용을 입력해주세요.");
    contentTextarea.focus();
    return;
  }

  // 서버로 전송할 데이터 객체 생성
  const boardData = {
    boardWriteTitle: titleInput.value,
    boardWriteContent: contentTextarea.value,
  };

  // 서버 요청
  boardData.boardWriteTitle = titleInput;
  boardData.boardWriteContent = contentTextarea;

  console.log(boardData);

  // 게시글 작성 비동기 요청
  fetch("/board/write", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(boardData)
  })
    .then((resp) => resp.json())
    .then((result) => {
      if (result > 0) {
        // 작성 성공 시 게시판 목록으로 이동
        boardSelect();
        alert("게시글이 성공적으로 등록되었습니다.");
        
      } else {
        // 작성 실패 시 알림
        alert("게시글 등록에 실패했습니다.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    });
}

// 조회
boardSelect();
