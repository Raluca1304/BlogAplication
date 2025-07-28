package com.cognizant.practice.blog.comments.repository;

import com.cognizant.practice.blog.comments.model.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, UUID> {

    List<CommentEntity> findByArticleId(UUID articleId);
}
