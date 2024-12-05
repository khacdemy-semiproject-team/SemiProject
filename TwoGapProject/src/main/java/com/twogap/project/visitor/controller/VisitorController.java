package com.twogap.project.visitor.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.twogap.project.visitor.model.service.VisitorService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("visitor")
@Slf4j
@SessionAttributes({"loginMember"})
@RequiredArgsConstructor
public class VisitorController {
	
	public final VisitorService service;
	
	@GetMapping("main")
	public String visitorMain() {
		return "/boards/visitor";
	}
}
