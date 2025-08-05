package com.cognizant.practice.blog.users.model;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Data
@NoArgsConstructor
@Builder
public class UserDto {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private UUID id;

    private String username;

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private LocalDateTime createdDate;

    private String role;

    private List<ArticleDto> articles;

    public UserDto(UUID id, String username,  String firstName, String lastName, String email, String password, LocalDateTime createdDate, String role,
                   List<ArticleDto> articles ) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.createdDate = createdDate;
        this.role = role;
        this.articles = articles;
    }
}
