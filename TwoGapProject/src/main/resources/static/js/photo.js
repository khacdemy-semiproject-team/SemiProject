// 사진 항목을 생성하는 함수
function makePhotoItem(photo) {
  // 객체를 안전하게 JSON 문자열로 변환하여 전달
  const photoString = JSON.stringify(photo);

  return `
    <div class="photo-item" onClick='detailPhoto(${photoString})'>
      <span class="photo-item-number">No.${photo.imgNo}</span>
      <div class="photo-item-detail"></div>
      <img src="${photo.imgPath}${photo.imgRename}" class="photo-item-content"> 
      <div class="photo-item-title">제목 :  ${photo.photoTitle}</div> 
    </div>
  `;
}

// 클릭한 사진 상세보기 함수
function detailPhoto(photoString) {
  const photo = photoString; // JSON 문자열을 그대로 사용 (문제 없음)

  // 기존 모달 창 제거
  const existingModal = document.getElementById("photo-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // 모달 창 HTML 생성
  const modalHTML = `
    <div id="photo-modal" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" onClick="closeModal()">&times;</button>
        <h2>${photo.photoTitle}</h2>
        <p>등록일 : ${photo.photoDate}</p>
        <div class="modal-photo">
          <img src="${photo.imgPath}${photo.imgRename}" alt="Photo No.${
    photo.photoNo
  }" id="photo-detail-img">
        </div>
        <button class="test" onClick='openEditModal(${JSON.stringify(photo)})'>수정</button>
        <button onClick="deletePhoto(${photo.photoNo}, ${photo.imgNo})">삭제</button>
      </div>
    </div>
  `;

  // 모달 창 삽입
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// 모달 창 닫기 함수
function closeModal() {
  const modal = document.getElementById("photo-modal");
  if (modal) {
    modal.remove();
  }
}

// 수정 모달 열기
function openEditModal(photoString) {
  closeModal();
  const photo = photoString;

  // 기존 수정 모달 제거
  const existingEditModal = document.getElementById("edit-modal");
  if (existingEditModal) {
    existingEditModal.remove();
  }
  // 수정 모달 HTML 생성
  const editModalHTML = `
    <div id="edit-modal" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" onClick="closeEditModal()">&times;</button>
        <h2>사진 수정</h2>
        <p>등록일: ${photo.photoDate}</p>
        
        <!-- 제목 수정 입력란 -->
        <div class="title-box">
          <label for="edit-title">제목</label>
          <input type="text" id="edit-photo-title" value='${photo.photoTitle}' placeholder="제목을 수정하세요" />
        </div>

        <!-- 이미지 업로드 버튼 -->
        <label for="edit-image-upload" class="btn-label">새 이미지 등록</label>
        <input type="file" id="edit-image-upload" accept="image/*" style="display:none;" />

        <div id="edit-image-preview" class="edit-image-preview">
          <img src="${photo.imgPath}${photo.imgRename}" alt="이미지 미리보기" id="preview-img">
        </div>
        <button id="save-btn" onClick='saveEditPhoto(${photo.imgNo},${photo.photoNo},${photo.photoTitle})'>저장</button>
        <button id="cancel-btn" onClick="closeEditModal()">취소</button>
      </div>
    </div>
  `;

  // 수정 모달 창 삽입
  document.body.insertAdjacentHTML("beforeend", editModalHTML);

  // 이미지 업로드 필드 이벤트 리스너 추가
  const imageUpload = document.getElementById("edit-image-upload");
  const previewImg = document.getElementById("preview-img");

  imageUpload.addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.onload = function (e) {
        previewImg.src = e.target.result; // 새로 선택한 이미지 미리보기
      };
      reader.readAsDataURL(file);
    }
  });
}

// 수정 모달 닫기 함수
function closeEditModal() {
  const editModal = document.getElementById("edit-modal");
  if (editModal) {
    editModal.remove();
  }
}

// 수정 사항 저장
function saveEditPhoto(photoString, imgNo, photoTitle) {
  

  const photo = JSON.parse(photoString);
  const title = photoTitle;
  const newTitle = document.getElementById("edit-photo-title").value;
  const newImage = document.getElementById("edit-image-upload").files[0];

  // 제목 수정 반영
  if(newTitle.trim().length == 0){
    alert("빈 제목은 입력할 수 없습니다")
    return;
  }

  if (newTitle != title) {
    photo.photoTitle = newTitle;
    const obj = {
      photoNo : imgNo,
      photoTitle : newTitle
    }

    fetch("/photo/photoTitleUpdate", {
      method: "PUT",
      headers: {
                "Content-Type": "application/json"
              },
      body : JSON.stringify(obj),
    })
    .then((resp) => resp.text())
    .then ((result) => {
      if (result > 0) {
        closeEditModal();
        selectPhoto();
      } else {
        alert("수정 실패");
      };
    });

  }

  if (newImage) {
    const reader = new FileReader();
    reader.onload = function (e) {

      // 여기서 실제 이미지 업로드 로직을 추가할 수 있음
      
      const formData = new FormData();
      formData.append("images", newImage);

      const obj = {
        photoNo : imgNo,
        photoTitle : newTitle,
        photoImage : newImage,
        imgNo : photoString
      }

      formData.append('photo', new Blob([JSON.stringify(obj)] , {type: "application/json"}));
      
      fetch("/photo/update", {
        method: "PUT",
        body: formData,
      })
        .then((resp) => resp.text())
        .then((result) => {
          if (result > 0) {

            closeEditModal();
            selectPhoto();
          } else {
            alert("수정 실패");
          }
        });

        
      // 모달 업데이트
      const modal = document.getElementById("photo-modal");
      if (modal) {
        modal.querySelector("h2").innerText = photo.photoTitle;
        modal.querySelector(".modal-photo img").src = e.target.result;
      }
    };
    
    reader.readAsDataURL(newImage); // 이미지 미리보기
  }

  alert("수정 성공");
  // 수정 모달 닫기
  closeEditModal();
}

// 삭제 버튼 클릭 시 이미지 삭제 기능
function deletePhoto(photoNo, imgNo) {
  if (!confirm("정말 삭제하시겠습니까")) return;

  const obj = { photoNo: photoNo, imgNo: imgNo };

  fetch("/photo/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result > 0) {
        closeModal();
        selectPhoto();
        alert("삭제 성공");
      } else {
        alert("삭제 실패");
      }
    });

  // 모달 창 닫기
  closeModal();
}

// 사진 목록을 생성하고 표시하는 함수
function selectPhoto() {
  const logo = document.querySelector(".logo");
  logo.innerHTML = "<span class='photo-title'>사진첩</span>"; // 로고 제목 변경

  const selfBox = document.querySelector(".self-box");
  selfBox.innerHTML = "<div class='photo-list-container'></div>"; // 사진 목록을 담을 컨테이너

  const photoContainer = document.querySelector(".photo-list-container");

  let currentPage = 1; // 현재 페이지
  let isLoading = false; // 데이터 로딩 중인지 여부
  let hasMoreData = true; // 데이터가 더 있는지 여부

  // 비동기 함수로 사진 목록을 불러오는 함수
  const fetchPhotoList = async () => {
    if (isLoading || !hasMoreData) return;
    isLoading = true;

    try {
      const resp = await fetch(`/photo/selectList?cp=${currentPage}`);
      const photoList = await resp.json();

      if (photoList.length > 0) {
        photoList.forEach((photo) => {
          const photoItem = makePhotoItem(photo);
          photoContainer.innerHTML += photoItem;
        });
        currentPage++;
      } else {
        hasMoreData = false;
        console.log("더 이상 로드할 데이터가 없습니다.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      isLoading = false;
    }
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = selfBox;
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
}

// 사진 목록을 생성하고 화면에 표시
selectPhoto();

// 글쓰기 버튼
let write = document.querySelector(".write");

// 글쓰기 버튼 클릭 시 이벤트 처리
write.addEventListener("click", () => {
  const photoItem = document.querySelectorAll(".photo-item");
  let logo = document.querySelector(".logo");

  // 기존 사진 항목들 제거
  photoItem.forEach((photoItem) => photoItem.remove());

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
  label.setAttribute("for", "photo-upload-input");
  label.innerHTML = "사진등록";

  // 파일 업로드 input 요소 생성
  let inputPhoto = document.createElement("input");
  inputPhoto.type = "file";
  inputPhoto.accept = "image/*"; // 이미지 파일만 선택 가능
  inputPhoto.id = "photo-upload-input";
  inputPhoto.multiple = true;
  label.appendChild(inputPhoto);
  label.classList.add("btnLabel");

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
    if (inputPhoto.files.length > 5) {
      alert("최대 5장까지 업로드 가능합니다.");
      return;
    }

    const files = e.target.files;
    const previewDivs = [
      previewDiv0,
      previewDiv1,
      previewDiv2,
      previewDiv3,
      previewDiv4,
    ];

    for (let i = 0; i < files.length; i++) {
      if (i >= previewDivs.length) break;
      const file = files[i];
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.classList.add("preview-image");
        previewDivs[i].innerHTML = "";
        previewDivs[i].appendChild(img);
      };

      reader.readAsDataURL(file);
    }
  });

  cancelBtn.addEventListener("click", () => {
    selectPhoto();
  });

  checkBtn.addEventListener("click", () => {
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
