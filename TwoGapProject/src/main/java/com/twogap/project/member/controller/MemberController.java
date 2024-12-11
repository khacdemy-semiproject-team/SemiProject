package com.twogap.project.member.controller;

import java.util.Arrays;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
	
	
	/** 개인정보변경 페이지로 이동
	 * @return
	 * @author 고민규(12/9)
	 */
	@GetMapping("privacyInfo-update")
	public String privacyInfoUpdate(@SessionAttribute("loginMember") Member loginMember,
							Model model) {
		
		// 이메일 나누기
		if(loginMember.getMemberEmail() != null) {
			String[] arr = loginMember.getMemberEmail().split("@"); 
			
			model.addAttribute("emailId",arr[0]);
			model.addAttribute("emailDomain",arr[1]);
		}
		
		
		// 핸드폰 번호 나누기
		if(loginMember.getMemberTel() != null) {
			String[] arr = loginMember.getMemberTel().split("-"); 
			
			model.addAttribute("memberTel1",arr[0]);
			model.addAttribute("memberTel2",arr[1]);
			model.addAttribute("memberTel3",arr[2]);
		}
		
		// 집 전화번호 나누기
		if(loginMember.getMemberHomeTel() != null) {
			String[] arr = loginMember.getMemberHomeTel().split("-");
			
			model.addAttribute("memberHomeTel1",arr[0]);
			model.addAttribute("memberHomeTel2",arr[1]);
			model.addAttribute("memberHomeTel3",arr[2]);
		}
		
		// 주소 나누기
		if(loginMember.getMemberAdress() != null) {
			
			// 구분자 "^^^" 를 기준으로 
			// memberAddress 값을 쪼개어 String[]로 반환
			String[] arr = loginMember.getMemberAdress().split("\\^\\^\\^"); 
			
			model.addAttribute("postcode",arr[0]);
			model.addAttribute("address",arr[1]);
			model.addAttribute("detailAddress",arr[2]);
		}
		
		return "/member/privacyInfo-update";
		
	}
	
	@PostMapping("privacyInfoUpdate")
	public String privacyInfoUpdate(Member inputMember, 
									@RequestParam("memberAdress")String[] memberAddress,
									@RequestParam("memberTel")String[] memberTel,
									@RequestParam("memberHomeTel")String[] memberHomeTel,
									@RequestParam("memberEmail")String[] memberEmail,
									@SessionAttribute("loginMember") Member loginMember,
									RedirectAttributes ra) {
		String path = null;
		String mesaage = null;
		int result = service.privacyInfoUpdate(inputMember, memberAddress, memberTel, memberHomeTel, memberEmail, loginMember);
		
		if( result > 0 ) {
			mesaage = "개인정보 변경 성공";
			path = "boards/main";
		} else {
			mesaage = "개인정보 변경 실패";
			path = "member/privacyInfoUpdate";
		}
		
		
		return "redirect:/" + path;
	}
	


}
