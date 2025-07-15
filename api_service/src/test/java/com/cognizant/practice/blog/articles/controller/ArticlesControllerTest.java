package com.cognizant.practice.blog.articles.controller;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleEntity;
import com.cognizant.practice.blog.articles.model.ArticleRequest;
import com.cognizant.practice.blog.articles.service.ArticleService;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ArticlesControllerTest {

    @Test
    void shouldReturnAllArticles() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);

        List<ArticleDto> article = List.of(new ArticleDto());

        when(mockService.getAllArticles()).thenReturn(article);

        List<ArticleDto> articleDtoList= articlesController.getAllArticles();
        assertEquals(article, articleDtoList);
    }

    @Test
    void shouldReturnArticleById() {

        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);

        UUID uuid = UUID.randomUUID();
        ArticleDto article = new ArticleDto();
        article.setId(uuid);

        when(mockService.getArticlesById(uuid)).thenReturn(Optional.of(article));

        ArticleDto articleDto = articlesController.getArticleById(uuid);
        assertEquals(uuid, articleDto.getId());
    }

    @Test
    void shouldReturnNotFound() {

        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);
        UUID uuid = UUID.randomUUID();

        when(mockService.getArticlesById(uuid)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, ()->articlesController.getArticleById(uuid));
    }

    @Test
    void shouldReturnBadRequest() {

        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);

        UUID id = UUID.randomUUID();
        ArticleRequest request = new ArticleRequest("", null);

        assertThrows(ResponseStatusException.class, () -> articlesController.updateArticle(request, id));
    }


    @Test
    void shouldDeleteArticleById() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);

        UUID uuid = UUID.randomUUID();

        ArticleDto article = new ArticleDto();
        when(mockService.getArticlesById(uuid)).thenReturn(Optional.of(article));
        articlesController.deleteArticleByID(uuid);
        verify(mockService).deleteArticleById(uuid);
    }

    @Test
    void shouldCreateNewArticle() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);

        ArticleRequest articleRequest = new ArticleRequest("Ziua 9", "Azi e greu");

        ArticleDto article = new ArticleDto();
        ArticleDto articleDto = new ArticleDto();
        article.setTitle("Ziua 9");
        article.setContent("Azi e greu");


        when(mockService.createNewArticles(articleRequest)).thenReturn(article);
        articleDto = articlesController.createNewArticles(articleRequest);
        assertEquals(articleRequest.content(), articleDto.getContent());
        assertEquals(articleRequest.title(), articleDto.getTitle());
    }

    @Test
    void shouldUpdateArticle() {
        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);

        ArticleRequest articleRequest = new ArticleRequest("Ziua 9", "Azi e greu");

        UUID uuid = UUID.randomUUID();

        ArticleDto article = new ArticleDto();
        ArticleDto articleDto = new ArticleDto();
        article.setTitle("Ziua 9");
        article.setContent("Azi e greu");

        when(mockService.getArticlesById(uuid)).thenReturn(Optional.of(article));
        when(mockService.updateArticle(articleRequest, uuid)).thenReturn(article);
        articleDto = articlesController.updateArticle(articleRequest, uuid);
        assertEquals(articleRequest.title(), articleDto.getTitle());
        assertEquals(articleRequest.content(), articleDto.getContent());
    }

}