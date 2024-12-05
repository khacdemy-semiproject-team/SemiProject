package com.twogap.project.note.contoroller;

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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;

import com.twogap.project.boards.model.dto.BoardsImg;
import com.twogap.project.member.model.dto.Member;
import com.twogap.project.note.model.dto.Note;
import com.twogap.project.note.model.service.NoteService;

import ch.qos.logback.core.model.Model;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("note")
@Slf4j
@RequiredArgsConstructor
public class NoteController {
	
	private final NoteService service;
	
	@GetMapping("main")
	public String noteMain() {
		return "boards/note";
	}
	
	/** Note 게시글 가져오기
	 * @param memberNo
	 * @return List<Note>
	 * @author mujamuja
	 */
	@GetMapping("selectList")
	@ResponseBody
	public Map<String, Object> noteSelectList(@SessionAttribute("loginMember") Member loginMember,
									 @RequestParam(value="cp",required = false, defaultValue = "1") int cp,
									 Model model) {
		// noteList 결과 받아오기
		Map<String, Object> map = service.noteSelectList(loginMember.getMemberNo(), cp);

		return map;
	}
	
	/** Note 게시글 이미지 가져오기
	 * @param noteNo
	 * @return
	 * @author mujamuja
	 */
	@ResponseBody
	@GetMapping("selectImg")
	public List<BoardsImg> noteSelectImg(@RequestParam(value="noteNo") int noteNo) {
		
//		List <Boa>
		
		return service.noteSelectImg(noteNo);
	}
	
	
	/**  Note 게시글 삽입
	 * @param images
	 * @param note
	 * @return
	 * @author mujamuja
	 */
	@ResponseBody
	@PostMapping("insert")
	public int noteInsert(@RequestPart(value="images", required = false) List<MultipartFile> images,
						@RequestPart("note") Note note,
						@SessionAttribute(value="loginMember") Member loginMember) throws Exception {
		
		note.setMemberNo(loginMember.getMemberNo());
		
		int result = service.noteInsert(note, images);
		
		return result;
	}
	
	/** Note 게시글 수정
	 * @param images
	 * @param note
	 * @return
	 * @author mujamuja
	 */
	@ResponseBody
	@PutMapping("update")
	public int noteUpdate(@RequestPart(value = "images", required = false) List<MultipartFile> images,
						@RequestPart("note") Note note) throws Exception{
		
		int result = service.noteUpdate(images, note);
		
		return result;
	}
	
	@ResponseBody
	@DeleteMapping("delete")
	public int noteDelete(@RequestBody Note note, @SessionAttribute("loginMember") Member loginMember) {
		note.setMemberNo(loginMember.getMemberNo());
		return service.noteDelete(note);
	}
	
}
