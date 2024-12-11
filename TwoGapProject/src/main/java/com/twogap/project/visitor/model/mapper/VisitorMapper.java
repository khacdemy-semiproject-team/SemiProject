package com.twogap.project.visitor.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.twogap.project.note.model.dto.Note;
import com.twogap.project.visitor.model.dto.Visitor;

@Mapper
public interface VisitorMapper {
	
	
	/** 방명록 갯수 카운트
	 * @param memberNo
	 * @return
	 */
	int getVisitorListCount(int memberNo);

	/** 방명록 목록 가져오기
	 * @param memberNo
	 * @return
	 */
	List<Visitor> selectList(int memberNo, RowBounds rowBounds);

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

	/** 방명록 글 삭제하기
	 * @param visitorNo
	 * @return
	 */
	int visitorDelete(int visitorNo);

}
