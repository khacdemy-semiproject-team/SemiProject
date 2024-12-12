package com.twogap.project.follow.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.twogap.project.follow.model.mapper.FollowMapper;
import com.twogap.project.member.model.dto.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional()
public class FollowServiceImpl implements FollowService{
	
	private final FollowMapper mapper;
	
	@Override
	public List<Member> selectList(int memberNo) {
		// TODO Auto-generated method stub
		return mapper.selectList(memberNo);
	}

	// 유저 검색하기
	@Override
	public List<Member> searchMember(Member loginMember, String keyword) {

		Map<String, Object> map = new HashMap<>();
		map.put("memberNo", loginMember.getMemberNo());
		map.put("keyword", keyword);
		
		return mapper.searchMember(map);
	}
	
	// 팔로우 해제하기
	@Override
	public int unFollow(Member loginMember, int memberNo) {
		
		Map<String, Integer> map = new HashMap<>();
		
		map.put("followNo", loginMember.getMemberNo());
		map.put("follwingNo", memberNo);
		
		return mapper.unFollow(map);
	}
	
	// 팔로우 추가하기
	@Override
	public int addFollow(Member loginMember, int memberNo) {
		Map<String, Integer> map = new HashMap<>();
		
		map.put("followNo", loginMember.getMemberNo());
		map.put("follwingNo", memberNo);
		
		return mapper.addFollow(map);
	}
	
	// 팔로우 생일얻기
	@Override
	public Map<String, String> birthdaySelect(int memberNo, int month) {
		
		Map<String, Integer> map = new HashMap<>();
		
		map.put("memberNo", memberNo);
		map.put("month", month);
		
		List<Map<String, Object>> birthdayList = mapper.birthdaySelect(map);
		
		Map<String, String> result = new HashMap<>();
		
		for ( Map<String, Object> resultMap : birthdayList) {
			
			String birthday = String.valueOf(resultMap.get("birthDay"));
			
			String memberNickname = result.get(birthday) == null ? String.valueOf(resultMap.get("memberNickname")) : 
								result.get(birthday) + ", " + String.valueOf(resultMap.get("memberNickname"));
			
			result.put(birthday, memberNickname);
		}
		// TODO Auto-generated method stub
		return result;
	}
	
}
