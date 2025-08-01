package com.cognizant.practice.blog.users.convertor;

import com.cognizant.practice.blog.articles.convertor.ArticleConvertor;
import com.cognizant.practice.blog.users.model.UserDto;
import com.cognizant.practice.blog.users.model.UserEntity;

import java.util.stream.Collectors;

public class UserConvertor {
    public static UserDto toDto(UserEntity userEntity) {
        return UserDto.builder()
                .id(userEntity.getId())
                .username(userEntity.getUsername())
                .firstName(userEntity.getFirstName())
                .lastName(userEntity.getLastName())
                .email(userEntity.getEmail())
                .password(userEntity.getPassword())
                .createdDate(userEntity.getCreatedDate())
                .role(userEntity.getRole().name())
                .articles(
                        userEntity.getArticles().stream()
                                .map(ArticleConvertor::toDto)
                                .collect(Collectors.toList())
                )
                .build();
    }
}
