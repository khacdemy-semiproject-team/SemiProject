package com.twogap.project.follow.model.service;

import java.util.List;
import java.util.Map;

import com.twogap.project.member.model.dto.Member;

public interface FollowService {

	/** keyword를 사용하여 해당 글자가 포함 되는 유저 검색하기
	 * @param loginMember
	 * @param keyword
	 * @return
	 * @author 신동국
	 */
	List<Member> searchMember(Member loginMember, String keyword);

	/** loginMember와 memberNo를 활용하여 일치하는 컬럼 줄 삭제
	 * @param loginMember
	 * @param memberno
	 * @return
	 * @author 신동국
	 */
	int unFollow(Member loginMember, int memberNo);

	/** loginMember와 memberNo를 활용하여 일치하는 컬럼 줄 추가
	 * @param loginMember
	 * @param memberNo
	 * @return
	 * @author 신동국
	 */
	int addFollow(Member loginMember, int memberNo);

	/** 팔로우 클릭 시 팔로우 관계 유저들 리스트 가져오기
	 * @param memberNo
	 * @return
	 */
	List<Member> selectList(int memberNo);

	/** 팔로우들 생일 얻어오기
	 * @param memberNo
	 * @return
	 */
	Map<String, String> birthdaySelect(int memberNo, int month);

}
