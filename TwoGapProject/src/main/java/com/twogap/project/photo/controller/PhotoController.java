package com.twogap.project.photo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.twogap.project.member.model.dto.Member;
import com.twogap.project.note.model.dto.Note;
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
	
	@GetMapping("main")
	public String photo() {
		return "/boards/photo";
	}
	
	@ResponseBody
	@PutMapping("write")
	public int insertPhoto(@RequestPart(value="images", required = false) List<MultipartFile> images,
			@RequestPart("photoTitle") String photoTitle,
			@SessionAttribute(value="loginMember") Member loginMember,
			RedirectAttributes ra) throws Exception {
		Photo photo = new Photo();		
		
		photo.setPhotoTitle(photoTitle);
		photo.setMemberNo(loginMember.getMemberNo());
		
		int result = service.photoInsert(photo, images);
		
		return result;
	}
	
	@GetMapping("selectList")
	@ResponseBody
	public Map<String, Object> photoSelectList(@SessionAttribute("loginMember") Member loginMember,
									 @RequestParam(value="cp",required = false, defaultValue = "1") int cp,
									 Model model) {
		// noteList 결과 받아오기
		Map<String, Object> map = service.photoSelectList(loginMember.getMemberNo(), cp);
		return map;
	}
	
	

}
