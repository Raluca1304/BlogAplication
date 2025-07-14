package com.cognizant.practice.blog.articles.service;

import com.cognizant.practice.blog.articles.controller.ArticlesController;
import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleEntity;
import com.cognizant.practice.blog.articles.model.ArticleRequest;
import com.cognizant.practice.blog.articles.repository.ArticleRepository;
import net.bytebuddy.dynamic.DynamicType;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.Test;

import javax.swing.text.html.Option;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

class ArticleServiceTest {

    @Test
    void shouldReturnAllArticlesAsDtoList() {

        ArticleRepository mockRepo = mock(ArticleRepository.class);
        ArticleService articleService = new ArticleService(mockRepo);

        ArticleEntity article1 = new ArticleEntity();

        List<ArticleEntity> articles = List.of(article1);

        when(mockRepo.findAll()).thenReturn(articles);

        List<ArticleDto> result = articleService.getAllArticles();

        assertEquals(article1.getTitle(), result.get(0).getTitle());
    }

    @Test
    void shouldGetArticle() {
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        ArticleService articleService = new ArticleService(mockRepo);

        ArticleDto article = new ArticleDto();
        List<ArticleDto> articles = List.of(article);

        articles = articleService.getAllArticles();
    }

    @Test
    void shouldReturnArticleDtoWhenArticleExists() {
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        ArticleService service = new ArticleService(mockRepo);

        UUID id = UUID.randomUUID();

        ArticleEntity entity = new ArticleEntity();
        entity.setId(id);
        entity.setTitle("Test");
        entity.setContent("Content test");

        when(mockRepo.findById(id)).thenReturn(Optional.of(entity));

        Optional<ArticleDto> result = service.getArticlesById(id);

        assertEquals("Test", result.get().getTitle());
        assertEquals("Content test", result.get().getContent());
    }

    @Test
    void shouldDeleteArticleById() {
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        ArticleService service = new ArticleService(mockRepo);

        UUID id = UUID.randomUUID();

        service.getArticlesById(id);
        service.deleteArticleById(id);
        verify(service).deleteArticleById(id);
    }

    @Test
    void shouldCreateAndReturnArticleDto() {

        ArticleRepository mockRepo = mock(ArticleRepository.class);
        ArticleService service = new ArticleService(mockRepo);

        ArticleRequest request = new ArticleRequest("title", "content");

        LocalDateTime now = LocalDateTime.now();
        ArticleEntity savedEntity = new ArticleEntity(
                UUID.randomUUID(),
                request.title(),
                request.content(),
                now,
                now
        );

        when(mockRepo.save(any(ArticleEntity.class))).thenReturn(savedEntity);
        ArticleDto result = service.createNewArticles(request);

        assertEquals(request.content(), result.getContent());
        assertEquals(request.content(), result.getContent());
    }
    @Test
    void shouldUpdateArticleCorrectly() {
        // Arrange
        ArticleRepository mockRepo = mock(ArticleRepository.class);
        ArticleService service = new ArticleService(mockRepo);

        UUID id = UUID.randomUUID();

        ArticleRequest request = new ArticleRequest("Nou Titlu", "Nou Cont");

        ArticleEntity existingArticle = new ArticleEntity(
                id,
                "Titlu Vechi",
                "Cont Vechi",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        ArticleEntity savedArticle = new ArticleEntity(
                id,
                request.title(),
                request.content(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(mockRepo.findById(id)).thenReturn(Optional.of(existingArticle));
        when(mockRepo.save(any(ArticleEntity.class))).thenReturn(savedArticle);
        ArticleDto result = service.updateArticle(request, id);

        assertEquals(id, result.getId());
        assertEquals("Nou Titlu", result.getTitle());
        assertEquals("Nou Cont", result.getContent());
    }

}