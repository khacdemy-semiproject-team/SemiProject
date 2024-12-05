package com.twogap.project.login.model.service;

import com.twogap.project.member.model.dto.Member;

public interface LoginService {

	/** 로그인
	 * @param inputMember
	 * @return
	 * @author 우수민
	 */
	Member login(Member inputMember);

	/** 아이디 중복 검사
	 * @param memberId
	 * @return
	 * @author 우수민
	 */
	int checkId(String memberId);

	/** 이메일 유효성 검사 
	 * @param memberEmail
	 * @return
	 * @author 우수민
	 */
	int checkEmail(String memberEmail);    
	
	/** 닉네임 유효성 검사 
	 * @param memberNickname
	 * @return
	 * @author 우수민
	 */
	int checkNickname(String memberNickname);

	/** 회원가입 
	 * @param inputMember
	 * @param memberAddress
	 * @return 
	 * @author 우수민
	 * @param memberHomeTel 
	 * @param memberTel 
	 */
	int submit(Member inputMember, String[] memberAdress, String[] memberTel,
			String[] memberHomeTel, String[] memberEmail, String[] personalCode);

	/** 아이디 찾기
	 * @param inputmember
	 * @return
	 * @author 우수민
	 */
	Member findId(Member inputmember, String[] memberEmail);

	/** 변경된 비밀번호 적용
	 * @param memberId
	 * @param memberPw
	 * @return
	 * @author 우수민
	 */
	int updatePw(String memberId, String memberPw);

	/** 아이디 이메일 매치 확인
	 * @param memberId
	 * @param memberEmail
	 * @return
	 */
	int matchInput(Member inputmember, String memberId, String[] memberEmail);



}
