package com.cognizant.practice.blog.articles.controller;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleRequest;
import com.cognizant.practice.blog.articles.service.ArticleService;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ArticlesControllerTest {

    @Test
    void shouldReturnAllArticles() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);

        List<ArticleDto> articles = List.of(new ArticleDto());

        when(mockService.getAllArticles()).thenReturn(articles);

        List<ArticleDto> result = articlesController.getArticles(null);
        
        assertEquals(articles, result);
        verify(mockService).getAllArticles();
    }

    @Test
    void shouldReturnArticlesByAuthorId() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);

        UUID authorId = UUID.randomUUID();
        List<ArticleDto> articles = List.of(new ArticleDto());

        when(mockService.getArticlesByAuthorId(authorId)).thenReturn(articles);

        List<ArticleDto> result = articlesController.getArticles(authorId);
        
        assertEquals(articles, result);
        verify(mockService).getArticlesByAuthorId(authorId);
    }

    @Test
    void shouldReturnArticleById() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);

        UUID uuid = UUID.randomUUID();
        ArticleDto article = new ArticleDto();

        when(mockService.getArticlesById(uuid)).thenReturn(Optional.of(article));

        ArticleDto result = articlesController.getArticleById(uuid);
        
        assertEquals(article, result);
        verify(mockService, times(2)).getArticlesById(uuid); // Called twice: once in verifyExistingArticle, once in getArticleById
    }

    @Test
    void shouldThrowNotFoundWhenArticleDoesNotExist() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);
        UUID uuid = UUID.randomUUID();

        when(mockService.getArticlesById(uuid)).thenReturn(Optional.empty());
        
        assertThrows(ResponseStatusException.class, () -> articlesController.getArticleById(uuid));
        verify(mockService).getArticlesById(uuid);
    }

    @Test
    void shouldThrowBadRequestWhenUpdatingWithNullTitle() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);
        Principal mockPrincipal = mock(Principal.class);

        UUID id = UUID.randomUUID();
        ArticleRequest request = new ArticleRequest(null, "content");

        assertThrows(ResponseStatusException.class, () -> 
            articlesController.updateArticle(request, id, mockPrincipal));
    }

    @Test
    void shouldThrowBadRequestWhenUpdatingWithEmptyTitle() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);
        Principal mockPrincipal = mock(Principal.class);

        UUID id = UUID.randomUUID();
        ArticleRequest request = new ArticleRequest("", "content");

        assertThrows(ResponseStatusException.class, () -> 
            articlesController.updateArticle(request, id, mockPrincipal));
    }

    @Test
    void shouldDeleteArticleById() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);

        UUID uuid = UUID.randomUUID();
        ArticleDto article = new ArticleDto();
        
        when(mockService.getArticlesById(uuid)).thenReturn(Optional.of(article));
        
        articlesController.deleteArticleByID(uuid);
        
        verify(mockService).getArticlesById(uuid);
        verify(mockService).deleteArticleById(uuid);
    }

    @Test
    void shouldCreateNewArticle() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);
        Principal mockPrincipal = mock(Principal.class);

        ArticleRequest articleRequest = new ArticleRequest("Test Title", "Test Content");
        ArticleDto expectedArticle = new ArticleDto();

        when(mockService.createNewArticles(articleRequest, mockPrincipal)).thenReturn(expectedArticle);
        
        ArticleDto result = articlesController.createNewArticles(articleRequest, mockPrincipal);
        
        assertEquals(expectedArticle, result);
        verify(mockService).createNewArticles(articleRequest, mockPrincipal);
    }

    @Test
    void shouldUpdateArticle() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);
        Principal mockPrincipal = mock(Principal.class);

        ArticleRequest articleRequest = new ArticleRequest("Updated Title", "Updated Content");
        UUID uuid = UUID.randomUUID();

        ArticleDto existingArticle = new ArticleDto();
        ArticleDto updatedArticle = new ArticleDto();

        when(mockService.getArticlesById(uuid)).thenReturn(Optional.of(existingArticle));
        when(mockService.updateArticle(articleRequest, uuid, mockPrincipal)).thenReturn(updatedArticle);
        
        ArticleDto result = articlesController.updateArticle(articleRequest, uuid, mockPrincipal);
        
        assertEquals(updatedArticle, result);
        verify(mockService).getArticlesById(uuid);
        verify(mockService).updateArticle(articleRequest, uuid, mockPrincipal);
    }
}