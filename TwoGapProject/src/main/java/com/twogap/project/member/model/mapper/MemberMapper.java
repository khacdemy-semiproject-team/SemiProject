package com.twogap.project.member.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.twogap.project.member.model.dto.Member;

@Mapper
public interface MemberMapper {

	/** 멤버 넘버 리스트 얻어오기
	 * @param memberNo
	 * @return
	 */
	int[] memberNoList(int memberNo);

	

	

}
