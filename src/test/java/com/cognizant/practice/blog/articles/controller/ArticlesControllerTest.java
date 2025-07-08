package com.cognizant.practice.blog.articles.controller;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.service.ArticleService;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import javax.swing.text.html.Option;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ArticlesControllerTest {

    // happy path
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
    void shouldReturnThrow() {

        ArticleService mockService = mock(ArticleService.class);
        ArticlesController articlesController = new ArticlesController(mockService);
        UUID uuid = UUID.randomUUID();

        when(mockService.getArticlesById(uuid)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, ()->articlesController.getArticleById(uuid));
    }
}