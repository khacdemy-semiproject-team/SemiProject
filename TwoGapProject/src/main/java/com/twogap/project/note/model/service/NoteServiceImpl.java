package com.twogap.project.note.model.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.twogap.project.boards.model.dto.BoardsImg;
import com.twogap.project.boards.model.dto.Pagination;
import com.twogap.project.common.util.Utility;
import com.twogap.project.note.model.dto.Note;
import com.twogap.project.note.model.mapper.NoteMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(rollbackFor=Exception.class) 
public class NoteServiceImpl implements NoteService{
	
	private final NoteMapper mapper;
	
	@Value("${my.memo.web-path}")
	private String webPath; // /images/board/

	@Value("${my.memo.folder-path}")
	private String folderPath; // C:/uploadFiles/board
	
	// Note 게시글 목록 가져오기
	@Override
	public Map<String, Object> noteSelectList(int memberNo, int cp) {
		
		// 게시글 수 가져오기
		int listCount = mapper.getNoteListCount(memberNo);
		
		// 페이지 네이션 작업 - 메모장은 12개 표시
		Pagination pagination = new Pagination(cp, listCount, 12);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		// noteList 가져오기
		List<Note> noteList = mapper.noteSelectList(memberNo, rowBounds);
		
		// 목록 조회 결과
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("noteList", noteList);
		
		return map;
	}
	
	// 게시글 이미지 가져오기
	@Override
	public List<BoardsImg> noteSelectImg(int noteNo) {
		return mapper.noteSelectImg(noteNo);
	}
	
	// Note 게시글 삽입
	@Override
	public int noteInsert(Note note, List<MultipartFile> images) throws Exception{
		
		int result = mapper.noteInsert(note);
		
		if( result == 0 ) return 0;
		
		int noteNo = note.getNoteNo();
		
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
							   .imgBoardNo(noteNo)
							   .boardTypeNo(note.getBoardTypeNo())
							   .uploadFile(images.get(i))
							   .build();
				
				// 해당 BoardImg를 uploadList 추가
				uploadList.add(img);
			}
			
			if(uploadList.isEmpty()) {
				return result;
			}
			
	
			result = mapper.insertUploadList(uploadList);
			
	
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
	
	
	// Note 게시글 수정 
	@Override
	public int noteUpdate(List<MultipartFile> images, Note note) throws Exception{
		
		int result = mapper.noteUpdate(note);
		int count = mapper.getNoteImg(note);
		
		if( result == 0 ) return 0;
		
		int noteNo = note.getNoteNo();
		
		log.debug("images : " + images);
		
		
		List<BoardsImg> uploadList = new ArrayList<>();

		if (images != null ) {
			
			if( images.size() < count) {
				
				for( int i = images.size() ; i < count ; i++) {
					BoardsImg img = BoardsImg.builder()
									.imgBoardNo(noteNo)
									.boardTypeNo(note.getBoardTypeNo())
									.imgOrder(i).build();
					log.debug("img : " + img);
					result = mapper.deleteImg(img);
				}
			}
			
			for( int i = 0 ; i < images.size(); i++) {
				
				String originalName = images.get(i).getOriginalFilename();
				if( originalName.equals("dummy.txt")) continue;
				
				// 변경명
				String rename = Utility.fileRename(originalName);
				
				// 모든 값을 저장할 DTO 생성 (BoardImg - Builder 패턴 사용 )
				BoardsImg img = BoardsImg.builder()
						   		.imgPath(webPath)
							   .imgOriginalName(originalName)
							   .imgRename(rename)
							   .imgOrder(i)
							   .imgBoardNo(noteNo)
							   .boardTypeNo(note.getBoardTypeNo())
							   .uploadFile(images.get(i))
							   .build();
				
				// 해당 BoardImg를 uploadList 추가
				uploadList.add(img);
				
				result = mapper.updateImg(img);
				
				if( result == 0) {
					result = mapper.insertImg(img);
				}
			}
			
			if(uploadList.isEmpty()) {
				return result;
			}
			
			for(BoardsImg img : uploadList) {
				img.getUploadFile().transferTo(new File(folderPath + img.getImgRename()));
			}
			
		// 이미지가 비어 있는데 count가 있을 시 삭제
		} else if (count > 0) {
			result = mapper.noteImgDelete(note);
		}

		
		return result;
	}
	
	
	// Note 게시글 삭제
	@Override
	public int noteDelete(Note note) {
		
		int result = mapper.noteDelete(note);
		
		int count = mapper.getNoteImg(note);
		
		result = mapper.noteImgDelete(note);
		
		if( result != count ) {
			throw new RuntimeException();
		}
		
		result = 1;
		
		return result;
	}
	
}
