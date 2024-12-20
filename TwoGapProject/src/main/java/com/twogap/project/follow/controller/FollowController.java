package com.twogap.project.follow.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.twogap.project.follow.model.service.FollowService;
import com.twogap.project.member.model.dto.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("follow")
@SessionAttributes("loginMember")
public class FollowController {
	
	public final FollowService service;
	
	/** 게시판으로 이동
	 * @return
	 * @author 신동국
	 */
	@GetMapping("main")
	public String followMain() {
		return "follow/followbox";
	}
	
	/** 검색 창에 닉네임이 포한되는 유저 검색
	 * @param keyword
	 * @return
	 * @author 신동국
	 */
	@ResponseBody
	@GetMapping("search")
	public List<Member> searchList(@RequestParam("searchName") String keyword,
								   @SessionAttribute("loginMember") Member loginMember) {
		return service.searchMember(loginMember, keyword);
	}
	
	/** 
	 * @param loginMember
	 * @param memberno
	 * @return
	 * @author 신동국
	 */
	@ResponseBody
	@DeleteMapping("unFollow")
	public int unFollow(@SessionAttribute("loginMember") Member loginMember,
						@RequestBody int memberNo) {
		return service.unFollow(loginMember, memberNo);
	}
	
	@ResponseBody
	@PutMapping("addFollow")
	public int addFollow(@SessionAttribute("loginMember") Member loginMember,
						@RequestBody int memberNo) {
		return service.addFollow(loginMember, memberNo);
	}
}
