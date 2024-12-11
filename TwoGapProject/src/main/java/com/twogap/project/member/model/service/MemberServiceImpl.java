package com.twogap.project.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
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
