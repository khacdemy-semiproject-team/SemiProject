package com.twogap.project.boards.model.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.twogap.project.member.model.dto.Member;

public interface BoardsService {

	String viewAlert(int memberNo);


	int alertUpdate(Member member);


	/** 닉네임 유효성 검사 
	 * @param memberNickname
	 * @return
	 * @author 우수민
	 */
	int checkNickname(String memberNickname);


	/** 프로필 변경사항 제출
	 * @param map
	 * @return
	 * @author 우수민
	 * 
	 */
	int application(Member loginMember, MultipartFile imageInput, int status) throws Exception;


	/** 사용자 조회
	 * @param memberNo
	 * @return
	 * @author 우수민
	 */
	Member infoMember(int memberNo);




	/** 회원탈퇴
	 * @return
	 * @author 우수민
	 */
	int signOut(int memberNo);


	/** 배경화면 색 가져오기
	 * @param uid
	 * @return
	 */
	String getBackgroundColor(int uid);







}
