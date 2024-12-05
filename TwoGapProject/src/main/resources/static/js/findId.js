const checkObj = {
  "memberEmail": false,
  "authKey": false
};


// 인증번호 받기 버튼
const sendAuthKeyBtn = document.querySelector("#sendAuthKeyBtn");

// 인증번호 입력 input
const authKey = document.querySelector("#authKey");

// 인증번호 입력 후 확인 버튼
const checkAuthKeyBtn = document.querySelector("#checkAuthKeyBtn");

// 인증번호 관련 메시지 출력 span
const authKeyMessage = document.querySelector("#authKeyMessage");

let authTimer; // 타이머 역할을 할 setInterval을 저장할 변수

const initMin = 4; // 타이머 초기값 (분)
const initSec = 59; // 타이머 초기값 (초)
const initTime = "05:00";

// 실제 줄어드는 시간을 저장할 변수
let min = initMin;
let sec = initSec;

//---------------------------------------------------

/* 이메일 유효성 검사 */

// 1) 이메일 유효성 검사에 사용될 요소 얻어오기
const emailMessage = document.querySelector("#emailMessage");

// ------------------------------------------
/* 이메일 인증 */

// 작성된 이메일 값 얻어오기
const emailId = document.querySelector("#member-email-id");
const emailDomain = document.querySelector("#member-email-domain");

let inputEmail = null;

// 인증번호 받기 버튼 클릭 시 
sendAuthKeyBtn.addEventListener("click", async e => {

    // 이메일 인증 후 이메일이 변경된 경우
    checkObj.authKey = false;
    document.querySelector("#authKeyMessage").innerText = "";
    clearInterval(authTimer);

    inputEmail = emailId.value + '@' + emailDomain.value;


    // 3) 입력된 이메일이 없을 경우
    if (inputEmail.replace('@', '').trim().length === 0) {
        emailMessage.innerText = "메일을 받을 수 있는 이메일을 입력해주세요.";

        // 메시지에 색상을 추가하는 클래스 모두 제거
        emailMessage.classList.remove('confirm', 'error');

        // 이메일 유효성 검사 여부를 false 변경
        checkObj.memberEmail = false;

        // 잘못 입력한 띄어쓰기가 있을 경우 없앰
        emailId.value = "";
        emailDomain.value = "";

        return;
    }

    // 4) 입력된 이메일이 있을 경우 정규식 검사
    //    (알맞은 형태로 작성했는지 검사)

    const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // 영어, 숫자, 특수문자(. _ % + -)를 허용
    // 이메일 형식으로 작성
    // 도메인 부분은 최소 2개의 문자로 끝나야함 (.com, .net, .org, .kr 등)     

    // 입력 받은 이메일이 정규식과 일치하지 않는 경우
    // (알맞은 이메일 형태가 아닌 경우)
    if (!regExp.test(inputEmail)) {
        emailMessage.innerText = "알맞은 이메일 형식으로 작성해주세요.";
        emailMessage.classList.add('error'); // 글자를 빨간색으로 변경
        emailMessage.classList.remove('confirm'); // 초록색 제거
        checkObj.memberEmail = false; // 유효하지 않은 이메일임을 기록

        return;
    }

    // 5) 유효한 이메일 형식인 경우 중복 검사 수행
    // 비동기(ajax)
    const resp = await fetch("/member/checkEmail?memberEmail=" + inputEmail);
    const count = await resp.text();

    if (count > 0) {
        emailMessage.innerText = "이미 사용 중인 이메일입니다.";
        emailMessage.classList.add("error");
        emailMessage.classList.remove("confirm");
        checkObj.memberEmail = true;
        
    } else { 
        // 중복 X 경우
        emailMessage.innerText = "사용 가능한 이메일입니다.";
        emailMessage.classList.add("confirm");
        emailMessage.classList.remove("error");
        checkObj.memberEmail = false; 
        return; 

    } 

    // 새로운 인증번호 발급을 원하는것이기 때문에 
    // 새로 발급받은 인증번호 확인전까진 checkObj.authKey는 false
    checkObj.authKey = false;
    // 인증번호 발급 관련 메세지 비우기
    authKeyMessage.innerText = "";

    // 클릭 시 타이머 숫자 초기화
    min = initMin;
    sec = initSec;

    // 이전 동작중인 인터벌 클리어(없애기)
    clearInterval(authTimer);
    console.log(inputEmail);
    // *************************************
    // 비동기로 서버에서 메일보내기 
    fetch("/email/signup", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: inputEmail
    })
        .then(resp => resp.text())
        .then(result => {
            if (result == 1) {
                console.log("인증 번호 발송 성공");
            } else {
                console.log("인증 번호 발송 실패!");
            }
        })



    // *************************************

    // 메일은 비동기로 서버에서 보내라고 하고
    // 화면에서는 타이머 시작하기

    authKeyMessage.innerText = initTime; // 05:00 세팅
    authKeyMessage.classList.remove("confirm", "error"); // 검정 글씨

    alert("인증번호가 발송되었습니다.");

    // setInterval(함수, 지연시간(ms))
    // - 지연시간(ms)만큼 시간이 지날 때 마다 함수 수행

    // clearInterval(Interval이 저장된 변수)
    // - 매개변수로 전달받은 interval을 멈춤

    // 인증 시간 출력(1초 마다 동작)
    authTimer = setInterval(() => {

        authKeyMessage.innerText = `${addZero(min)}:${addZero(sec)}`;

        // 0분 0초인 경우 ("00:00" 출력 후)
        if (min == 0 && sec == 0) {
            checkObj.authKey = false; // 인증 못함
            clearInterval(authTimer); // interval 멈춤
            authKeyMessage.classList.add('error');
            authKeyMessage.classList.remove('confirm');
            return;
        }

        // 0초인 경우(0초를 출력한 후)
        if (sec == 0) {
            sec = 60;
            min--;
        }

        sec--; // 1초 감소

    }, 1000); // 1초 지연시간

});


// 전달 받은 숫자가 10 미만인 경우(한자리) 앞에 0 붙여서 반환
function addZero(number) {
    if (number < 10) return "0" + number;
    else return number;
}


// -------------------------------------------------------------

// 인증하기 버튼 클릭 시
// 입력된 인증번호를 비동기로 서버에 전달
// -> 입력된 인증번호와 발급된 인증번호가 같은지 비교
//   같으면 1, 아니면 0반환
// 단, 타이머가 00:00초가 아닐 경우에만 수행

checkAuthKeyBtn.addEventListener("click", () => {

    if (min === 0 && sec === 0) { // 타이머가 00:00인 경우
        alert("인증번호 입력 제한시간을 초과하였습니다.");
        return;
    }

    if (authKey.value.length < 6) { // 인증번호가 제대로 입력 안된 경우(길이가 6미만인 경우)
        alert("인증번호를 정확히 입력해 주세요.");
        return;
    }

    // 문제 없는 경우(제한시간, 인증번호 길이 유효 시)
    // 입력받은 이메일, 인증번호로 객체 생성
    const obj = {
        "email": inputEmail,
        "authKey": authKey.value
    };
    console.log(obj);
    // 인증번호 확인용 비동기 요청 보냄
    fetch("/email/checkAuthKey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj) // obj JS 객체를 JSON으로 변경
    })
    .then(resp => resp.text())
    .then(result => {
        // 1 or 0

        if (result == 0) { // 인증번호 일치 안 할 때
            alert("인증번호가 일치하지 않습니다.");
            checkObj.authKey = false;
            return;
        }

        // 인증번호 일치할 때
        clearInterval(authTimer); // 타이머 멈춤

        authKeyMessage.innerText = "인증되었습니다.";
        authKeyMessage.classList.remove("error");
        authKeyMessage.classList.add("confirm");

        checkObj.authKey = true; // 인증번호 검사 여부 true 변경

    });

});