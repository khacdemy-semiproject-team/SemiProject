package com.twogap.project.board.model.service;

import java.util.List;
import java.util.Map;

import com.twogap.project.board.model.dto.Board;

public interface BoardService {

	/** 게시판 목록 조회
	 * @param memberNo
	 * @return boardList
	 */
	Map<String, Object> boardSelectList(int memberNo, int cp);
	

	/** 게시글 수정하기
	 * @param board
	 * @return
	 */
	int updateBoard(Board board);
	
	

	/** 게시글 삭제하기
	 * @param board
	 * @return
	 */
	int deleteBoard(Board board);


	/** 게시글 작성
	 * @param board
	 * @return
	 */
	int insertBoard(Board board);


	
	

	
}
