package com.twogap.project.boards.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.twogap.project.member.model.dto.Member;

@Mapper
public interface BoardsMapper {

	/** 공지사항 가져오기
	 * @param memberNo
	 * @return
	 * @author 김용찬
	 */
	String viewAlert(int memberNo);

	/** 공지사항 수정
	 * @param member
	 * @return
	 * @author 김용찬
	 */
	int updateAlert(Member member);

	/** 공지사항 입력
	 * @param member
	 * @return
	 * @author 김용찬
	 */
	int insertAlert(Member member);

	/** 닉네임 중복 검사
	 * @param memberNickname
	 * @return
	 * @author 우수민
	 */
	int checkNickname(String memberNickname);

}
