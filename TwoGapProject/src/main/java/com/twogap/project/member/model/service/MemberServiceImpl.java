package com.twogap.project.member.model.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.twogap.project.member.model.dto.Member;
import com.twogap.project.member.model.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

	private final MemberMapper mapper;

	// BCrypt 암호화 객체 의존성 주입(SecurityConfig 참고)
	private final BCryptPasswordEncoder bcrypt;

	@Override
	public Member selectMember(int memberNo) {
		return mapper.selectMember(memberNo);
	}

	
	// 프로필 수정 -> 비밀번호 변경
	@Override
	public int pwChange(String memberPw, String memberPwConfirm, int memberNo) {
		
		// 1. 현재 비밀번호가 일치하는지 확인하기
		// - 현재 로그인한 회원의 암호화된 비밀번호를 DB에서 조회
		String originPw = mapper.selectPw(memberNo);

		// 입력받은 현재 비밀번호와(평문)
		// DB에서 조회한 비밀번호(암호화)를 비교
		// -> BCryptPasswordEncoder.matches(평문, 암호화된비밀번호) 사용

		// 다를 경우
		if (!bcrypt.matches(memberPw, originPw)) {
			return 0;
		}

		// 2. 같을경우
		// 새 비밀번호를 암호화 (BCryptPasswordEncoder.encode(평문))
		String encPw = bcrypt.encode(memberPwConfirm);
		
		Map<String, Object> paramMap = new HashMap<>();

		// 진행후 DB에 업데이트
		// SQL 전달해야하는 데이터 2개 (암호화한 새 비밀번호, 회원번호)
		// -> SQL 전달 인자 1개뿐!
		// -> 묶어서 전달 (paramMap 재활용)

		paramMap.put("encPw", encPw);
		paramMap.put("memberNo", memberNo);

		return mapper.changePw(paramMap);
	}

}
