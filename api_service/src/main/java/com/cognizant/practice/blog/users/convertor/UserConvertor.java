package com.cognizant.practice.blog.users.convertor;

import com.cognizant.practice.blog.articles.convertor.ArticleConvertor;
import com.cognizant.practice.blog.users.model.UserDto;
import com.cognizant.practice.blog.users.model.UserEntity;

import java.util.stream.Collectors;

public class UserConvertor {
    public static UserDto toDto(UserEntity userEntity) {
        return UserDto.builder()
                .email(userEntity.getEmail())
                .userName(userEntity.getUsername())
                .lastName(userEntity.getLastName())
                .password(userEntity.getPassword())
                .role(userEntity.getRole().name())
                .createdDate(userEntity.getCreatedDate())
                .id(userEntity.getId())
                .firstName(userEntity.getFirstName())
                .articles(
                        userEntity.getArticles().stream()
                                .map(ArticleConvertor::toDto)
                                .collect(Collectors.toList())
                )
                .build();
    }
}
