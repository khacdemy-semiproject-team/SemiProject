package com.twogap.project.photo.model.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.twogap.project.boards.model.dto.BoardsImg;
import com.twogap.project.boards.model.dto.Pagination;
import com.twogap.project.common.util.Utility;
import com.twogap.project.note.model.dto.Note;
import com.twogap.project.photo.model.dto.Photo;
import com.twogap.project.photo.model.mapper.PhotoMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@RequiredArgsConstructor
public class PhotoServiceImpl implements PhotoService {

	private final PhotoMapper mapper;
	
	@Value("${my.board.web-path}")
	private String webPath; // /images/board/

	@Value("${my.board.folder-path}")
	private String folderPath; // C:/uploadFiles/board

	
	// 사진첩 메인
	@Override
	public String viewPhoto(int memberNo) {
		return mapper.viewPhoto(memberNo);
	}

	// 글쓰기
	@Override
	public int photoInsert(Photo photo, List<MultipartFile> images) throws Exception {
		
		int result = mapper.photoInsert(photo);
		
		if( result == 0 ) return 0;
		
		int photoNo = photo.getPhotoNo();
		
		List<BoardsImg> uploadList = new ArrayList<>();
		
		if (images != null ) {
			
			for( int i = 0 ; i < images.size(); i++) {
				
				String originalName = images.get(i).getOriginalFilename();
				
				// 변경명
				String rename = Utility.fileRename(originalName);
				
				// 모든 값을 저장할 DTO 생성 (BoardImg - Builder 패턴 사용 )
				BoardsImg img = BoardsImg.builder()
						   		.imgPath(webPath)
							   .imgOriginalName(originalName)
							   .imgRename(rename)
							   .imgOrder(i)
							   .imgBoardNo(photoNo)
							   .boardTypeNo(2)
							   .uploadFile(images.get(i))
							   .build();
				
				// 해당 BoardImg를 uploadList 추가
				uploadList.add(img);
			}
			
			if(uploadList.isEmpty()) {
				return result;
			}
			
	
			result = mapper.photoInsertUploadList(uploadList);
			
	
			if(result == uploadList.size()) {
				// 서버에 파일 저장
				for( BoardsImg img : uploadList) {
					img.getUploadFile().transferTo(new File(folderPath + img.getImgRename()));
				}
					
			} else {
				// 삽입 실패 시 롤백
				throw new RuntimeException();
			}
		}
		
		return result;
	}

	
	// 사진첩 페이지네이션
	@Override
	public Map<String, Object> photoSelectList(int memberNo, int cp) {
		// 게시글 수 가져오기
				int listCount = mapper.getPhotoListCount(memberNo);
				
				// 페이지 네이션 작업 - 메모장은 12개 표시
				Pagination pagination = new Pagination(cp, listCount, 12);
				
				int limit = pagination.getLimit();
				int offset = (cp - 1) * limit;
				RowBounds rowBounds = new RowBounds(offset, limit);
				
				// noteList 가져오기
				List<Note> photoList = mapper.photoSelectList(memberNo, rowBounds);
				
				// 목록 조회 결과
				Map<String, Object> map = new HashMap<>();
				
				map.put("pagination", pagination);
				map.put("photoList", photoList);
				
				return map;
			}
	

	

	
}
