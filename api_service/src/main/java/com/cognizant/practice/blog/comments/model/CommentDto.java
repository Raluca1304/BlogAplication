package com.cognizant.practice.blog.comments.model;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleEntity;
import com.cognizant.practice.blog.users.model.UserEntity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String text;

    private LocalDateTime createdDate;

    private String authorName;

    private ArticleDto article;
}
