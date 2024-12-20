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

	// 유저 검색하기
	@Override
	public List<Member> searchMember(Member loginMember, String keyword) {

		Map<String, Object> map = new HashMap<>();
		map.put("memberNo", loginMember.getMemberNo());
		map.put("keyword", "%");
		
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
	
	@Override
	public int addFollow(Member loginMember, int memberNo) {
		// TODO Auto-generated method stub
		return 0;
	}
	
}
