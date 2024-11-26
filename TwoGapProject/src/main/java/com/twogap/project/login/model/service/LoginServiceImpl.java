package com.twogap.project.login.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.twogap.project.login.model.mapper.LoginMapper;
import com.twogap.project.member.model.dto.Member;

import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@Transactional(rollbackFor=Exception.class) 
public class LoginServiceImpl implements LoginService {
	
	@Autowired
	private LoginMapper mapper;
	
	@Autowired
	private BCryptPasswordEncoder bcrypt;
	

	// 로그인
	@Override
	public Member login(Member inputMember) {
		
		
		// 이메일이 일치하면서 탈퇴하지 않은 회원 조회
		Member loginMember = mapper.login(inputMember.getMemberId());
		// 일치하는 이메일 없어 DB 조회 결과 null인 경우
		if(loginMember == null) return null;
		
		if(!bcrypt.matches(inputMember.getMemberPw(), loginMember.getMemberPw())) {
			// 입력받은 비밀번호(평문)와 암호화 된 비밀번호가 일치하지 않는다면
			return null;
		}
		
		// 로그인 결과에서 비밀번호 제거
		loginMember.setMemberPw(null);

		return loginMember;
	}

}
