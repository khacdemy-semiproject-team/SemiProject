package com.twogap.project.member.model.service;

import java.util.Arrays;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.twogap.project.member.model.dto.Member;
import com.twogap.project.member.model.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(rollbackFor = Exception.class)
public class MemberServiceImpl implements MemberService {

	private final MemberMapper mapper;
	
	// BCrypt 암호화 객체 의존성 주입(SecurityConfig 참고)
	private final BCryptPasswordEncoder bcrypt;
	
	// 랜덤 멤버 넘버 얻어오기
	@Override
	public int randomMemberNo(int memberNo) {
		
		int[] memberNoArr = mapper.memberNoList(memberNo);
		
		Random random = new Random();
		
		return memberNoArr[random.nextInt(memberNoArr.length)];
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

	// 개인정보 변경
	@Override
	public int privacyInfoUpdate(Member inputMember, String[] memberAddress, String[] memberTel, String[] memberHomeTel,
			String[] memberEmail, Member loginMember) {

		if (!inputMember.getMemberAdress().equals(",,")) {

			String address = String.join("^^^", memberAddress);

			inputMember.setMemberAdress(address);

		} else {

			inputMember.setMemberAdress(null);

		}

		// 이메일
		if (!inputMember.getMemberEmail().equals(",")) {
			String email = memberEmail[0] + '@' + memberEmail[1];
			log.debug("email" + email);
			inputMember.setMemberEmail(email);

		} else {

			inputMember.setMemberEmail(null);

		}

		// 핸드폰 번호
		if (!inputMember.getMemberTel().equals(",")) {
			String tel = String.join("-", memberTel);
			inputMember.setMemberTel(tel);
		} else {
			inputMember.setMemberTel(null);
		}

		// 집 전화번호
		if (!inputMember.getMemberHomeTel().equals(",")) {
			String homeTel = String.join("-", memberHomeTel);
			inputMember.setMemberHomeTel(homeTel);
		} else {
			inputMember.setMemberHomeTel(null);
		}
		
		inputMember.setMemberNo(loginMember.getMemberNo());
		
		int result = mapper.privacyInfoUpdate(inputMember);
		
		// 업데이트 성공 시 세션 멤버도 변경
		if( result > 0) {
			loginMember.setMemberAdress(inputMember.getMemberAdress());
			loginMember.setMemberEmail(inputMember.getMemberEmail());
			loginMember.setMemberTel(inputMember.getMemberTel());
			loginMember.setMemberHomeTel(inputMember.getMemberHomeTel());
		}
		
		return result;
	}

}
