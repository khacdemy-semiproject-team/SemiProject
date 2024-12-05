package com.twogap.project.photo.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.twogap.project.boards.model.dto.BoardsImg;
import com.twogap.project.note.model.dto.Note;
import com.twogap.project.photo.model.dto.Photo;

@Mapper
public interface PhotoMapper {

	String viewPhoto(int memberNo);

	
	/** 사진첩 삽입
	 * @param note
	 * @return
	 * @author 
	 */
	int photoInsert(Photo photo);

	/** 사진첩 첨부 이미지 정보 DB에 저장
	 * @param uploadList
	 * @return
	 * @author 
	 */
	int photoInsertUploadList(List<BoardsImg> uploadList);


	/** 회원의 게시글 가져오기
	 * @param memberNo
	 * @return
	 */
	int getPhotoListCount(int memberNo);


	/** photo 게시글 가져오기
	 * @param memberNo
	 * @param rowBounds
	 * @return
	 */
	List<Note> photoSelectList(int memberNo, RowBounds rowBounds);
	
	
	
	
	



}
