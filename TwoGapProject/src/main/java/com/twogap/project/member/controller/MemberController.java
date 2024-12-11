package com.twogap.project.member.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
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
	
	/** 프로필 수정 -> 비밀번호 변경
	 * @return
	 * @author 우수민
	 */
	@GetMapping("pwChange")
	public String pwChange() {
		
		return "member/pwChange"; // 변경 페이지로 이동
	}
	
	@PostMapping("pwChange")
	public String pwChange(@SessionAttribute("loginMember") Member loginMember,
						@RequestParam("memberPw")String memberPw,
						@RequestParam("memberPwConfirm") String memberPwConfirm,
						RedirectAttributes ra) {
		
		int result = service.pwChange(memberPw, memberPwConfirm, loginMember.getMemberNo()); 
		
		String message = null;
		String path = null;
		
		if(result > 0) { 
			
			message = "비밀번호가 성공적으로 변경되었습니다.";
			path = "boards/main";
			
		} else {
			
			message = "기존 비밀번호가 일치하지 않거나 오류가 발생했습니다.";
			path = "member/pwChange"; // 기존 비밀번호 일치하지 않을 시 해당 페이지에 머묾

		}
		
		ra.addFlashAttribute("message", message);  
		
		return "redirect:/" + path; 
		
	}
	
	
	/** 프로필 수정 -> 회원탈퇴
	 * @return
	 * @author 우수민
	 */
	@GetMapping("signOut")
	public String signOut() {
		
		return "member/signOut"; // 회원탈퇴 페이지로 이동
	}

}
