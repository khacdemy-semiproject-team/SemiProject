package com.twogap.project.photo.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.twogap.project.common.util.Utility;
import com.twogap.project.member.model.dto.Member;
import com.twogap.project.member.model.service.MemberService;
import com.twogap.project.photo.model.dto.Photo;
import com.twogap.project.photo.model.service.PhotoService;

import ch.qos.logback.core.model.Model;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("photo")
@Slf4j
@RequiredArgsConstructor
@SessionAttributes({"loginMember"})
public class PhotoController {
	
	private final PhotoService service;

	private final MemberService memberService;
	
	@GetMapping("main")
	public String photo(@RequestParam(value = "uid", required = false, defaultValue = "0") int uid,
					@SessionAttribute("loginMember") Member loginMember) {
		if( uid != 0 ) {
			if(uid == loginMember.getMemberNo() || memberService.checkDelFl(uid) == 0 ) {
				Utility.uid = 0;
				return "redirect:/boards/main";
			}
		}
		Utility.uid  = uid;
		return "/boards/photo";
	}
	
	@ResponseBody
	@PutMapping("write")
	public int insertPhoto(@RequestPart(value="images", required = false) List<MultipartFile> images,
			@RequestPart("photoTitle") String photoTitle,
			@SessionAttribute(value="loginMember") Member loginMember,
		RedirectAttributes ra) throws Exception {
		Photo photo = new Photo();		
		
		photo.setPhotoTitle(photoTitle.replace("\"", ""));
		photo.setMemberNo(loginMember.getMemberNo());
		
		int result = service.photoInsert(photo, images);
		
		return result;
	}
	
	@GetMapping("selectList")
	@ResponseBody
	public List<Photo> photoSelectList(@SessionAttribute("loginMember") Member loginMember,
									 @RequestParam(value="cp",required = false, defaultValue = "1") int cp,
									 Model model) {
		
		// photoSelectList 결과 받아오기
		int memberNo = loginMember.getMemberNo();
		if( Utility.uid != 0 ) memberNo = Utility.uid; // 타인 방문 추가
		List<Photo> photoList = service.photoSelectList(memberNo, cp);
		return photoList;
	}
	
	@DeleteMapping("delete")
	@ResponseBody
	public int photoDelete(@SessionAttribute ("loginMember") Member loginMember,
						   @RequestBody Photo photo) {
		
		return service.photoDelete(photo);
	}
	
	@PutMapping("update")
	@ResponseBody
	public int photoUpdate(@SessionAttribute ("loginMember") Member loginMember,
			@RequestPart(value="images", required = false) MultipartFile images,
			@RequestPart("photo") Photo photo) throws Exception {
		log.debug("photo : " + photo);
		int result = service.photoUpdate(photo, images);
		
		return result;
	}
	
	@PutMapping("photoTitleUpdate")
	@ResponseBody
	public int photoTitleUpdate(@SessionAttribute("loginMember") Member loginMember,
				@RequestBody Photo photo) {
		
			
		return service.photoTitleUpdate(photo);
	}
	

}