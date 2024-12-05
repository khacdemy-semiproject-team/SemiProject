package com.twogap.project.board.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.twogap.project.board.model.dto.Board;

@Mapper
public interface BoardMapper {
	
	/** 해당 홈페이지 게시판 글 수 조회
	 * @param memberNo
	 * @return
	 */
	int getBoardListCount(int memberNo);

	/** 게시판 목록 조회
	 * @param memberNo
	 * @return boardList
	 */
	List<Board> boardSelectList(int memberNo, RowBounds rowBounds);

	/** 게시글 수정하기
	 * @param board
	 * @return
	 */
	int boardUpdate(Board board);
	

	/** 게시글 삭제하기
	 * @param board
	 * @return
	 */
	int boardDelete(Board board);

	/** 게시글 작성
	 * @param board
	 * @return
	 */
	int insertBoard(Board board);

	


}
