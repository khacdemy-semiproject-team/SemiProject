package com.twogap.project.member.model.service;

import com.twogap.project.member.model.dto.Member;

public interface MemberService {

	Member selectMember(int memberNo);

	/** 프로필 수정 -> 비밀번호 변경
	 * @param memberPw
	 * @param memberNewPw
	 * @param memberNo
	 * @return
	 */
	int pwChange(String memberPw, String memberPwConfirm, int memberNo); 

	
	
}
