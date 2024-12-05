package com.twogap.project.boards.model.service;

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



}
