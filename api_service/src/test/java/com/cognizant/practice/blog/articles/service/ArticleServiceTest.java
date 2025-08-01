package com.cognizant.practice.blog.articles.service;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleEntity;
import com.cognizant.practice.blog.articles.model.ArticleRequest;
import com.cognizant.practice.blog.articles.repository.ArticleRepository;
import com.cognizant.practice.blog.users.model.UserEntity;
import com.cognizant.practice.blog.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ArticleServiceTest {

    @Test
    void shouldCallRepositoryFindAll() {
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        ArticleService articleService = new ArticleService(mockRepo, mockUserRepo);

        // Mock empty list to avoid entity mapping issues
        when(mockRepo.findAll()).thenReturn(List.of());

        List<ArticleDto> result = articleService.getAllArticles();

        verify(mockRepo).findAll();
        assertEquals(0, result.size());
    }

    @Test
    void shouldCallRepositoryFindById() {
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        ArticleService service = new ArticleService(mockRepo, mockUserRepo);

        UUID id = UUID.randomUUID();
        when(mockRepo.findById(id)).thenReturn(Optional.empty());

        Optional<ArticleDto> result = service.getArticlesById(id);

        verify(mockRepo).findById(id);
        assertTrue(result.isEmpty());
    }

    @Test
    void shouldCallRepositoryDeleteById() {
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        ArticleService service = new ArticleService(mockRepo, mockUserRepo);

        UUID id = UUID.randomUUID();

        service.deleteArticleById(id);
        
        verify(mockRepo).deleteById(id);
    }

    @Test
    void shouldCallRepositoryFindByAuthorId() {
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        ArticleService service = new ArticleService(mockRepo, mockUserRepo);

        UUID authorId = UUID.randomUUID();
        when(mockRepo.findByAuthorId(authorId)).thenReturn(List.of());

        List<ArticleDto> result = service.getArticlesByAuthorId(authorId);

        verify(mockRepo).findByAuthorId(authorId);
        assertEquals(0, result.size());
    }

    @Test
    void shouldCallUserRepositoryFindByUsername() {
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        ArticleService service = new ArticleService(mockRepo, mockUserRepo);

        when(mockUserRepo.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> service.getUserFromUsername("testuser"));
        
        verify(mockUserRepo).findByUsername("testuser");
    }

    @Test
    void shouldGetUserFromUsernameWhenExists() {
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        ArticleService service = new ArticleService(mockRepo, mockUserRepo);

        UserEntity mockUser = Mockito.mock(UserEntity.class);
        when(mockUserRepo.findByUsername("testuser")).thenReturn(Optional.of(mockUser));

        UserEntity result = service.getUserFromUsername("testuser");

        assertEquals(mockUser, result);
        verify(mockUserRepo).findByUsername("testuser");
    }

    @Test
    void shouldGetPrincipalUser() {
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        UserRepository mockUserRepo = mock(UserRepository.class);
        ArticleService service = new ArticleService(mockRepo, mockUserRepo);
        Principal mockPrincipal = mock(Principal.class);

        UserEntity mockUser = Mockito.mock(UserEntity.class);
        when(mockPrincipal.getName()).thenReturn("testuser");
        when(mockUserRepo.findByUsername("testuser")).thenReturn(Optional.of(mockUser));

        UserEntity result = service.getPrincialUser(mockPrincipal);

        assertEquals(mockUser, result);
        verify(mockPrincipal).getName();
        verify(mockUserRepo).findByUsername("testuser");
    }
}