package com.twogap.project.email.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.twogap.project.email.mapper.EmailMapper;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
	
	private final EmailMapper mapper;
	private final JavaMailSender mailSender;
	private final SpringTemplateEngine templateEngine;

	// 이메일 전송
	@Override
	public String sendEmail(String htmlName, String email) {
		
		// 인증키 생성
		String authKey = createAuthKey();
		
		Map<String, String> map = new HashMap<>();
		map.put("authKey", authKey);
		map.put("email", email);

		// DB 저장 실패 시 해당 메서드 종료
		if(!storeAuthKey(map)) {
			return null; 
		}
		
		// DB 저장 성공 시 메일 발송 시도
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		log.debug("authKey : " + authKey);
//		
		try {
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
			helper.setTo(email); // 받는 사람 (수신자)
			helper.setSubject("[boardProject] 회원가입 인증번호 입니다."); // 메일 전송 시 제목
			helper.setText(loadHtml(authKey, htmlName), true);
			helper.addInline("logo", new ClassPathResource("static/images/twogap.jpg"));  
			
			
			mailSender.send(mimeMessage);
			return authKey; // 모든 작업 성공 시 Controller 쪽으로 인증키 반환
			
		} catch (Exception e) {
			e.printStackTrace();
			return null; // 메일 발송 실패 시 null 반환
		}

	}

	// HTML 템플릿에 데이터 바인딩하여 최종 HTML 생성하는 메서드
	private String loadHtml(String authKey, String htmlName) {
		
		Context context = new Context();
		context.setVariable("authKey", authKey);

		return templateEngine.process("email/" + htmlName, context);
	}

	// 인증키, 이메일 DB에 저장
	
	@Transactional(rollbackFor = Exception.class)
	private boolean storeAuthKey(Map<String, String> map) {
		
		int result = mapper.updateAuthKey(map);
		
		if(result == 0) {
			result = mapper.insertAuthKey(map);
		}
		
		return result > 0;
	}

	// 인증번호 발급 
	private String createAuthKey() {
		return UUID.randomUUID().toString().substring(0, 6);

	}

	// 입력받은 이메일, 인증번호 DB에 있는지 조회
	@Override
	public int checkAuthKey(Map<String, String> map) {
		return mapper.checkAuthKey(map);
	}

}
