package com.twogap.project.member.model.service;

import java.util.Arrays;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.twogap.project.member.model.dto.Member;
import com.twogap.project.member.model.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {
	
	private final MemberMapper mapper;
	
	
	// 랜덤 멤버 넘버 얻어오기
	@Override
	public int randomMemberNo(int memberNo) {
		
		int[] memberNoArr = mapper.memberNoList(memberNo);
		
		Random random = new Random();
		
		return memberNoArr[random.nextInt(memberNoArr.length)];
	}

	
	

}
