package com.twogap.project.photo.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Photo {
	private int photoNo;
	private String photoTitle;
	private String photoDate;
	private String photoUpdateDate;
	private int memberNo;
	private int boardTypeNo;
	
	//------------------ IMG 테이블 관련
	private String imgPath;
	private String imgOriginalName;
	private String imgRename;
	
	
}
