package com.cognizant.practice.blog.comments.service;

import com.cognizant.practice.blog.articles.repository.ArticleRepository;
import com.cognizant.practice.blog.comments.model.CommentDto;
import com.cognizant.practice.blog.comments.model.CommentEntity;
import com.cognizant.practice.blog.comments.model.CommentRequest;
import com.cognizant.practice.blog.comments.repository.CommentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentService {

    public CommentRepository commentRepository;
    public ArticleRepository articleRepository;

    public CommentService(CommentRepository commentRepository, ArticleRepository articleRepository) {
        this.commentRepository = commentRepository;
        this.articleRepository = articleRepository;
    }

    public Optional<CommentDto> getAllComments(UUID id) {
        return articleRepository.findById(id).map(commentEntity -> new CommentDto(
                commentEntity.getId(),
                commentEntity.getContent(),
                commentEntity.getCreatedDate()
        ));
    }

    public CommentDto createNewComment(CommentRequest commentRequest, UUID id) {
        CommentEntity newComment = new CommentEntity(null, commentRequest.text(), LocalDateTime.now(),
                articleRepository.findById(id).get());
        CommentEntity savedComment = commentRepository.save(newComment);
        return new CommentDto(
                savedComment.getId(),
                savedComment.getText(),
                savedComment.getCreatedDate()
        );
    }

}
