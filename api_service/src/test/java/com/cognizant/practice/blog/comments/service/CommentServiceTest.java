package com.cognizant.practice.blog.comments.service;

import com.cognizant.practice.blog.articles.model.ArticleEntity;
import com.cognizant.practice.blog.articles.repository.ArticleRepository;
import com.cognizant.practice.blog.comments.model.CommentDto;
import com.cognizant.practice.blog.comments.model.CommentEntity;
import com.cognizant.practice.blog.comments.model.CommentRequest;
import com.cognizant.practice.blog.comments.repository.CommentRepository;
import com.cognizant.practice.blog.users.model.UserEntity;
import com.cognizant.practice.blog.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    @Test
    void shouldCallRepositoryFindByIdWhenGettingComments() {
        CommentRepository mockCommentRepo = mock(CommentRepository.class);
        ArticleRepository mockArticleRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        CommentService service = new CommentService(mockCommentRepo, mockArticleRepo, mockUserRepo);

        UUID articleId = UUID.randomUUID();
        
        // Mock article with empty comments list to avoid entity issues
        ArticleEntity mockArticle = mock(ArticleEntity.class);
        when(mockArticle.getComments()).thenReturn(List.of());
        when(mockArticleRepo.findById(articleId)).thenReturn(Optional.of(mockArticle));

        List<CommentDto> result = service.getAllComments(articleId);

        verify(mockArticleRepo).findById(articleId);
        assertEquals(0, result.size());
    }

    @Test
    void shouldCallUserRepositoryFindByUsername() {
        CommentRepository mockCommentRepo = mock(CommentRepository.class);
        ArticleRepository mockArticleRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        CommentService service = new CommentService(mockCommentRepo, mockArticleRepo, mockUserRepo);

        when(mockUserRepo.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> 
            service.getUserFromUsername("testuser"));
        
        verify(mockUserRepo).findByUsername("testuser");
    }

    @Test
    void shouldGetUserFromUsernameWhenExists() {
        CommentRepository mockCommentRepo = mock(CommentRepository.class);
        ArticleRepository mockArticleRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        CommentService service = new CommentService(mockCommentRepo, mockArticleRepo, mockUserRepo);

        UserEntity mockUser = mock(UserEntity.class);
        when(mockUserRepo.findByUsername("testuser")).thenReturn(Optional.of(mockUser));

        UserEntity result = service.getUserFromUsername("testuser");

        assertEquals(mockUser, result);
        verify(mockUserRepo).findByUsername("testuser");
    }

    @Test
    void shouldGetPrincipalUser() {
        CommentRepository mockCommentRepo = mock(CommentRepository.class);
        ArticleRepository mockArticleRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        CommentService service = new CommentService(mockCommentRepo, mockArticleRepo, mockUserRepo);
        Principal mockPrincipal = mock(Principal.class);

        UserEntity mockUser = mock(UserEntity.class);
        when(mockPrincipal.getName()).thenReturn("testuser");
        when(mockUserRepo.findByUsername("testuser")).thenReturn(Optional.of(mockUser));

        UserEntity result = service.getPrincialUser(mockPrincipal);

        assertEquals(mockUser, result);
        verify(mockPrincipal).getName();
        verify(mockUserRepo).findByUsername("testuser");
    }

    @Test
    void shouldCallCommentRepositoryFindByIdWhenDeleting() {
        CommentRepository mockCommentRepo = mock(CommentRepository.class);
        ArticleRepository mockArticleRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        CommentService service = new CommentService(mockCommentRepo, mockArticleRepo, mockUserRepo);
        Principal mockPrincipal = mock(Principal.class);

        UUID articleId = UUID.randomUUID();
        UUID commentId = UUID.randomUUID();

        when(mockCommentRepo.findById(commentId)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> 
            service.deleteComment(articleId, commentId, mockPrincipal));
        
        verify(mockCommentRepo).findById(commentId);
    }

    @Test
    void shouldCallRepositorySaveWhenCreatingComment() {
        CommentRepository mockCommentRepo = mock(CommentRepository.class);
        ArticleRepository mockArticleRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        CommentService service = new CommentService(mockCommentRepo, mockArticleRepo, mockUserRepo);
        Principal mockPrincipal = mock(Principal.class);

        UUID articleId = UUID.randomUUID();
        CommentRequest request = new CommentRequest("Test comment");
        
        UserEntity mockUser = mock(UserEntity.class);
        ArticleEntity mockArticle = mock(ArticleEntity.class);
        CommentEntity mockSavedComment = mock(CommentEntity.class);

        when(mockPrincipal.getName()).thenReturn("testuser");
        when(mockUserRepo.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(mockArticleRepo.findById(articleId)).thenReturn(Optional.of(mockArticle));
        when(mockCommentRepo.save(any(CommentEntity.class))).thenReturn(mockSavedComment);

        // Mock the saved comment methods to avoid getter issues
        when(mockSavedComment.getId()).thenReturn(UUID.randomUUID());
        when(mockSavedComment.getText()).thenReturn("Test comment");
        when(mockSavedComment.getCreatedDate()).thenReturn(null);
        when(mockSavedComment.getAuthor()).thenReturn(mockUser);
        when(mockUser.getUsername()).thenReturn("testuser");

        CommentDto result = service.createNewComment(request, articleId, mockPrincipal);

        verify(mockCommentRepo).save(any(CommentEntity.class));
        assertNotNull(result);
    }
}