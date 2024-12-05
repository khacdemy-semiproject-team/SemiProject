const checkObj = {
  "memberPw": false,
  "memberPwConfirm": false
};


// 비밀번호 일치 여부, 유효성 검사
const memberPw = document.querySelector("#memberPw");
const memberPwConfirm = document.querySelector("#memberPwConfirm");
const pwMessage = document.querySelector("#pwMessage");
const checkPwMessage = document.querySelector("#checkPwMessage");

// 비밀번호, 비밀번호 확인 일치 확인
const checkPw = () => {
    if (memberPw.value === memberPwConfirm.value) {
        checkPwMessage.innerText = "비밀번호가 일치합니다.";
        checkPwMessage.classList.add("confirm");
        checkPwMessage.classList.remove("error");
        checkObj.memberPwConfirm = true; // 같을 경우 비밀번호 확인 true
        return;
    }
    checkPwMessage.innerText = "비밀번호가 일치하지 않습니다.";
    checkPwMessage.classList.add("error");
    checkPwMessage.classList.remove("confirm");
    checkObj.memberPwConfirm = false; // 다를 경우 비밀번호 확인 false
};

// 유효성 검사
memberPw.addEventListener("input", e => {
    const inputPw = e.target.value;

    if (inputPw.trim().length === 0) {
        pwMessage.innerText = "영어, 숫자, 특수문자(!, @, #, -, _) 6~20 글자 사이로 입력해주세요.";
        pwMessage.classList.remove("confirm", "error");
        checkObj.memberPw = false; // 비밀번호 유효 X
        memberPw.value = ""; // 처음에 띄어쓰기 못하게 막기
        return;
    }

    const regExp = /^[a-zA-Z0-9!@#_-]{6,20}$/;

    if (!regExp.test(inputPw)) { // 유효하지 않으면
        pwMessage.innerText = "비밀번호가 유효하지 않습니다";
        pwMessage.classList.add("error");
        pwMessage.classList.remove("confirm");
        checkObj.memberPw = false;
        return;
    }

    // 유효한 경우
    pwMessage.innerText = "유효한 비밀번호 형식입니다";
    pwMessage.classList.add("confrim");
    pwMessage.classList.remove("error");
    checkObj.memberPw = true;

    if (memberPwConfirm.value.length > 0) {
        checkPw();
    }
});

memberPwConfirm.addEventListener("input", () => {

    if (checkObj.memberPw) {
        checkPw(); // 비교하는 함수 수행
        return;
    }

    checkObj.memberPwConfirm = false;
});

// 비밀번호 값 null일 때 비밀번호 변경 버튼 안 눌리게 제한
const changePwForm = document.querySelector("#changePwForm");
const formSection = document.querySelector(".formSection");

formSection.addEventListener("submit", e => {

    for(let key in checkObj) {

        if(!checkObj[key]) {
            console.log(key);
            alert("변경하실 비밀번호 입력 후 눌러주세요!");
            e.preventDefault(); // 클릭 이벤트 중단
        
            // document.getElementById(key).focus(); // 초점 이동
        
            return;
        }
    }  
});