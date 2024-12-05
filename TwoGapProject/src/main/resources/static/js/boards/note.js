// test box UI
const testBox = document.querySelector(".test-box");
const noteContainer = document.createElement("div");
noteContainer.classList.add("note-container");
testBox.append(noteContainer);

let noteItemList = null;
let noteItem = null;

/** 강의 예재 메뉴판 js 참조
 * 요소 생성 + 속성 추가 + 클래스 추가
 * @param {*} tag 요소
 * @param {*} attr 속성 - 스타일은 다른거임 잊지 말길 T.T
 * @param {*} cls 클래스
 * @returns 
 * @author 신동국
 */
const newEl = (tag, attr, cls) => {
    
    const el = document.createElement(tag);

    for(let ket in attr) {
        el.setAttribute(ket, attr[ket]);
    }

    for (let className of cls) {
        el.classList.add(className);
    }

    return el;
}

// 팝업된 노트 삭제
const deleteNotePopup = () => {
    document.querySelector("#note-popup").remove();
    document.querySelector(".note-popup-outside").remove();
}



// 메모장 조회 함수
function noteSelect() {

    let title = document.querySelector(".boards-title");

    if( title != null ) {

    } else {
        title = newEl("div", {} , ["boards-title"]);
        const divider = newEl("div", {} , ["divider"]);

        title.innerHTML = "<h1>메모장</h1>";

        noteContainer.append(title);
        noteContainer.append(divider);
    }

    

    fetch("/note/selectList")
    .then(resp => resp.json())
    .then(result => {

        createNoteItemList(result);
    });
};


// 메모장 리스트 만들기
function createNoteItemList(result) {

    noteItemList = document.querySelector(".note-item-list");

    // 이미 메모장을 만들었을 시 지우고 시작
    if (noteItemList != null ) {
        noteItemList.innerHTML = "";
    } else {
        // 메모장 미작성 시 시작
        noteItemList = newEl("div", {} , ["note-item-list"]);
        noteContainer.append(noteItemList)
    }

    // 가져온 값이 없을 경우
    if(result.noteList.length == 0) {
        const div = document.createElement("div");
        div.innerText = "메모글이 존재하지 않습니다 >.<"; 
        div.style.cssText = "width: 100%; height: 100%; display: flex; "
        div.style.cssText += "justify-content : center; align-items : center;";
        noteItemList.append(div);
        return;
    }

    // 글이 있는 경우
    const noteList = result['noteList'];

    // 글 목록을 출력
    for( let note of noteList) {
        createNoteItem(noteItemList, note);
    }
    
    // 페이지 네이션 출력 - base.js에 있습니다

    pagination(result['pagination'], noteList[0].boardTypeNo);


}


// 조회 시 리스트 목록 만들기
function createNoteItem(noteItemList, note) {

    const noteItem = newEl("div", {} , ["note-item"]);
    const hx = newEl("h4", {} , []);
    const content = newEl("div", {} , []);

    hx.innerText = "No." + note['noteNo'];
    const contentText = note.noteContent.replaceAll("<br>", " ");
    content.innerText = `${contentText.length > 10 ? contentText.substr(0, 9) + "...": contentText }`;
    content.style.backgroundColor = note['noteColor'];
    
    noteItem.append(hx);
    noteItem.append(content);
    noteItemList.append(noteItem);

    content.addEventListener("click", e => select(note));
    
}


// 페이지네이션 클릭 시 이벤트
function noteSelectCp(value) {

    fetch("/note/selectList?cp=" + value)
    .then(resp => resp.json())
    .then(result => {
        createNoteItemList(result);
    });
}




////////////////////////////////////////////////////////////////////
// note 글쓰기 창 

document.querySelector(".write").addEventListener("click", () => insertNote());

// 글쓰기 창 이벤트
function insertNote() {

    const note = {
        noteContent : "",
        noteColor : "",
        boardTypeNo : 4
    }

    displaySelect(note);
    modifyNote(note);

    // 삽입에서 일어날 이벤트 목록
    // 이미지 담을 목록
    let test = document.querySelectorAll(".note-preview-list img");
    const file = new File(["dummy"], "dummy.txt", {type: "text/plain",});

    let fileInputFiles = new Array();

    for ( let num of test) {
        fileInputFiles.push(file);
    }

    
    // 파일 입력 시 이벤트
    document.querySelector(".img-input").addEventListener("change", e => {
        fileInputFiles = noteImgPreviewModify(e, fileInputFiles);
        e.target.value = "";
    })

    // 확인 버튼 클릭시 이벤트
    document.querySelector(".confirm-span").addEventListener("click", () => {

        const formData = new FormData();
        const contentTextarea = document.querySelector(".content-textarea");
 
        // 글자 띄어쓰기 내려쓰기제외 비어있을시
        if(contentTextarea.value.trim().length == 0) {
            alert("빈칸으로 제출 하실 수 없습니다");
            contentTextarea.innerText = "";
            contentTextarea.focus();

            return;
        }

        // 글자 2000자 제한
        if(contentTextarea.value.length > 2000)  {
            alert("최대 2000자입니다. ");
            contentTextarea.focus();
            return;
        }

        // 파일 배열 폼데이터에 적재
        if(fileInputFiles != null ) {
            for (const [i, photo] of Array.from(fileInputFiles).entries()) {
                formData.append("images", photo);
            }
        }

        note.noteColor = document.querySelector("#inputColor").value;
        note.noteContent = contentTextarea.value.replaceAll(/(?:\r\n|\r|\n)/g, "<br>");
        formData.append('note', new Blob([JSON.stringify(note)] , {type: "application/json"}));

        fetch("/note/insert", {
            method: "POST",
            // headers: {
            //     "Content-Type": "multipart/form-data"
            //   },
            body: formData
        })
        .then(resp => resp.text())
        .then(result => {
            if(result > 0) {
                alert("게시글이 등록되었습니다.");
                deleteNotePopup();

                fetch("/note/selectList")
                .then(resp => resp.json())
                .then(result => {

                    noteSelectCp(document.querySelector(".current").value);
                });

            } else {
                alert("안된다고 한다 바보둥국");
            }
        });
    })

    document.querySelector(".note-popup-outside").removeEventListener("click", () => deleteNotePopup());
    document.querySelector("#note-select-close").removeEventListener("click", () => deleteNotePopup());

    // 취소 시 이벤트
    document.querySelector(".cancell-span").addEventListener("click", () => {
        if (!confirm("글쓰기를 정말 취소하시겠습니까") ) {
            return;
        }
        deleteNotePopup();
    });
    document.querySelector(".note-popup-outside").addEventListener("click", () => {
        if (!confirm("글쓰기를 정말 취소하시겠습니까") ) {
            return;
        }
        deleteNotePopup();
    });
    document.querySelector("#note-select-close").addEventListener("click", () => {
        if (!confirm("글쓰기를 정말 취소하시겠습니까") ) {
            return;
        }
        deleteNotePopup();
    });
}



////////////////////////////////////////////////////////////////////

// 상세 조회용
function select(note) {

    // 메모장 상세보기 틀
    displaySelect(note);

    fetch("/note/selectImg?noteNo=" + note.noteNo)
    .then(resp => resp.json())
    .then(imgList => {

        for( let img of imgList) {
            let newImageUrl = img.imgPath + img.imgRename;

            const createImg = newEl("img", {alt: "사진 나와야함"}, []);
            createImg.src = newImageUrl;
            
            document.querySelector(".note-preview-list").append(createImg);
        }
    });

    // 클릭 시 메모장 닫는 이벤트
    document.querySelector(".note-popup-outside").addEventListener("click", () => deleteNotePopup());
    document.querySelector("#note-select-close").addEventListener("click", () => deleteNotePopup());

    // 클릭 시 수정 페이지 전환 이벤트
    document.querySelector(".update-span").addEventListener("click", () => noteUpdate(note));

    // 클릭 시 메모장 삭제 이벤트 추가해야함
    document.querySelector(".delete-span").addEventListener("click", () => {noteDelete(note)});
}

// 메모장 상세 조회 태그 구성
const displaySelect = (note) => {

    const notePopup = newEl("div", {id: "note-popup"}, []);
    const notePopupOutside = newEl("div", {}, ["note-popup-outside"]);
    const noteSelectContainer = newEl("div", {}, ["note-select-container"]);

    // 메모장 내용
    const noteSelectBox = newEl("div", {}, ["note-select-box"]);
    const contentDiv = document.createElement("div");  // 클래스 없음 헷갈리지 않기
    const noteSelectContent = newEl("div", {}, ["note-select-content"]);
    const noteSelectClose = newEl("span", {id:"note-select-close"}, []);

    const noteSelectItem = newEl("div", {}, ["note-select-item"]);
    const noteColor = newEl("div", {}, ["note-color"]);
    const noteUpdaetDelete = newEl("div", {}, ["note-update-delete"]);
    const updateSpan = newEl("span", {cursor: "pointer"},["update-span"]);
    const spaceP = newEl("p", {}, []);
    const deleteSpan = newEl("span", {cursor: "pointer"},["delete-span"]);


    // 메모장 이미지
    const notePreview = newEl("div", {}, ["note-preview"]);
    const previewDiv = newEl("div", {}, ["previewDiv"]);
    const notePreviewlist = newEl("div", {}, ["note-preview-list"]);

    // 메모장 내용 출력
    const contentText = note.noteContent.replaceAll("\r\n", "<br/>");
    noteSelectContent.innerHTML = `<span>${contentText}</span>`;

    noteSelectClose.innerHTML = "&times;";
    noteSelectBox.style.backgroundColor = note['noteColor'];
    updateSpan.innerText = "수정";
    spaceP.innerText = "|";
    deleteSpan.innerText = "삭제";


    previewDiv.innerText = "사진출력";
    // 사진은 비동기 요청 해야함 잊지말기
    // fetch("")

    // body에 추가
    document.body.append(notePopup);
    document.body.append(notePopupOutside);

    // 메모장 팝업 ui apeend
    notePopup.append(noteSelectContainer);
    noteSelectContainer.append(noteSelectBox);
    noteSelectBox.append(contentDiv);
    contentDiv.append(noteSelectContent);
    contentDiv.append(noteSelectClose);
    
    noteSelectBox.append(noteSelectItem);
    noteSelectItem.append(noteColor);
    noteSelectItem.append(noteUpdaetDelete);

    noteUpdaetDelete.append(updateSpan);
    noteUpdaetDelete.append(spaceP);
    noteUpdaetDelete.append(deleteSpan);
    
    // 메모장 이미지 UI appencd
    noteSelectContainer.append(notePreview);
    notePreview.append(previewDiv);
    notePreview.append(notePreviewlist);
}



// 메모장 수정 창으로 변경 이벤트
const noteUpdate = note => {

    
    modifyNote(note);

    // 수정에서 일어날 이벤트 목록
    // 이미지 담을 목록 - 따른 함수에 넣을 방법 안 떠오름
    let test = document.querySelectorAll(".note-preview-list img");
    const file = new File(["dummy"], "dummy.txt", {type: "text/plain",});

    let fileInputFiles = new Array();

    for( let i = 0; i < document.querySelectorAll(".note-preview-list img").length ; i++ ) {
        fileInputFiles.push(file);
        document.querySelectorAll(".note-preview-list img")[i].onclick =  e => {
            fileInputFiles = removeImg(i, fileInputFiles, e);
        }
    }

    // 파일 입력 시 이벤트
    document.querySelector(".img-input").addEventListener("change", e => {
        fileInputFiles = noteImgPreviewModify(e, fileInputFiles);
        e.target.value = "";
    })

    document.querySelector("#inputColor").addEventListener("change", () => {
        note.noteColor = document.querySelector("#inputColor").value;
    });

    // 확인 버튼 클릭시 이벤트
    document.querySelector(".confirm-span").addEventListener("click", () => {

        // 글자 띄어쓰기 내려쓰기제외 비어있을시
        if(contentTextarea.value.trim().length == 0) {
            alert("빈칸으로 제출 하실 수 없습니다");
            contentTextarea.innerText = "";
            contentTextarea.focus();

            return;
        }
        
        fileInputFiles = fileInputFiles.filter((element, asdf) => element !== undefined );
        const formData = new FormData();

        if(fileInputFiles != null ) {
            for (const [i, photo] of Array.from(fileInputFiles).entries()) {
                formData.append("images", photo);
            }
        }
        
        note.noteContent = contentTextarea.value.replaceAll(/(?:\r\n|\r|\n)/g, "<br>");

        formData.append('note', new Blob([JSON.stringify(note)] , {type: "application/json"}));

        fetch("/note/update", {
            method: "PUT",
            // headers: {
            //     "Content-Type": "multipart/form-data"
            //   },
            body: formData
        })
        .then(resp => resp.text())
        .then(result => {

            if( result > 0) {
                alert("음해");
                deleteNotePopup();
                
                noteSelectCp(document.querySelector(".current").value);

                select(note);

                
            } else {
                alert("안 굴러가!");
            }
        });
    })

    // 취소 시 이벤트
    document.querySelector(".cancell-span").addEventListener("click", () => {
        deleteNotePopup();
        select(note);
    });


}

// 수정창 글쓰기창 전환
const modifyNote = note => {

    // 메모장 내용 textarea 변경
    const noteSelectContent = document.querySelector(".note-select-content");
    noteSelectContent.innerHTML = ""
    contentTextarea = newEl("textarea", {maxlength: "1500"}, ['content-textarea']);

    const text = note.noteContent.replaceAll("<br>", "\r\n");
    contentTextarea.value = text;

    noteSelectContent.append(contentTextarea);

    // 메모장 색변경 버튼 추가
    let noteColorInput = document.querySelector(".note-color");
    noteColorInput.remove();
    const noteColorLable = newEl("label", {for: "inputColor"}, ["note-color", "note-color-back"]);
    const noteColorDiv = newEl("div", {}, []);
    noteColorInput = newEl("input", {type: "color", id: 'inputColor', value:"#FFFFFF"}, []);

    noteColorLable.innerHTML = "메모장 색변경<i class='fa-solid fa-pen'></i>";

    noteColorDiv.append(noteColorLable);
    noteColorDiv.append(noteColorInput);
    document.querySelector(".note-select-item").prepend(noteColorDiv);

    // 수정 | 삭제  -> 확인 | 취소로 변경
    const noteUpdaetDelete = document.querySelector(".note-update-delete");
    noteUpdaetDelete.innerHTML = "";
    
    const confirmSpan = newEl("span", {cursor: "pointer"},["confirm-span"]);
    const spaceP = newEl("p", {}, []);
    const cancellSpan = newEl("span", {cursor: "pointer"},["cancell-span"]);

    confirmSpan.innerText = "확인";
    spaceP.innerText = "|";
    cancellSpan.innerText = "취소";
    
    noteUpdaetDelete.append(confirmSpan);
    noteUpdaetDelete.append(spaceP);
    noteUpdaetDelete.append(cancellSpan);

    // 사진 선택 버튼 추가
    const previewDiv = document.querySelector(".previewDiv");
    const noteImgInput = newEl("input", {
        type: "file", id: "file-input", accept: "image/*", multiple: "true", style: "display:none"}, []);
    const noteImgInputLable = newEl("label", {for: "file-input"}, ["img-input"]);

    noteImgInputLable.innerText ="사진 선택";

    noteImgInputLable.append(noteImgInput);
    previewDiv.append(noteImgInputLable);


    // 메모장 색 변경
    noteColorInput.addEventListener("input", e => {
        document.querySelector(".note-select-box").style.backgroundColor = e.target.value;
    });
}

// 메모장 이미지 리스트 관리
function noteImgPreviewModify(e, fileInputFiles) {

    const imgs = Array.from(e.target.files);

    fileInputFiles = fileInputFiles.filter((element, asdf) => element !== undefined );
    const fileLength = (fileInputFiles == null) ? Number('0') : fileInputFiles.length;

    // return 비울 시 배열도 비워짐 잊지 말기
    if((imgs.length + fileLength) > 5 ) {
        alert("많아!");     
        e.preventDefault();
        return fileInputFiles;
    }

    if( fileLength > 0 ) {
        fileInputFiles = [
            ...fileInputFiles,
            ...imgs
          ]
    } else {
        fileInputFiles = imgs;
    }

    displayImg(imgs);

    for( let i = 0; i < document.querySelectorAll(".note-preview-list img").length ; i++ ) {
        document.querySelectorAll(".note-preview-list img")[i].onclick =  event => {
            fileInputFiles = removeImg(i, fileInputFiles, event);
        }
    }

    return fileInputFiles;
}


// 이미지 프리뷰 창에서 보이게하기
function displayImg(imgs) {

    for( let img of imgs) {
        let newImageUrl = URL.createObjectURL(img);

        const createImg = newEl("img", {}, []);
        createImg.src = newImageUrl;

        document.querySelector(".note-preview-list").append(createImg);
        
    }
}



// 이미지 제거 및 파일리스트에서 제거
function removeImg(i, fileInputFiles, e) {
    delete fileInputFiles[i];
    e.target.remove();
    
    return fileInputFiles;
}

function noteDelete(note) {

    if( !confirm("정말 삭제하시겠습니까")) {
        return;
    }

    fetch("/note/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note)
    }).then(resp => resp.text())
    .then(result => {

        if( result > 0 ) {
            deleteNotePopup();
            noteSelect();
            alert("삭제 성공");
        } else {
            alert("삭제 실패");
        }
    }) 
}

// 메모장 조회 - 시작할때 같이 동작되야함
noteSelect();