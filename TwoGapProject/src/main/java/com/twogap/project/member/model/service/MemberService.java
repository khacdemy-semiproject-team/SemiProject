package com.twogap.project.member.model.service;

import com.twogap.project.member.model.dto.Member;

public interface MemberService {

	/** 랜덤 멤버 넘버 얻어오기
	 * @return
	 */
	int randomMemberNo(int memberNo);

	/** 프로필 수정 -> 비밀번호 변경
	 * @param memberPw
	 * @param memberNewPw
	 * @param memberNo
	 * @return
	 */
	int pwChange(String memberPw, String memberPwConfirm, int memberNo); 


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

	/** 닉네임 얻어오기
	 * @param memberNo
	 * @return
	 * @author 신동국
	 */
	String getHostNickname(int memberNo);

	/** 탈퇴회원인지 조회
	 * @param uid
	 * @return
	 */
	int checkDelFl(int uid);
	
}
