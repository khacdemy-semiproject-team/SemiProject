package com.twogap.project.visitor.model.service;

import java.util.List;
import java.util.Map;

import com.twogap.project.visitor.model.dto.Visitor;

public interface VisitorService {

	/** 방명록 리스트 가져오기
	 * @param memberNo
	 * @param cp
	 * @return
	 */
	Map<String, Object> selectList( int memberNo, int cp);

	/** 방명록 글 삽입하기
	 * @param visitor
	 * @return
	 */
	int visitorInsert(Visitor visitor);

	/** 방명록 글 수정하기
	 * @param visitor
	 * @return
	 */
	int visitorUpdate(Visitor visitor);

	/** 방명록 삭제하기
	 * @param visitorNo
	 * @return
	 */
	int visitorDelete(int visitorNo);

}
	