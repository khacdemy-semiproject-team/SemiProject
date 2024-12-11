package com.twogap.project.visitor.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.twogap.project.boards.model.dto.Pagination;
import com.twogap.project.note.model.dto.Note;
import com.twogap.project.visitor.model.dto.Visitor;
import com.twogap.project.visitor.model.mapper.VisitorMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(rollbackFor=Exception.class)
public class VisitorServiceImpl implements VisitorService{
	private final VisitorMapper mapper;
	
	// 방명록 가져오기
	@Override
	public Map<String, Object> selectList( int memberNo, int cp) {
		// 게시글 수 가져오기
		int listCount = mapper.getVisitorListCount(memberNo);
		
		// 페이지 네이션 작업 - 방명록은 10개 표시
		Pagination pagination = new Pagination(cp, listCount, 10);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		// noteList 가져오기
		List<Visitor> visitorList = mapper.selectList(memberNo, rowBounds);
		
		// 목록 조회 결과
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("visitorList", visitorList);
		
		log.debug("pagination :" + pagination );
		log.debug("visitorList :" + visitorList );
		return map;
	}
	
	
	// 방명록 글 삽입하기
	@Override
	public int visitorInsert(Visitor visitor) {
		return mapper.visitorInsert(visitor);
	}
	
	// 방명록 글 삽입하기
	@Override
	public int visitorUpdate(Visitor visitor) {
		// TODO Auto-generated method stub
		return mapper.visitorUpdate(visitor);
	}
	
	// 방명록 글 삭제하기
	@Override
	public int visitorDelete(int visitorNo) {
		return mapper.visitorDelete(visitorNo);
	}
}
