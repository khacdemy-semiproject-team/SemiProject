package com.twogap.project.board.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Board {
	
	// BOARD 테이블 컬럼
	private int boardNo;
	private String boardTitle;
	private String boardContent;
	private String boardDate;
	private String boardUpdateDate;
	private int memberNo;
	private int boardTypeNo;
	

}
