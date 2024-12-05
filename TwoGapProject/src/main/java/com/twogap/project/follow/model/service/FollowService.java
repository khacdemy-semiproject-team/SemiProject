package com.twogap.project.follow.model.service;

import java.util.List;

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
	 */
	int unFollow(Member loginMember, int memberNo);

	int addFollow(Member loginMember, int memberNo);

}
