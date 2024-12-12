package com.twogap.project.boards.model.service;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.twogap.project.boards.model.mapper.BoardsMapper;
import com.twogap.project.common.util.Utility;
import com.twogap.project.member.model.dto.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(rollbackFor=Exception.class) 
public class BoardsServiceImpl implements BoardsService {

	private final BoardsMapper mapper;

	@Value("${my.profile.web-path}")
	private String profileWebPath; // /myPage/profile/

	@Value("${my.profile.folder-path}")
	private String profileFolderPath; // C:/uploadFiles/profile/

	@Override
	public String viewAlert(int memberNo) {
		return mapper.viewAlert(memberNo);
	}

	@Override
	public int alertUpdate(Member member) {

		int result = mapper.updateAlert(member);

		log.debug(member.getAlertContent());

		if (result == 0) {
			result = mapper.insertAlert(member);
		}

		return result;
	}

	// 닉네임 중복검사
	@Override
	public int checkNickname(String memberNickname) {
		return mapper.checkNickname(memberNickname);
	}

	// 프로필 변경사항 제출
	@Override
	public int application(Member loginMember, MultipartFile imageInput, int status) throws Exception {

		
		// 프로필 이미지 경로 (수정할 경로)
		String updatePath = null;
		int result = 1;

		// 변경명 저장
		String rename = null;
		
		// 업로드한 이미지가 있을 경우
		// - 있을 경우 : 경로 조합 (클라이언트 접근 경로 + 리네임파일명)
		if (!imageInput.isEmpty()) {
			// updatePath 경로 조합

			// 1. 파일명 변경
			rename = Utility.fileRename(imageInput.getOriginalFilename());

			// 2. /myPage/profile/변경된파일명
			updatePath = profileWebPath + rename;
			
			loginMember.setProfileImg(updatePath);
			result = mapper.profileImageUpdate(loginMember); 
			
		} else if(status == 0) { // 삭제 버튼 눌렀을 경우
			loginMember.setProfileImg(null);
			result = mapper.profileImageUpdate(loginMember); 
		}
		
		

		// else{} // 변경 X, 삭제 X -> mapper 호출 안함!!!
		
		if(result == 0) {
			throw new Exception();
		}

		// UPDATE 수행
		result = mapper.application(loginMember);

		if (result > 0) { // DB에 수정 성공

			// 프로필 이미지를 없앤 경우(NULL로 수정한 경우)를 제외
			// -> 업로드한 이미지가 있을 경우
			if (!imageInput.isEmpty()) {
				// 파일을 서버 지정된 폴더에 저장
				imageInput.transferTo(new File(profileFolderPath + rename));
				// C:/uploadFiles/profile/변경한이름
			}

			// 세션 회원 정보에서 프로필 이미지 경로를
			// 업데이트한 경로로 변경

		}

		return result;
	}

	// 사용자 조회
	@Override
	public Member infoMember(int memberNo) {

		return mapper.infoMember(memberNo);
	}

	// 회원탈퇴
	@Override
	public int signOut(int memberNo) {
	
		return mapper.signOut(memberNo);
	}

}
