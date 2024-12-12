const checkObj = {
  "memberPw": false,
  "memberPwConfirm": false
};


// 비밀번호 일치 여부, 유효성 검사
const memberPw = document.querySelector("#memberPw"); // 현재 비밀번호 input
const memberNewPw = document.querySelector("#memberNewPw"); // 새로운 비밀번호 input
const memberPwConfirm = document.querySelector("#memberPwConfirm"); // 새로운 비밀번호 확인 input

const pwMessage = document.querySelector("#pwMessage"); // 현재 비밀번호 span
const newPwMessage = document.querySelector("#newPwMessage"); // 새로운 비밀번호 span
const checkPwMessage = document.querySelector("#checkPwMessage"); // 새로운 비밀번호 확인 span


const newPw = () => {
    if (memberPw.value.length == 0 || memberPwConfirm.value.length == 0){
        checkPwMessage.innerText = "";
        return;
    }

    if(memberPwConfirm.value === memberNewPw.value) {
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
    
memberNewPw.addEventListener("input", () => {

    newPw(); // 비교하는 함수 수행
});

// 비밀번호, 비밀번호 확인 일치 확인
const checkPw = () => {
    if (memberNewPw.value === memberPwConfirm.value) {
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

// 현재 비밀번호 유효성 검사
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
        pwMessage.innerText = "";
        pwMessage.classList.add("error");
        pwMessage.classList.remove("confirm");
        checkObj.memberPw = false;
        return;
    }

    // 유효한 경우
    pwMessage.innerText = "";
    pwMessage.classList.add("confrim");
    pwMessage.classList.remove("error");
    checkObj.memberPw = true;

    if (memberPwConfirm.value.length > 0) {
        checkPw();
    }
});



// 새로운 비밀번호 유효성 검사
memberNewPw.addEventListener("input", e => {
    const inputPw = e.target.value;

    if (memberNewPw.trim().length === 0) {
        newPwMessage.innerText = "영어, 숫자, 특수문자(!, @, #, -, _) 6~20 글자 사이로 입력해주세요.";
        newPwMessage.classList.remove("confirm", "error");
        checkObj.memberPw = false; // 비밀번호 유효 X
        memberNewPw.value = ""; // 처음에 띄어쓰기 못하게 막기
        return;
    }

    const regExp = /^[a-zA-Z0-9!@#_-]{6,20}$/;

    if (!regExp.test(inputPw)) { // 유효하지 않으면
        newPwMessage.innerText = "";
        newPwMessage.classList.add("error");
        pwMessage.classList.remove("confirm");
        checkObj.memberPw = false;
        return;
    }

    // 유효한 경우
    memberNewPw.innerText = "";
    memberNewPw.classList.add("confrim");
    memberNewPw.classList.remove("error");
    checkObj.memberPw = true;

    if (memberPwConfirm.value.length > 0) {
        newPw();
    }
});






/* 비밀번호 수정 */

// 비밀번호 변경 form 태그
const changePw = document.querySelector("#changePw");

if(changePw != null) {
    // 제출 되었을 때
    changePw.addEventListener("submit", e => {

        const currentPw = document.querySelector("#currentPw");
        const newPw = document.querySelector("#newPw");
        const newPwConfirm = document.querySelector("#newPwConfirm");

        // - 값을 모두 입력했는가

        let str; // undefined 상태
        if( currentPw.value.trim().length == 0 ) str = "현재 비밀번호를 입력해주세요";
        else if( newPw.value.trim().length == 0 ) str = "새 비밀번호를 입력해주세요";
        else if( newPwConfirm.value.trim().length == 0 ) str = "새 비밀번호 확인을 입력해주세요";

        if(str != undefined) { // str에 값이 대입됨 == if 중 하나 실행됨
            alert(str);
            e.preventDefault();
            return;
        }

        // 새 비밀번호 정규식
        const regExp = /^[a-zA-Z0-9!@#_-]{6,20}$/;

        if( !regExp.test(newPw.value) ) {
            alert("새 비밀번호가 유효하지 않습니다");
            e.preventDefault();
            return;
        }

        // 새 비밀번호 == 새 비밀번호 확인
        if( newPw.value != newPwConfirm.value ) {
            alert("새 비밀번호가 일치하지 않습니다");
            e.preventDefault();
            return;
        } 
    });
};



memberPwConfirm.addEventListener("input", () => {
    if(memberPwConfirm.value.length == 0){
        checkPwMessage.innerText = "비밀번호확인을 입력해주세요";
        checkPwMessage.classList.add("error");
        checkPwMessage.classList.remove("confirm");
        checkObj.memberPwConfirm = false;
        return;
    }

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
        
            document.getElementById(key).focus(); // 초점 이동
        
            return;
        }
    }  
});