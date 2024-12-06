// 사진 항목을 생성하는 함수
function makePhotoItem(photo) {
  return `
    <div class="photo-item">
      <span class="photo-item-number">No.${photo.photoNo}</span>
      <div class="photo-item-detail"></div>
      <img src="${photo.imgPath}${photo.imgRename}" class="photo-item-content"> 
      <div class="photo-item-title">사진 설명 ${photo.photoTitle}</div> 
    </div>
  `;
}

// 사진 목록을 생성하고 표시하는 함수
function selectPhoto() {
  const logo = document.querySelector(".logo");
  logo.innerHTML = "<span class='photo-title'>사진첩</span>"; // 로고 제목 변경

  const selfBox = document.querySelector(".self-box");
  selfBox.innerHTML = "<div class='photo-list-container'></div>"; // 사진 목록을 담을 컨테이너

  const photoContainer = document.querySelector(".photo-list-container");

  // 반복문을 통해 사진 항목들을 추가
  //let photoItemsHTML = "";
  // for (let i = 1; i <= 12; i++) {
  //   photoItemsHTML += makePhotoItem(i); // 사진 항목을 HTML 문자열로 생성
  // }

  // 비동기 요청
  /* 일반 fetch로 비동기 요청 보내어 처리하는 방법
  fetch("/photo/selectList")
  .then(resp => resp.json()) 
  .then(data => {
    console.log(data);

    const photoList = data.photoList;
    const pagination = data.pagination;

    photoList.forEach((photo) => {
      console.log(photo);
      photoItemsHTML += makePhotoItem(photo);
      console.log(photoItemsHTML);
      photoContainer.innerHTML = photoItemsHTML;
    })
  })
  .catch((err) => console.log(err));
  */

  let currentPage = 1; // 현재 페이지
  let isLoading = false; // 데이터 로딩 중인지 여부
  let hasMoreData = true; // 데이터가 더 있는지 여부

  // async/await 사용법
  const fetchPhotoList = async () => { 
    
    if (isLoading || !hasMoreData) return; // 로딩 중이거나 데이터가 없으면 중단
    isLoading = true;

    try {
      const resp = await fetch(`/photo/selectList?cp=${currentPage}`); // 데이터 요청
      const photoList = await resp.json(); // JSON 변환

      console.log(photoList);



//         삭제 고민을 해봅시다

      if (photoList.length > 0) {
        photoList.forEach((photo) => {
          const photoItem = makePhotoItem(photo); // 개별 사진 항목 생성
          photoContainer.innerHTML += photoItem; // 컨테이너에 HTML 삽입
          
          const photoSelect = document.querySelector(".photo-list-container");
          photoSelect.firstElementChild.addEventListener("click", e => {
            alert("찍혔냐");
          });
          console.log(photoSelect.lastElementChild);
        });
        
//         삭제 고민을 해봅시다

        currentPage++; // 다음 페이지로 이동

      } else {
        hasMoreData = false; // 더 이상 데이터가 없음을 표시
        console.log("더 이상 로드할 데이터가 없습니다.");
      }

    } catch (err) {
      console.error(err); // 에러 처리
    } finally {
      isLoading = false; // 로딩 상태 해제
    }
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = selfBox;

    console.log(scrollTop);
    console.log(scrollHeight);
    console.log(clientHeight);

    // 스크롤이 하단에 도달했는지 확인
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      fetchPhotoList();
    }
  };

  // 초기화
  const init = () => {
    fetchPhotoList(); // 첫 페이지 로드
    selfBox.addEventListener("scroll", handleScroll); // 스크롤 이벤트 등록
  };

  // 함수 호출
  init();

  // 전체 HTML을 한 번에 넣기
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
    const previewDivs = [
      previewDiv0,
      previewDiv1,
      previewDiv2,
      previewDiv3,
      previewDiv4,
    ]; // 미리보기 div들

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
    if (inputPhoto.files.length === 0) {
      alert("사진을 넣어 주세요");
      return;
    }
    const photoTitle = document.querySelector(".photo-write-title").value;
    const formData = new FormData();

    for (const [i, photo] of Array.from(inputPhoto.files).entries()) {
      formData.append("images", photo);
    }

    formData.append(
      "photoTitle",
      new Blob([JSON.stringify(photoTitle)], { type: "application/json" })
    );

    fetch("/photo/write", {
      method: "PUT",
      // headers: {
      //     "Content-Type": "multipart/form-data"
      //   },
      body: formData,
    })
      .then((resp) => resp.text())
      .then((result) => {
        if (result > 0) {
          alert("등록완료");
          selectPhoto();
        } else {
          alert("등록 실패... ㅠㅠ");
        }
      });
  });
});


