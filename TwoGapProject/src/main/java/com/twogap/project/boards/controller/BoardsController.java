package com.twogap.project.boards.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.twogap.project.boards.model.service.BoardsService;
import com.twogap.project.common.util.Utility;
import com.twogap.project.member.model.dto.Member;
import com.twogap.project.member.model.service.MemberService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("boards")
@Slf4j
@RequiredArgsConstructor
@SessionAttributes({ "loginMember" })
public class BoardsController {

	private final BoardsService service;
	
	private final MemberService memberService;

	/** 공지사항 가져오기 + 12.09일 타인 방문 추가 및 변경(신동국)
	 * @param loginMember
	 * @return
	 * @author 김용찬
	 */
	@ResponseBody
	@GetMapping("selectAlert")
	public String viewAlert(@SessionAttribute("loginMember") Member loginMember) {
		int memberNo = loginMember.getMemberNo();
		if( Utility.uid != 0 ) memberNo = Utility.uid; // 타인 방문 추가
		return service.viewAlert(memberNo);
	}

	
	/** 공지사항 수정하기
	 * @param loginMember
	 * @param textContent
	 * @return
	 */
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
	public String updateProfile(@SessionAttribute("loginMember") Member loginMember,
								Model model) {
		
		Member member = service.infoMember(loginMember.getMemberNo());
		
		model.addAttribute("member", member);

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
	
	/** 공지사항으로 이동 + 랜덤방문 시 uid 세팅 12.09일 추가
	 * @return
	 */
	@GetMapping("main")
	public String returnAlert(@RequestParam(value = "uid", required = false, defaultValue = "0") int uid,
							@SessionAttribute("loginMember") Member loginMember) {
		
		if( uid != 0 ) {
			if(uid == loginMember.getMemberNo() || memberService.checkDelFl(uid) == 0 ) {
				return "redirect:/boards/main";
			}
		}
		Utility.uid  = uid;
		
		return "boards/main";
		
	}
	
	
	/** 
	 * 프로필 변경사항 제출
	 * @param inputMember
	 * @param loginMember
	 * @param imageInput
	 * @param ra
	 * @return
	 * @throws Exception
	 * @author 우수민
	 */
	@PostMapping("application")
	public String application(Member inputMember,
							@SessionAttribute("loginMember") Member loginMember,
							@RequestParam("imageInput") MultipartFile imageInput,
							RedirectAttributes ra) throws Exception {
		log.debug("imageInput : " + imageInput.getOriginalFilename()); 
		// 프로필 변경 서비스 호출
		loginMember.setMemberNickname(inputMember.getMemberNickname());
		loginMember.setIntroduction(inputMember.getIntroduction());
		loginMember.setBackgroundColor(inputMember.getBackgroundColor());
		
		int result = service.application(loginMember, imageInput);
		
		
		// 변경 성공 시 "변경되었습니다." 메시지
		String message = null;
		
		if(result > 0) message = "변경되었습니다.";
		else		   message = "변경에 실패하였습니다.";

	
		ra.addFlashAttribute("message", message);
		
		return "boards/main";

	}
	

	/**
	 *  회원 탈퇴
	 * @param inputMember
	 * @param ra
	 * @return
	 * @author 우수민
	 */
	@GetMapping("signOut")
	public String signOut(@SessionAttribute("loginMember") Member loginMember,
						SessionStatus status, 
						RedirectAttributes ra) {
		
		log.debug("dls");
		
		//int memberNo = inputMember.getMemberNo();
		int result = service.signOut(loginMember.getMemberNo());
		
		String message = null;
		
		if(result > 0) {
			message = "회원탈퇴가 완료되었습니다. 메인페이지로 이동합니다.";
			status.setComplete(); // 세션 완료 시킴
			
		} else {
			message = "회원 탈퇴를 취소합니다.";
		}
		
		ra.addFlashAttribute("message", message);
		return "redirect:/";
	}
	
	// 배경색 변경
	@ResponseBody
	@GetMapping("backgroundColor")
	public String getBackgroundColor(@SessionAttribute("loginMember") Member loginMember) {
		return loginMember.getBackgroundColor(); 
	}
}	
