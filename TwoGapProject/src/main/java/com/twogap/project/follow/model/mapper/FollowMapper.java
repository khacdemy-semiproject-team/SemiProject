package com.twogap.project.follow.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.twogap.project.member.model.dto.Member;

@Mapper
public interface FollowMapper {
	

	/** 팔로우들 얻어오기
	 * @param memberNo
	 * @return
	 */
	List<Member> selectList(int memberNo);

	/** 닉네임으로 유저 검색
	 * @param map
	 * @return
	 */
	List<Member> searchMember(Map<String, Object> map);

	/** 팔로우 해제
	 * @param map
	 * @return
	 */
	int unFollow(Map<String, Integer> map);

	/** 팔로우 추가
	 * @param map
	 * @return
	 */
	int addFollow(Map<String, Integer> map);

	/** 팔로우 생일 추가하기
	 * @param map 
	 * @param memberNo
	 * @return
	 */
	List<Map<String, Object>> birthdaySelect(Map<String, Integer> map);


}
