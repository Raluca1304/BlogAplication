package com.cognizant.practice.blog.articles.controller;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleEntity;
import com.cognizant.practice.blog.articles.model.ArticleRequest;
import com.cognizant.practice.blog.articles.service.ArticleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;


@RestController
public class ArticlesController {

    private final ArticleService articleService;

    public ArticlesController(ArticleService articleService) {
        this.articleService = articleService;
    }

    private ArticleDto verifyExistingArticle(UUID id) {
        return articleService.getArticlesById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    // Return all articles from array
    // Read
    @GetMapping(value = "/articles")
    public List<ArticleDto> getAllArticles() {
        return articleService.getAllArticles();
    }

    // Return a specific article by an unique id
    // Read
    @GetMapping(value = "/articles/{id}")
    public ArticleDto getArticleById(@PathVariable UUID id) {
        verifyExistingArticle(id);
        var articleVerify = articleService.getArticlesById(id);
        return articleVerify.get();
    }

    // Delete an article with a specific id
    @DeleteMapping(value = "/articles/{id}")
    public void deleteArticleByID(@PathVariable UUID id) {
        verifyExistingArticle(id);
        articleService.deleteArticleById(id);
    }

    // Create a new article
    @PostMapping(value = "/articles")
    public ArticleDto createNewArticles(@RequestBody ArticleRequest articleRequest) {
        return articleService.createNewArticles(articleRequest);
    }

    // Update a specific article
    @PutMapping(value = "/articles/{id}")
    public ArticleDto updateArticle(@RequestBody ArticleRequest articleRequest, @PathVariable UUID id) {
        var articleVerify = articleService.getArticlesById(id);
        if (articleRequest.title() == null || articleRequest.content() == null ||
                articleRequest.title().isEmpty() || articleRequest.content().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        verifyExistingArticle(id);
        return articleService.updateArticle(articleRequest, id);
    }
}

