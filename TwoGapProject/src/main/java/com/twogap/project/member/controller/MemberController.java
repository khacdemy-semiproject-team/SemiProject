package com.twogap.project.member.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.twogap.project.member.model.dto.Member;
import com.twogap.project.member.model.service.MemberService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("member")
@Slf4j
@RequiredArgsConstructor
@SessionAttributes({ "loginMember" })
public class MemberController {

	private final MemberService service;

	// 12 08일 삭제함 - 쓸모 없는 코드
	/** 랜던 방문을 위한 키 얻어오기
	 * @return
	 * @author 신동국
	 */
	@GetMapping("random")
	@ResponseBody
	public int randomMemberNo(@SessionAttribute("loginMember") Member loginMember) {
		
		return service.randomMemberNo(loginMember.getMemberNo());
	}

}
