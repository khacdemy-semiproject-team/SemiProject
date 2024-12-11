package com.twogap.project.member.model.service;

import com.twogap.project.member.model.dto.Member;

public interface MemberService {

	/** 개인정보 변경
	 * @param inputMember
	 * @param memberAddress
	 * @param memberTel
	 * @param memberHomeTel
	 * @param memberEmail
	 * @return
	 */
	int privacyInfoUpdate(Member inputMember, String[] memberAddress, String[] memberTel, String[] memberHomeTel,
			String[] memberEmail, Member loginMemberNo);

	
	
	
	
	
	
}
