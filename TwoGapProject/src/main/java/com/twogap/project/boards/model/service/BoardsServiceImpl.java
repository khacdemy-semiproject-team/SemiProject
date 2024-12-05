package com.twogap.project.boards.model.service;

import org.springframework.stereotype.Service;

import com.twogap.project.boards.model.mapper.BoardsMapper;
import com.twogap.project.member.model.dto.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardsServiceImpl implements BoardsService {

	private final BoardsMapper mapper;
	
	@Override
	public String viewAlert(int memberNo) {
		return mapper.viewAlert(memberNo);
	}

	@Override
	public int alertUpdate(Member member) {
		
		int result = mapper.updateAlert(member);
		
		log.debug(member.getAlertContent());
		
		if( result == 0) {
			result= mapper.insertAlert(member);
		}
		
		return result;
	}

	// 닉네임 중복검사
	@Override
	public int checkNickname(String memberNickname) {
		return mapper.checkNickname(memberNickname);
	}


}
