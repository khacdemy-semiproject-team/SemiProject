package com.twogap.project.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.MultipartConfigElement;

@Configuration
@PropertySource("classpath:/config.properties")
public class FileConfig implements WebMvcConfigurer{
   

   // 파일 업로드 임계값
   @Value("${spring.servlet.multipart.file-size-threshold}")
   private long fileSizeThreshold;
   
   // HTTP 요청 당 파일 최대 크기
   @Value("${spring.servlet.multipart.max-request-size}")
   private long maxRequestSize;
   
   // 개별 파일당 최대 크기
   @Value("${spring.servlet.multipart.max-file-size}")
   private long maxFileSize;

   // 임계값 초과 시 파일의 임시 저장 경로
   @Value("${spring.servlet.multipart.location}")
   private String location;
   
   
   
   // 프로필 이미지 관련 경로
   @Value("${my.profile.resource-handler}")
   private String profileResourcehandler;
   
   @Value("${my.profile.resource-location}")
   private String profileResourceLocation;

	
	// 메모장 이미지 관련 경로
	@Value("${my.memo.resource-handler}")
	private String memoResourceHandler;

	@Value("${my.memo.resource-location}")
	private String memoResourceLocation;
	
	
	// 사진첩 이미지 관련 경로
	@Value("${my.gallery.resource-handler}")
	private String galleryResourceHandler;

	@Value("${my.gallery.resource-location}")
	private String galleryResourceLocation;
	
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// TODO Auto-generated method stub
		
		registry.addResourceHandler(profileResourcehandler)
		.addResourceLocations(profileResourceLocation);
		
		registry.addResourceHandler(galleryResourceHandler)
		.addResourceLocations(galleryResourceLocation);
		
		registry.addResourceHandler(memoResourceHandler)
		.addResourceLocations(memoResourceLocation);
	}
	
	@Bean
	public MultipartConfigElement configElement() {
		
		MultipartConfigFactory factory = new MultipartConfigFactory();
		
		// 파일 업로드 임계값
		factory.setFileSizeThreshold(DataSize.ofBytes(fileSizeThreshold));
		
		// 개별 파일당 최대 크기
		factory.setMaxFileSize(DataSize.ofBytes(maxFileSize));
		
		// HTTP 요청당 파일 최대 크기
		factory.setMaxRequestSize(DataSize.ofBytes(maxRequestSize));
		
		// 임계값 초과 시 임시 저장 폴더 경로
		factory.setLocation(location);
		
		return factory.createMultipartConfig();
	}
	
	@Bean
	public MultipartResolver multipartResolver() {
		
		StandardServletMultipartResolver multipartResolver
			= new StandardServletMultipartResolver();
		
		return multipartResolver;
	}

}
