package com.cognizant.practice.blog.articles.repository;


import com.cognizant.practice.blog.articles.model.ArticleEntity;
import com.cognizant.practice.blog.users.model.UserDto;
import com.cognizant.practice.blog.users.model.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleEntity, UUID> {
    Page<ArticleEntity> findAllByTitle(String title, Pageable pageable);

    Page<ArticleEntity> findAllByAuthor(String author, Pageable pageable);

    Page<ArticleEntity> findAllByTitleAndAuthor(String title, String author, Pageable pageable);

    List<ArticleEntity> findByAuthorId(UUID authorId);

}
