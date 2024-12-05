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

	@GetMapping("test")
	public String memberTest(@RequestParam("memberNo") int memberNo, Model model) {

		Member member = service.selectMember(memberNo);

		model.addAttribute("loginMember", member);

		
		
		return "boards/test";
	}
	
	@GetMapping("main")
	public String logIn(@RequestParam("memberNo") int memberNo,
							 Model model
			) {
		
		Member member = service.selectMember(memberNo);
		
		model.addAttribute("loginMember", member);
		
		
		return "boards/main";
	}



	@GetMapping("note")
	public String noteTest(@RequestParam("memberNo") int memberNo, Model model) {

		Member member = service.selectMember(memberNo);

		model.addAttribute("loginMember", member);

		return "boards/note";
	}
	


}
