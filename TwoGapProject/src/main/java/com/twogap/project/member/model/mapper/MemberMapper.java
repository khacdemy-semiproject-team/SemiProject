package com.twogap.project.member.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.twogap.project.member.model.dto.Member;

@Mapper
public interface MemberMapper {

	/** 멤버 넘버 리스트 얻어오기
	 * @param memberNo
	 * @return
	 */
	int[] memberNoList(int memberNo);

	/** 현재 비밀번호가 일치하는지 확인
	 * @param memberNo
	 * @return
	 * @author 우수민
	 */
	String selectPw(int memberNo);

	/** 새 비밀번호로 변경
	 * @param paramMap
	 * @return
	 * @author 우수민
	 */
	int changePw(Map<String, Object> paramMap);

	

	

}
