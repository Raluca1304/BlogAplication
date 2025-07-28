package com.cognizant.practice.blog.comments.controller;


import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleRequest;
import com.cognizant.practice.blog.comments.model.CommentDto;
import com.cognizant.practice.blog.comments.model.CommentEntity;
import com.cognizant.practice.blog.comments.model.CommentRequest;
import com.cognizant.practice.blog.comments.repository.CommentRepository;
import com.cognizant.practice.blog.comments.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class CommentsController {

    private final CommentService commentService;

    public CommentsController(CommentService commentService) {
        this.commentService = commentService;
    }

//   private CommentDto verifyExistingCommentInArticle(UUID id) {
//       return commentService.getAllComments(id)
//               .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
//   }

   @GetMapping(value = "/articles/{id}/comments")
   public List<CommentDto> getAllComments(@PathVariable UUID id) {
      // verifyExistingCommentInArticle(id);
       return commentService.getAllComments(id);
   }


    @PostMapping(value = "/articles/{id}/comments")
    public CommentDto createNewComment(@RequestBody CommentRequest commentRequest, @PathVariable UUID id, Principal principal) {
        if (commentRequest.text() == null || commentRequest.text().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        //verifyExistingCommentInArticle(id);
        return commentService.createNewComment(commentRequest, id, principal);
    }

    @DeleteMapping("/articles/{articleId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable UUID articleId, @PathVariable UUID commentId, Principal principal) {
        commentService.deleteComment(articleId, commentId, principal);
        return ResponseEntity.ok().build();
    }
}
