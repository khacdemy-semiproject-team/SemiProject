package com.twogap.project;

import java.lang.ProcessBuilder.Redirect;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.twogap.project.common.util.Utility;
import com.twogap.project.member.model.dto.Member;
import com.twogap.project.member.model.service.MemberService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
public class MainController {
	
	public final MemberService memberService;
	
	/** 12-11 로그인 멤버 체크후 이동
	 * @param loginMember
	 * @return
	 * @author 신동국
	 */
	@RequestMapping("/")
	public String main(@SessionAttribute(name = "loginMember", required = false) Member loginMember) {
		
		String path = null;
		
		if(loginMember == null ) {
			path = "member/login";
		} else {
			path = "/boards/main";
		}
		
		return path;
	}
	
	/** guest 판별용
	 * @param loginMember
	 * @return
	 * @author 신동국
	 */
	@ResponseBody
	@RequestMapping("getNo")
	public int getMember(@SessionAttribute("loginMember") Member loginMember) {
		return loginMember.getMemberNo();
	}
	
	@GetMapping("loginError")
	public String loginError(RedirectAttributes ra) {
		
		ra.addFlashAttribute("message", "로그인 후 이용해 주세요");
		
		return "redirect:/"; 
	}
	
	/** 홈페이지 상단 호스트 닉네임 가져오기
	 * @param loginMember
	 * @return
	 */
	@ResponseBody
	@RequestMapping("getHostName")
	public String getHostName(@SessionAttribute("loginMember") Member loginMember) {
		
		int memberNo = loginMember.getMemberNo(); 
		if( Utility.uid != 0 ) memberNo = Utility.uid;
		
		String nickname = memberService.getHostNickname(memberNo);
		
		return nickname;
	}
	
}
