package com.twogap.project.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
	private int memberNo;
	private String memberId;
	private String memberPw;
	private String memberEmail;
	private String memberNickname;
	private String memberDelFl;
	private String memberTel;
	private String memberHomeTel;
	private String memberAddress;
	private String profileImg;
	private String backgroundColor;
	private String personalCode;
	private String authority;
	private String introduction;
	private String alertContent;
	
	// 팔로우 상태 이용 변수
	private int followState;
}

