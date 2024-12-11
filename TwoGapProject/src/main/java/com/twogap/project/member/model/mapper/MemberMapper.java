package com.twogap.project.member.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.twogap.project.member.model.dto.Member;

@Mapper
public interface MemberMapper {

	Member selectMember(int memberNo);

	// 개인정보 변경
	int privacyInfoUpdate(Member inputMember);

	

	

}
