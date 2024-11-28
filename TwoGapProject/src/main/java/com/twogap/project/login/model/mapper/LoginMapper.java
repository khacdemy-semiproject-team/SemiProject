package com.twogap.project.login.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.twogap.project.member.model.dto.Member;

@Mapper
public interface LoginMapper {

	/** 로그인
	 * @param memberEmail
	 * @return
	 */
	Member login(String memberId);

	/** 아이디 중복 검사
	 * @param memberId
	 * @return
	 */
	int checkId(String memberId);

	/** 이메일 유효성 검사
	 * @param memberEmail
	 * @return
	 */
	int checkEmail(String memberEmail);  
	
	/** 닉네임 중복 검사
	 * @param memberNickname
	 * @return
	 */
	int checkNickname(String memberNickname);

	/**  회원가입 
	 * @param inputMember
	 * @return
	 */
	int signup(Member inputMember);


}
