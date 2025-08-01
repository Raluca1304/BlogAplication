package com.cognizant.practice.blog.comments.controller;

import com.cognizant.practice.blog.comments.model.CommentDto;
import com.cognizant.practice.blog.comments.model.CommentRequest;
import com.cognizant.practice.blog.comments.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
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

    @GetMapping(value = "/comments")
    public List<CommentDto> getAllCommentsFromDatabase() {
        return commentService.getAllCommentsFromDatabase();
    }

    @PostMapping(value = "/articles/{id}/comments")
    public CommentDto createNewComment(@RequestBody CommentRequest commentRequest, @PathVariable UUID id, Principal principal) {
        if (commentRequest.text() == null || commentRequest.text().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        //verifyExistingCommentInArticle(id);
        return commentService.createNewComment(commentRequest, id, principal);
    }

    @GetMapping(value = "/comments/{commentId}")
    public CommentDto getCommentById(@PathVariable UUID commentId) {
        return commentService.getCommentById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
    }

    @PutMapping("/comments/{commentId}")
    public CommentDto updateComment(@PathVariable UUID commentId, @RequestBody CommentRequest commentRequest, Principal principal) {
        if (commentRequest.text() == null || commentRequest.text().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment text cannot be empty");
        }
        return commentService.updateComment(commentId, commentRequest, principal);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable UUID commentId, Principal principal) {
        commentService.deleteComment(commentId, principal);
        return ResponseEntity.ok().build();
    }
}
