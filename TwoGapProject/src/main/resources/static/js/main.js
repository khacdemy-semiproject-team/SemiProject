const centerBox = document.querySelector(".center-box");
const profileEdit = document.querySelector('.profile-edit');
let alertWrite = document.querySelector(".write"); // 최초 alertWrite 버튼을 한 번만 정의

// 알림 내용 갱신 함수
function fetchRequest() {
  fetch("/boards/selectAlert")
    .then(response => response.text())  // 응답을 바로 텍스트로 변환
    .then(alertContent => {
      alertContent = alertContent.replaceAll("<br>", "\n");
      selectAlert(alertContent);
    });
}

// 알림 내용 반영 함수
function selectAlert(alertContent) {
  const logo = document.querySelector(".logo");
  logo.classList.remove("update-logo");
  logo.innerHTML = "<h1>2 YEARS APART</h1><h2>MINI HOMEPAGE</h2>";
  const testBox = document.querySelector(".self-box2");
  testBox.innerHTML = alertContent;
}

// 글쓰기 클릭 시 이벤트
alertWrite.addEventListener("click", handleWriteClick);

function handleWriteClick() {
  const testBox = document.querySelector(".self-box2");
  const logo = document.querySelector(".logo");

  // 상태 변경
  logo.innerHTML = "<span class='alert-title'>공지사항 수정</span>";
  testBox.readOnly = false;
  centerBox.style.backgroundColor = "#CDE3EE80";

  // 버튼 상태 변경
  alertWrite.classList.remove("write");
  logo.classList.add("update-logo");
  testBox.classList.add("update-box");
  alertWrite.classList.add("checkBtn");

  const checkBtn = document.querySelector(".checkBtn");

  // 확인 버튼 클릭 이벤트 리스너
  checkBtn.addEventListener("click", handleCheckClick);
  
}

function handleCheckClick() {
  const textArea = document.querySelector(".update-box");

  if (textArea) {
    const textContent = textArea.value;

    console.log(textContent);

    // 알림 수정 요청
    fetch("/boards/updateAlert", {
      method: "PUT",
      body: textContent,
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('수정 요청에 실패했습니다.');
      }
      return resp.json();
    })
    .then(result => {
      if (result > 0) {
        alert("수정 성공!");
        fetchRequest();  // 알림 내용 갱신

        // 기존 버튼 제거하고 새 버튼 생성
        alertWrite.remove();
        const newAlertWrite = document.createElement("button");
        newAlertWrite.classList.add('write'); // 기존 버튼과 동일한 클래스 추가
        newAlertWrite.textContent = '글쓰기';
        profileEdit.appendChild(newAlertWrite);

        // 새로 생성된 버튼에 이벤트 리스너 추가
        newAlertWrite.addEventListener("click", handleWriteClick);

        // 상태 원복
        newAlertWrite.classList.remove("checkBtn");
        newAlertWrite.classList.add("write");
        textArea.classList.remove("update-box");
        centerBox.style["background-color"] = null;
        textArea.readOnly = true;
        
        // 다음 버튼 클릭을 위해 새 alertWrite를 저장
        alertWrite = newAlertWrite;
      } else {
        alert("수정 실패..");
      }
    })
    .catch(error => {
      console.error(error);
      alert("수정 실패.. 네트워크 오류가 발생했습니다.");
    });
  }
}

// 페이지 로드 시 알림 내용 가져오기
fetchRequest();