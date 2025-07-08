package com.cognizant.practice.blog.comments.controller;


import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleRequest;
import com.cognizant.practice.blog.comments.model.CommentDto;
import com.cognizant.practice.blog.comments.model.CommentEntity;
import com.cognizant.practice.blog.comments.model.CommentRequest;
import com.cognizant.practice.blog.comments.repository.CommentRepository;
import com.cognizant.practice.blog.comments.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class CommentsController {

    private final CommentService commentService;

    public CommentsController(CommentService commentService) {
        this.commentService = commentService;
    }

    private CommentDto verifyExistingArticle(UUID id) {
        return commentService.getAllComments(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @GetMapping(value = "/articles/{id}/comments")
    public Optional<CommentDto> getAllComments(@PathVariable UUID id) {
        verifyExistingArticle(id);
        return commentService.getAllComments(id);
    }


    @PostMapping(value = "/articles/{id}/comments")
    public CommentDto createNewComment(@RequestBody CommentRequest commentRequest, @PathVariable UUID id) {
        if (commentRequest.text() == null || commentRequest.text().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        verifyExistingArticle(id);
        return commentService.createNewComment(commentRequest, id);
    }
}
