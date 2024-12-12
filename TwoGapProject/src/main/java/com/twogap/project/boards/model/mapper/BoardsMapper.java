package com.twogap.project.boards.model.mapper;

import java.util.Map;

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

	/** 프로필 변경사항 제출
	 * @param map
	 * @return
	 */
	int application(Member inputMember);

	/** 사용자 조회
	 * @param memberNo
	 * @return
	 * @author 우수민
	 */
	Member infoMember(int memberNo);

	/** 회원탈퇴
	 * @return
	 * @author 우수민
	 */
	int signOut(int memberNo);

	/** 프로필만 변경
	 * @param loginMember
	 * @return
	 */
	int profileImageUpdate(Member loginMember);

	/** 배경화면 색 가져오기
	 * @param uid
	 * @return
	 */
	String getBackgroundColor(int memberNo);

}
