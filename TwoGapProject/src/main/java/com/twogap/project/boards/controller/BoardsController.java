package com.twogap.project.boards.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.twogap.project.boards.model.service.BoardsService;
import com.twogap.project.member.model.dto.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("boards")
@Slf4j
@RequiredArgsConstructor
@SessionAttributes({ "loginMember" })
public class BoardsController {

	private final BoardsService service;

	@ResponseBody
	@GetMapping("selectAlert")
	public String viewAlert(@SessionAttribute("loginMember") Member loginMember) {
		int memberNo = loginMember.getMemberNo();
		return service.viewAlert(memberNo);
	}

	@ResponseBody
	@PutMapping("updateAlert")
	public int updateAlert(@SessionAttribute("loginMember") Member loginMember, @RequestBody String textContent) {

		Member member = new Member();
		member.setMemberNo(loginMember.getMemberNo());
		member.setAlertContent(textContent);
		int result = service.alertUpdate(member);
		return result;

	}

	/**
	 * 프로필 이미지 변경 화면 이동
	 * 
	 * @return
	 * @author 우수민
	 */
	@GetMapping("profile-update") // /boards/profile GET 방식 요청
	public String updateProfile() {

		return "/boards/profile-update";
	}

	/**
	 * 닉네임 유효성 검사
	 * 
	 * @return 중복 1, 아니면 0
	 * @author 우수민
	 */
	@ResponseBody
	@GetMapping("checkNickname")
	public int checkNickname(@RequestParam("memberNickname") String memberNickname) {
		return service.checkNickname(memberNickname);
	}
	
	@GetMapping("main")
	public String returnAlert() {
		return "boards/main";
		
	}
	
	
	
	
	
	
	
	

	// 프로필 변경사항 제출
	@PostMapping("application")
	public String application(Member inputMember,
							@RequestParam("introduction") String introduction,
							@RequestParam("memberNickname") String memberNickname,
							@RequestParam("profileImg") MultipartFile profileImg,
							RedirectAttributes ra) {
		
		// 프로필 변경 서비스 호출
		//String application = service.application();
		
		inputMember.setMemberNickname(memberNickname);
		inputMember.setIntroduction(introduction);
		// inputMember.setProfileImg(profileImg);
		
		
		
		// 변경 성공 시 "변경되었습니다." 메시지
		String message = null;
		
		message = "변경되었습니다.";
		
		
		ra.addFlashAttribute("message", message);
		return "boards/main";

	}

}	
