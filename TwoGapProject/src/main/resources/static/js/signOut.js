// 탈퇴 form 태그
const formSection = document.querySelector(".formSection");

if(formSection != null) {
    formSection.addEventListener("submit", e => {

        // 체크박스 체크 안 할 시 버튼 안 눌리게 제한
        const agreement = document.querySelector("#agreement");
        const check = document.querySelector("#check");

        if (!agreement.checked) {
            alert("동의 체크 후 눌러주시기 바랍니다.");
            e.preventDefault(); // 클릭 이벤트 중단
            return;
        }
    
        // 동의 체크되어 있을 경우 제출
        if(!confirm("정말 탈퇴하시겠습니까?")) {
            alert("취소 되었습니다.");
            e.preventDefault();
            return;
        }

    });
}
