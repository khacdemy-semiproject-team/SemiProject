package com.twogap.project.photo.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.twogap.project.photo.model.dto.Photo;

public interface PhotoService {

	/** 사진첩 목록 조회
	 * @param memberNo
	 * @return
	 */
	String viewPhoto(int memberNo);

	/** 사진첩 글쓰기
	 * @param photo
	 * @param images
	 * @return
	 */
	int photoInsert(Photo photo, List<MultipartFile> images) throws Exception;
 
	/** 페이지 네이션
	 * @param memberNo
	 * @param cp
	 * @return
	 */
	Map<String, Object> photoSelectList(int memberNo, int cp);
	

}
