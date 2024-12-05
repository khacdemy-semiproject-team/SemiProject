/** 프로필 수정 
 * @author 우수민
*/

// 닉네임 유효성 검사
const checkObj = {
  "memberNickname": false,
  "profileImg": false,
  "introduction": false
}

// 프로필 이미지 업로드
const profileForm = document.getElementById("profile");  // 프로필 form
const profileImg = document.getElementById("profileImg");  // 미리보기 이미지 img
const imageInput = document.getElementById("imageInput");  // 파일 선택 input
const deleteImage = document.getElementById("deleteImage");  // 이미지 삭제 버튼
// const MAX_SIZE = 1024 * 1024 * 5;  // 최대 파일 크기 설정 (5MB)

const defaultImageUrl = `${window.location.origin}/images/user.png`;
// 절대 경로로 기본이미지 URL 설정
// -> http://localhost/images/user.png

let statusCheck = -1; // -1이면 초기 상태, 0이면 이미지 삭제, 1이면 새 이미지 선택
let previousImage = profileImg.src; // 이전 이미지(초기 상태 이미지 URL 저장)
let previousFile = null; // 이전에 선택된 파일 객체 저장

// 이미지 선택 시 미리보기 및 파일 크기 검사
imageInput.addEventListener("change", () => {
  console.log(imageInput.files);

  const file = imageInput.files[0];

  if(file) { // 파일 선택된 경우
    const newImageUrl = URL.createObjectURL(file); // 임시 URL 생성
    // 미리보기 이미지 url 용도
    profileImg.src = newImageUrl; // 미리보기 이미지 설정(img 태그의 src에 선택한 파일 임시 경로 대입)
    statusCheck = 1; // 새 이미지 선택 상태 기록
    checkObj.profileImg = true; 
    previousImage = newImageUrl; // 현재 선택된 이미지 이전 이미지로 저장(바뀔 경우 대비) --> src
    previousFile = file; // 현재 선택된 파일 객체를 이전 파일로 저장(바뀔 경우 대비) --> input
    
  } else { // 파일 선택이 취소된 경우
    profileImg.src = previousImage; // 이전 미리보기 이미지로 복원
    
    // 파일 입력 복구 : 이전 파일이 존재하면 다시 할당
    if(previousFile) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(previousFile);
      imageInput.files = dataTransfer.files; // 이전 파일로 input 태그의 files 속성 복구
    }
  }
  
});


// 이미지 삭제 버튼 클릭 시
deleteImage.addEventListener("click", () => {
  // 기본 이미지 상태가 아니면 삭제 처리
  if(profileImg.src !== defaultImageUrl) {
    imageInput.value = ""; // 파일 선택 초기화
    profileImg.src = defaultImageUrl; // 기본 이미지로 설정
    statusCheck = 0; // 삭제 상태 기록
    checkObj.profileImg = false; // 이미지 삭제됨
    previousFile = null; // 이전 파일 초기화 기록
  } else {
    // 기본 이미지 상태에서 삭제 버튼 클릭 시 상태를 변경하지 않음
    statusCheck = -1; // 변경 사항 없음 상태 유지
    checkObj.profileImg = false; // 변경 사항 없음
  }
});





// 바꿀 배경색 선택






// 자기소개 텍스트 필드 변경 시 처리
const introductionInput = document.getElementById("introduction"); // 자기소개 입력 필드
introductionInput.addEventListener("input", () => {
  if (introductionInput.value.trim().length > 0) {
    checkObj.introduction = true; // 자기소개가 변경되었음을 표시
  } else {
    checkObj.introduction = false; // 자기소개가 비어있다면 변경되지 않았다고 표시
  }
});




const checkNickname = document.querySelector("#checkNickname");
const nicknameMessage = document.querySelector("#nicknameMessage");

checkNickname.addEventListener("click", (e) => { 
  // console.log("checkNickname 클릭됨");
    
    const memberNickname = document.querySelector("#memberNickname");
    if (memberNickname.value.trim().length === 0) {
        nicknameMessage.innerText = "한글, 영어, 숫자로만 2~10 글자로 입력해주세요.";
        nicknameMessage.classList.remove("confirm", "error");
        checkObj.memberNickname = false;
        memberNickname.value = "";
        return;
    }

    const regExp = /^[가-힣\w\d]{2,10}$/;

    if( !regExp.test(memberNickname.value) ) { 
      nicknameMessage.innerText = "유효하지 않은 닉네임 형식입니다.";
      nicknameMessage.classList.add("error");
      nicknameMessage.classList.remove("confirm");
      checkObj.memberNickname = false;
      return;
    }
    
    // 닉네임 중복 검사
    fetch("/boards/checkNickname?memberNickname=" + memberNickname.value)
        .then(resp => resp.text())
        .then(count => {

            if (count == 1) {
                nicknameMessage.innerText = "이미 사용 중인 닉네임 입니다.";
                nicknameMessage.classList.add("error");
                nicknameMessage.classList.remove("confirm");
                checkObj.memberNickname = false;
                return;
            }

            nicknameMessage.innerText = "사용 가능한 닉네임 입니다.";
            nicknameMessage.classList.add("confirm");
            nicknameMessage.classList.remove("error");
            checkObj.memberNickname = true;
        })
        .catch(err => console.log(err));
});

// 변경사항이 있을 때는 제출, 없을 때는 제출 없이 메인페이지로 리턴
console.log(checkObj.memberNickname);

const application = document.getElementById("application");

profileForm.addEventListener("submit", e =>{ 

    if(checkObj.memberNickname === false && checkObj.profileImg === false && checkObj.introduction === false)  {
    alert("변경사항이 없습니다")
    e.preventDefault();
      return;
    }
  
});

// if(statusCheck === -1) { // 변경 사항이 없는 경우 제출 막기
//     e.preventDefault();
//     alert("이미지 변경 후 제출하세요");

//   };

// // 닉네임 유효성 검사 통과하지 않으면 폼 제출 방지
// if (!checkObj.memberNickname) {
//   e.preventDefault();
//   alert("유효한 닉네임을 입력하세요.");
// };










