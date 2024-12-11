// 다음 주소 API
function execDaumPostcode() {
  new daum.Postcode({
      oncomplete: function (data) {
          // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

          // 각 주소의 노출 규칙에 따라 주소를 조합한다.
          // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
          var addr = ''; // 주소 변수

          //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
          if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
              addr = data.roadAddress;
          } else { // 사용자가 지번 주소를 선택했을 경우(J)
              addr = data.jibunAddress;
          }

          // 우편번호와 주소 정보를 해당 필드에 넣는다.
          document.getElementById('postcode').value = data.zonecode;
          document.getElementById("address").value = addr;
          // 커서를 상세주소 필드로 이동한다.0
          document.getElementById("detailAddress").focus();
      }
  }).open();
}

// 주소 검색 버튼 클릭 시
document.querySelector("#searchAddress").addEventListener("click", execDaumPostcode);

// ----------------------------------------------
// **** 개인정보 변경 이메일만 유효성 검사 *****

// 필수 입력 항목의 유효성 검사 여부를 체크하기 위한 객체
// - true  == 해당 항목은 유효한 형식으로 작성됨
// - false == 해당 항목은 유효하지 않은 형식으로 작성됨
const checkObj = {
  "memberEmail": false,
  "authKey": false
};

// ---------------------------------
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

// 이메일 유효성 검사에 사용될 요소 얻어오기
const emailMessage = document.querySelector("#emailMessage");

// ------------------------------------------



/* 이메일 인증 */

// 작성된 이메일 값 얻어오기
const emailId = document.querySelector("#member-email-id");
const emailDomain = document.querySelector("#member-email-domain");
const selectEmail = document.querySelector("#memberEmail");

// select 옵션 변경 시
selectEmail.addEventListener('change', (event) => {
  if (event.target.value !== "") {
      // 옵션에 있는 도메인 선택 시
      emailDomain.value = event.target.value;
      emailDomain.disabled = true;
  } else {
      // 직접 입력 시
      emailDomain.value = "";
      emailDomain.disabled = false;
  }
});


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
      checkObj.memberEmail = false;
      return;
  } else {
      // 중복 X 경우
      emailMessage.innerText = "사용 가능한 이메일입니다.";
      emailMessage.classList.add("confirm");
      emailMessage.classList.remove("error");
      checkObj.memberEmail = true; // 유효한 이메일

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

// 변경되기 전 값 가져오기
const memberEmail = document.querySelector("#member-email-id").value + "@" +document.querySelector("#member-email-domain").value;
const memberTel = document.querySelector("#memberTel1").value + '-' +
                  document.querySelector("#memberTel2").value + '-' +
                  document.querySelector("#memberTel3").value;
const memberHomeTel = document.querySelector("#memberHomeTel1").value + '-' +
                    document.querySelector("#memberHomeTel2").value + '-' +
                    document.querySelector("#memberHomeTel3").value;
const memberAdress = document.querySelector("#postcode").value + '-' +
                    document.querySelector("#address").value + '-' +
                    document.querySelector("#detailAddress").value;

// 필수 입력 칸이 null일 때 회원가입 버튼 안 눌리게 제한
const signUpForm = document.querySelector("#signUpForm");
const formSection = document.querySelector(".formSection");

formSection.addEventListener("submit", e => {
  // 변경된 값 가져오기
  const inputEmail = document.querySelector("#member-email-id").value + "@" +document.querySelector("#member-email-domain").value;
  const inputTel = document.querySelector("#memberTel1").value + '-' +
                  document.querySelector("#memberTel2").value + '-' +
                  document.querySelector("#memberTel3").value;
  const inputHomeTel = document.querySelector("#memberHomeTel1").value + '-' +
                    document.querySelector("#memberHomeTel2").value + '-' +
                    document.querySelector("#memberHomeTel3").value;
  const memberAdress = document.querySelector("#postcode").value + '-' +
                    document.querySelector("#address").value + '-' +
                    document.querySelector("#detailAddress").value;

  let submit = 0;

  console.log(memberTel);
  console.log(inputTel);
  console.log(inputTel == memberTel);
  
  if(memberEmail != inputEmail) {
    if(checkObj.authKey == false && checkObj.memberEmail == false) {
      alert("이메일 인증을 진행해 주시기 바랍니다.");
      e.preventDefault(); // 클릭 이벤트 중단
      return; 
    }
    submit =1;
  }

  if(inputTel != memberTel) submit = 1;
  if(inputHomeTel != memberHomeTel) submit = 1;
  if(memberAdress != memberAdress) submit = 1;
  
  // 변경 점 없을 시 이벤트 막기
  if( submit == 0 ) {
    alert("변경사항이 없습니다");
    e.preventDefault(); // 변경 이벤트 중단
  }
});




