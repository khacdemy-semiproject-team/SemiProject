// 사진 항목을 생성하는 함수
function makePhotoItem(i) {
  return `
    <div class="photo-item">
      <span class="photo-item-number">No.${i}</span>
      <div class="photo-item-detail"></div>
      <img src="" class="photo-item-content"> 
      <div class="photo-item-title">사진 설명 ${i}</div> 
    </div>
  `;
}

// 사진 목록을 생성하고 표시하는 함수
function selectPhoto() {
  const logo = document.querySelector(".logo");
  logo.innerHTML = "<span class='photo-title'>사진첩</span>"; // 로고 제목 변경

  const selfBox = document.querySelector(".self-box");
  selfBox.innerHTML = "<div class='photo-list-container'></div>"; // 사진 목록을 담을 컨테이너

  const photoList = document.querySelector(".photo-list-container");

  // 반복문을 통해 사진 항목들을 추가
  let photoItemsHTML = "";
  for (let i = 1; i <= 12; i++) {
    photoItemsHTML += makePhotoItem(i); // 사진 항목을 HTML 문자열로 생성
  }

  // 전체 HTML을 한 번에 넣기
  photoList.innerHTML = photoItemsHTML;
}

// 사진 목록을 생성하고 화면에 표시
selectPhoto();



// 글쓰기 버튼
let write = document.querySelector(".write");

// 글쓰기 버튼 클릭 시 이벤트 처리
write.addEventListener("click", () => {
  const photoItem = document.querySelectorAll(".photo-item"); // 기존의 사진 항목들 선택
  let logo = document.querySelector(".logo");

  // 기존 사진 항목들 제거
  photoItem.forEach((photoItem) => {
    photoItem.remove();
  });

  const selfBox = document.querySelector(".self-box");

  // 새로 고칠 화면 구성
  selfBox.style.height = "550px"; // selfBox의 높이를 설정
  selfBox.innerHTML = `
    <input class="photo-write-title" placeholder="제목을 입력해 주세요~"></input>
    <div class="photo-write-content"></div>
    <div class="photo-write-upload"></div>
  `;

  // 버튼들 생성
  let deleteBtn = document.createElement("span");
  let checkBtn = document.createElement("button");
  let cancelBtn = document.createElement("button");
  let previewDivthumnail = document.createElement("div");
  previewDivthumnail.classList.add("thumnail");

  // label 요소 생성
  let label = document.createElement("label");
  label.setAttribute("for", "photo-upload-input"); // 'for' 속성으로 input과 연결
  label.innerHTML = "사진등록"; // label 텍스트 추가

  // 파일 업로드 input 요소 생성
  let inputPhoto = document.createElement("input");
  inputPhoto.type = "file";
  inputPhoto.accept = "image/*"; // 이미지 파일만 선택 가능
  inputPhoto.id = "photo-upload-input";
  inputPhoto.multiple = true; // 여러 파일 선택 가능
  label.appendChild(inputPhoto); // label 안에 input 추가
  label.classList.add("btnLabel"); // 버튼 스타일 추가

  // 버튼 텍스트 설정
  checkBtn.textContent = "등록";
  cancelBtn.textContent = "목록으로";

  // 버튼들 selfBox에 추가
  selfBox.append(checkBtn);
  selfBox.append(cancelBtn);
  checkBtn.classList.add("checkBtn");
  cancelBtn.classList.add("cancelBtn");

  // 로고의 'no-after' 클래스 추가
  logo.classList.add("no-after");

  // 사진 등록 영역에 콘텐츠 및 버튼들 추가
  const photoWriteContent = document.querySelector(".photo-write-content");
  photoWriteContent.append(previewDivthumnail);
  photoWriteContent.append(deleteBtn);

  // 업로드 영역에 label 추가
  inputPhoto.classList.add("select-photo");
  const photoWriteUpload = document.querySelector(".photo-write-upload");
  photoWriteUpload.append(label);

  // 미리보기 div들 생성 (최대 4개)
  for (let i = 0; i < 4; i++) {
    let previewDiv = document.createElement("div");
    photoWriteUpload.append(previewDiv);
    previewDiv.classList.add("previewDiv" + [i]);
  }

  // 미리보기 div들 선택
  const previewDiv0 = document.querySelector(".thumnail");
  const previewDiv1 = document.querySelector(".previewDiv0");
  const previewDiv2 = document.querySelector(".previewDiv1");
  const previewDiv3 = document.querySelector(".previewDiv2");
  const previewDiv4 = document.querySelector(".previewDiv3");
  
  // 파일 선택 input 요소
  const photoInput = document.querySelector(".select-photo");
  
   // 파일 선택 시 미리보기 추가
   photoInput.addEventListener("change", (e) => {
    const files = e.target.files; // 선택된 파일들
    const previewDivs = [previewDiv0, previewDiv1, previewDiv2, previewDiv3, previewDiv4]; // 미리보기 div들
  
    // 선택된 파일에 대해 미리보기 추가
    for (let i = 0; i < files.length; i++) {
      if (i >= previewDivs.length) break; // 최대 4개의 파일만 미리보기
      const file = files[i];
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result; // 파일을 데이터 URL로 읽어서 이미지 src에 설정
        img.classList.add("preview-image"); // 스타일 추가
        previewDivs[i].innerHTML = ""; // 기존 미리보기 내용 제거
        previewDivs[i].appendChild(img); // 해당 div에 이미지 추가
      };
  
      reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
    }
  });
  
  cancelBtn.addEventListener("click", () => {
  selectPhoto();
  });

  checkBtn.addEventListener("click", () => {
      console.log(inputPhoto.files);
      if(inputPhoto.files.length === 0) {
        alert("사진을 넣어 주세요");
        return;
      } 
      const photoTitle = document.querySelector(".photo-write-title").value;
      const formData = new FormData();
  
      for (const [i, photo] of Array.from(inputPhoto.files).entries()) {
          formData.append("images", photo);
      }

      formData.append('photoTitle', new Blob([JSON.stringify(photoTitle)] , {type: "application/json"}));

      fetch("/photo/write", {
          method: "PUT",
          // headers: {
          //     "Content-Type": "multipart/form-data"
          //   },
          body: formData
      })
      .then(resp => resp.text())
      .then(result => {

        if( result > 0) {
          alert("등록완료");
          selectPhoto();          
      } else {
          alert("등록 실패... ㅠㅠ");
      }

      })
  }) 
  
  
});


