package com.twogap.project.board.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.twogap.project.board.model.dto.Board;
import com.twogap.project.board.model.service.BoardService;
import com.twogap.project.member.model.dto.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


/** 게시판 목록 조회
 * 
 * */
@Controller
@RequestMapping("board")
@Slf4j
@RequiredArgsConstructor
public class BoardController {
	
	private final BoardService service;
	
	
	/** 메인 메뉴바에서 게시판 클릭 시 
	 * @return
	 */
	@GetMapping("main")
	public String boardMain() {
		return "boards/board";
	}
	
	@GetMapping("selectList")
	@ResponseBody
	public Map<String, Object> boardSelectList(@SessionAttribute("loginMember") Member loginMember,
											   @RequestParam(value="cp",required = false, defaultValue = "1") int cp) {
		
		// 게시판 목록 조회 서비스 호출
		Map<String, Object> map = service.boardSelectList(loginMember.getMemberNo(), cp);
		
		return map;
	}
	
	
	 
	/** 게시글 수정하기
	 * @param board
	 * @param loginMember
	 * @return
	 */
	@PostMapping("update")
	@ResponseBody
	public int updateBoard (@RequestBody Board board,
	                        @SessionAttribute("loginMember") Member loginMember) {
	    
	    // 로그 추가 (디버깅 용)
	    log.debug("Board Update Request: " + board);
	    board.setMemberNo(loginMember.getMemberNo());
	    
	    
	    // 현재 로그인한 회원이 게시글 작성자인지 확인 (선택적 보안 검증)
	    // board.setMemberNo(loginMember.getMemberNo());
	    
	    // 서비스 레이어의 게시글 업데이트 메서드 호출
	    int result = service.updateBoard(board);
	    
	    return result; // 성공 시 1, 실패 시 0 반환
	}
	
	
	
	
	
	/** 게시글 삭제하기
	 * @param board
	 * @param loginMember
	 * @return
	 */
	@PostMapping("delete")
	@ResponseBody
	public int deleteBoard (@RequestBody int boardNo,
	                        @SessionAttribute("loginMember") Member loginMember) {
	    
	    Board board = new Board();
	    
	    // 현재 로그인한 회원의 번호 설정
	    board.setMemberNo(loginMember.getMemberNo());
	    board.setBoardNo(boardNo);
	    
	    // 게시글 삭제 메서드 호출
	    int result = service.deleteBoard(board);
	    
	    return result; // 성공 시 1, 실패 시 0 반환
	}
	
	
	/** 게시글 작성
	 * @param boardNo
	 * @param loginMember
	 * @return
	 */
	@PostMapping("write")
	@ResponseBody
	public int writeBoard (@RequestBody Board board,
	                       @SessionAttribute("loginMember") Member loginMember) {
	    
	
	    // 현재 로그인한 회원의 번호 설정
	    board.setMemberNo(loginMember.getMemberNo());
	    
	    
	    log.debug("Board Write Request: " + board);
	    
	    // 게시글 삭제 메서드 호출
	    int result = service.insertBoard(board);
	    
	    return result; // 성공 시 1, 실패 시 0 반환
	}
	
	
	
	
	
		
	

}
