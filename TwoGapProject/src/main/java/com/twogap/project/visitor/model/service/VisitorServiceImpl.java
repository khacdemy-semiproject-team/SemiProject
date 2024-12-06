package com.twogap.project.visitor.model.service;

import org.springframework.stereotype.Service;

import com.twogap.project.visitor.model.mapper.VisitorMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VisitorServiceImpl implements VisitorService{
	private final VisitorMapper mapper;
}
