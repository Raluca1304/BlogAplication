package com.cognizant.practice.blog.comments.controller;

import com.cognizant.practice.blog.comments.model.CommentDto;
import com.cognizant.practice.blog.comments.model.CommentRequest;
import com.cognizant.practice.blog.comments.service.CommentService;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentsControllerTest {

    @Test
    void shouldThrowBadRequestWhenCommentTextIsNull() {
        CommentService mockService = mock(CommentService.class);
        CommentsController commentsController = new CommentsController(mockService);
        Principal mockPrincipal = mock(Principal.class);

        UUID uuid = UUID.randomUUID();
        CommentRequest request = new CommentRequest(null);

        assertThrows(ResponseStatusException.class, () -> 
            commentsController.createNewComment(request, uuid, mockPrincipal));
    }

    @Test
    void shouldThrowBadRequestWhenCommentTextIsEmpty() {
        CommentService mockService = mock(CommentService.class);
        CommentsController commentsController = new CommentsController(mockService);
        Principal mockPrincipal = mock(Principal.class);

        UUID uuid = UUID.randomUUID();
        CommentRequest request = new CommentRequest("");

        assertThrows(ResponseStatusException.class, () -> 
            commentsController.createNewComment(request, uuid, mockPrincipal));
    }

    @Test
    void shouldGetAllCommentsByArticleId() {
        CommentService mockService = mock(CommentService.class);
        CommentsController commentsController = new CommentsController(mockService);
        
        CommentDto comment1 = new CommentDto();
        CommentDto comment2 = new CommentDto();
        List<CommentDto> comments = List.of(comment1, comment2);

        UUID articleId = UUID.randomUUID();

        when(mockService.getAllComments(articleId)).thenReturn(comments);
        
        List<CommentDto> result = commentsController.getAllComments(articleId);
        
        assertEquals(comments, result);
        assertEquals(2, result.size());
    }

    @Test
    void shouldCreateNewComment() {
        CommentService mockService = mock(CommentService.class);
        CommentsController commentsController = new CommentsController(mockService);
        Principal mockPrincipal = mock(Principal.class);

        CommentRequest commentRequest = new CommentRequest("This is a new comment");
        UUID articleId = UUID.randomUUID();

        CommentDto expectedComment = new CommentDto();
        expectedComment.setText("This is a new comment");

        when(mockService.createNewComment(commentRequest, articleId, mockPrincipal))
            .thenReturn(expectedComment);
        
        CommentDto result = commentsController.createNewComment(commentRequest, articleId, mockPrincipal);

        assertEquals(commentRequest.text(), result.getText());
        verify(mockService).createNewComment(commentRequest, articleId, mockPrincipal);
    }

    @Test
    void shouldDeleteComment() {
        CommentService mockService = mock(CommentService.class);
        CommentsController commentsController = new CommentsController(mockService);
        Principal mockPrincipal = mock(Principal.class);

        UUID articleId = UUID.randomUUID();
        UUID commentId = UUID.randomUUID();

        // The deleteComment method doesn't return anything, so we just verify it was called
        doNothing().when(mockService).deleteComment(articleId, commentId, mockPrincipal);

        assertDoesNotThrow(() -> 
            commentsController.deleteComment(articleId, commentId, mockPrincipal));
        
        verify(mockService).deleteComment(articleId, commentId, mockPrincipal);
    }
}