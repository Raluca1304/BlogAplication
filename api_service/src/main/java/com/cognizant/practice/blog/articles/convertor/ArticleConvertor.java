package com.cognizant.practice.blog.articles.convertor;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleEntity;
import com.cognizant.practice.blog.users.convertor.UserConvertor;

public class ArticleConvertor {
    public static ArticleDto toDto(ArticleEntity entity) {
        ArticleDto dto = new ArticleDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setSummary(entity.getSummmary());
        dto.setCreatedDate(entity.getCreatedDate());
        dto.setUpdatedDate(entity.getUpdatedDate());

//        dto.setAuthor(UserConvertor.toDto(entity.getAuthor()));
        return dto;
    }
}