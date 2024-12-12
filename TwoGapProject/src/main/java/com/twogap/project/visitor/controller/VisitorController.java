package com.twogap.project.visitor.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.twogap.project.common.util.Utility;
import com.twogap.project.member.model.dto.Member;
import com.twogap.project.member.model.service.MemberService;
import com.twogap.project.visitor.model.dto.Visitor;
import com.twogap.project.visitor.model.service.VisitorService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("visitor")
@Slf4j
@SessionAttributes({"loginMember"})
@RequiredArgsConstructor
public class VisitorController {
	
	public final VisitorService service;

	private final MemberService memberService;
	
	@GetMapping("main")
	public String visitorMain(@RequestParam(value = "uid", required = false, defaultValue = "0") int uid,
				@SessionAttribute("loginMember") Member loginMember) {
		
		if( uid != 0 ) {
			if(uid == loginMember.getMemberNo() || memberService.checkDelFl(uid) == 0 ) {
				Utility.uid = 0;
				return "redirect:/visitor/main";
			}
		}
		Utility.uid  = uid;
		
		return "/boards/visitor";
	}
	
	/** 방명록 
	 * @param loginMember
	 * @return
	 * @author 신동국
	 */
	@ResponseBody
	@GetMapping("selectList") 
	public Map<String, Object> selectList(@SessionAttribute("loginMember") Member loginMember,
								@RequestParam(value="cp",required = false, defaultValue = "1") int cp) {
		
		int memberNo = loginMember.getMemberNo();
		if( Utility.uid != 0 ) memberNo = Utility.uid; // 타인 방문 추가
		
		return service.selectList(memberNo, cp);
	}
	
	/** 방명록 글 삽입
	 * @return
	 * @author 신동국
	 */
	@ResponseBody
	@PostMapping("insert")
	public int visitorInsert(@RequestBody Visitor visitor,
							@SessionAttribute("loginMember") Member loginMember) {
		visitor.setMemberNo(loginMember.getMemberNo());
		return service.visitorInsert(visitor);
	}
	
	
	/** 방명록 글 수정
	 * @return
	 * @author 신동국
	 */
	@ResponseBody
	@PutMapping("update")
	public int visitorUpdate(@RequestBody Visitor visitor,
			@SessionAttribute("loginMember") Member loginMember) {
		visitor.setMemberNo(loginMember.getMemberNo());
		return service.visitorUpdate(visitor);
	}
	
	
	/** 방명록 글 삭제
	 * @return
	 * @author 신동국
	 */
	@DeleteMapping("delete")
	@ResponseBody
	public int visitorDelete(@RequestBody int visitorNo) {
		return service.visitorDelete(visitorNo);
	}
}
