package com.cognizant.practice.blog.controller;

import com.cognizant.practice.blog.model.Article;
import com.cognizant.practice.blog.model.ArticleRequest;
import com.cognizant.practice.blog.service.ArticleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@RestController
public class ArticlesController {

    private final ArticleService articleService;

    // Create 3 permanent articles
    public ArticlesController(ArticleService articleService) {
        this.articleService = articleService;
    }

    // Return all articles from array
    // Read
    @GetMapping(value = "/articles")
    public List<Article> getAllArticles() {
        return articleService.getAlllArticles();
    }

    // Return a specific article by an unique id
    // Read
    @GetMapping(value = "/articles/{id}")
    public Optional<Article> getArticleById(@PathVariable UUID id) {
        return articleService.getArticlesById(id);
    }

    // Delete an article with a specific id
    @DeleteMapping(value = "/articles/{id}")
    public void deleteArticleById(@PathVariable UUID id) {
        articleService.deleteArticleById(id);
    }

    // Create a new article
    @PostMapping(value = "/articles")
    public Article createNewArticles(@RequestBody ArticleRequest articleRequest) {
        return articleService.createNewArticles(articleRequest);
    }


    // Update a specific article
    @PutMapping(value = "/articles/{id}")
    public Article updateArticle(@RequestBody ArticleRequest articleRequest, @PathVariable UUID id) {
        return articleService.updateArticle(articleRequest, id);
    }
}

