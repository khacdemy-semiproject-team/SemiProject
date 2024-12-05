package com.twogap.project.login.model.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

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


	// 아이디 중복 검사
	@Override
	public int checkId(String memberId) {
		
		return mapper.checkId(memberId);
	}
	
	
	// 이메일 유효성 검사
	@Override
	public int checkEmail(String memberEmail) {
		
		return mapper.checkEmail(memberEmail);
	}
	

	// 닉네임 중복 검사
	@Override
	public int checkNickname(String memberNickname) {
		
		return mapper.checkNickname(memberNickname);
	}


	// 회원 가입
	@Override
	public int submit(Member inputMember, String[] memberAddress, String[] memberTel,
			String[] memberHomeTel, String[] memberEmail, String[] personalCode) {
		
		// 주소
		if(!inputMember.getMemberAddress().equals(",,")) {
			
			String address = String.join("^^^", memberAddress);
			
			inputMember.setMemberAddress(address);

			
		} else {
<<<<<<< HEAD
			inputMember.setMemberAdress(null);
=======
			
			inputMember.setMemberAddress(null);


>>>>>>> 92c22bfd05f04515f5669f489ec4d7883bd08667
		}
		
		// 이메일
		if(!inputMember.getMemberEmail().equals(",")) {
			String email = String.join("@", memberEmail);
			
			inputMember.setMemberEmail(email);
			
		} else {
			
			inputMember.setMemberEmail(null);
			
		}
		
		// 주민등록번호
		if(!inputMember.getPersonalCode().equals(",")) {
			String psCode = String.join("-", personalCode);
			inputMember.setPersonalCode(psCode); 
		} else {
			inputMember.setPersonalCode(null);
		}
		
		// 핸드폰 번호
		if(!inputMember.getMemberTel().equals(",")) {
			String tel = String.join("-", memberTel);
			inputMember.setMemberTel(tel);
		} else {
			inputMember.setMemberTel(null);
		}
		
		
		// 집 전화번호
		if(!inputMember.getMemberHomeTel().equals(",")) {
			String homeTel = String.join("-", memberHomeTel);
			inputMember.setMemberHomeTel(homeTel);
		} else {
			inputMember.setMemberHomeTel(null);
		}
		
		String encPw = bcrypt.encode(inputMember.getMemberPw());
		inputMember.setMemberPw(encPw);
		
		return mapper.submit(inputMember);
	}
<<<<<<< HEAD
}
=======


	// 아이디 찾기
	@Override
	public Member findId(Member inputmember, String[] memberEmail) {
		
		if(!inputmember.getMemberEmail().equals(",")) {
			String email = String.join("@", memberEmail);
			
			inputmember.setMemberEmail(email);
		
			
		} else {
			
			inputmember.setMemberEmail(null);
			
		}
		
		return mapper.findId(inputmember);
	}


	// 변경된 비밀번호 적용
	@Override
	public int updatePw(String memberId, String memberPw) {
		
		Map<String, String> map = new HashMap<>();
		map.put("memberId", memberId);
		String encPw = bcrypt.encode(memberPw);
		map.put("memberPw", encPw);
		
		int result = mapper.updatePw(map);

		return result;
	}


	// 아이디 이메일 매치 확인
	@Override
	public int matchInput(Member inputmember, String memberId, String[] memberEmail) {
		
		if(!inputmember.getMemberEmail().equals(",")) {
			String email = String.join("@", memberEmail);
			
			inputmember.setMemberEmail(email);
			inputmember.setMemberId(memberId);
		
			
		} else {
			
			inputmember.setMemberEmail(null);
			
		}
		
		return mapper.matchInput(inputmember);
	}

}
>>>>>>> 92c22bfd05f04515f5669f489ec4d7883bd08667
