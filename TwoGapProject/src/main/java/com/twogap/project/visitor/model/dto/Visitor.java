package com.twogap.project.visitor.model.dto;

import com.twogap.project.member.model.dto.Member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {
	private int visitorNo;
	private String visitorContent;
	private String visitorDate;
	private String visitorUpdateDate;
	private int memberNo;
	private int boardTypeNo;
	private int hostMemberNo;
	
	// 해당 방명록 적은 유저 가져오기
	private Member visitorMember;
}
