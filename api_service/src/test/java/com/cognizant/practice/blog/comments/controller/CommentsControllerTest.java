package com.cognizant.practice.blog.comments.controller;

import com.cognizant.practice.blog.articles.controller.ArticlesController;
import com.cognizant.practice.blog.articles.model.ArticleRequest;
import com.cognizant.practice.blog.articles.service.ArticleService;
import com.cognizant.practice.blog.comments.model.CommentDto;
import com.cognizant.practice.blog.comments.model.CommentRequest;
import com.cognizant.practice.blog.comments.service.CommentService;
import com.cognizant.practice.blog.users.model.UserDto;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CommentsControllerTest {

    @Test
    void shouldReturnNotFound() {

        CommentService mockService = mock(CommentService.class);
        CommentsController commentsController = new CommentsController(mockService);
        UUID uuid = UUID.randomUUID();

        when(mockService.getAllComments(uuid)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, ()->commentsController.getAllComments(uuid));
    }

    @Test
    void shouldReturnBadRequest() {

        CommentService mockService = mock(CommentService.class);
        CommentsController commentsController = new CommentsController(mockService);

        UUID uuid = UUID.randomUUID();
        CommentRequest request = new CommentRequest(null);

        assertThrows(ResponseStatusException.class, () -> commentsController.createNewComment(request, uuid));
    }


    @Test
    void shouldGetAllCommandsById() {
        CommentService mockService = mock(CommentService.class);
        CommentsController commentsController = new CommentsController(mockService);
        Optional<CommentDto> comment = Optional.of(new CommentDto());

        UUID uuid = UUID.randomUUID();

        when (mockService.getAllComments(uuid)).thenReturn(comment);
        Optional<CommentDto> optionalCommentDto = commentsController.getAllComments(uuid);
        assertEquals(comment, optionalCommentDto);
    }

    @Test
    void shouldCreateNewComment() {
        CommentService mockService = mock(CommentService.class);
        CommentsController commentsController = new CommentsController((mockService));

        CommentRequest commentRequest = new CommentRequest("newComment");

        CommentDto commentDto = new CommentDto();
        CommentDto commentDto1 = new CommentDto();
        commentDto.setText("newComment");

        UUID uuid = UUID.randomUUID();

        when(mockService.getAllComments(uuid)).thenReturn(Optional.of(commentDto));
        when(mockService.createNewComment(commentRequest, uuid)).thenReturn(commentDto);
        commentDto1 = commentsController.createNewComment(commentRequest, uuid);

        assertEquals(commentRequest.text(), commentDto1.getText());
    }

}