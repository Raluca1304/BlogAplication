package com.cognizant.practice.blog.service;

import com.cognizant.practice.blog.model.Article;
import com.cognizant.practice.blog.model.ArticleRequest;
import com.cognizant.practice.blog.repository.ArticleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ArticleService {

    public ArticleRepository articleRepository;

    public void verifyExistingArticle (UUID id) {
        if(articleRepository.findById(id).isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
    public ArticleService (ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }
    // Get method on all articles
    public List<Article> getAlllArticles () {
        return articleRepository.findAll();
    }

    // Get method on a specific article
    public Optional<Article> getArticlesById(UUID id) {
        verifyExistingArticle(id);
        return articleRepository.findById(id);
    }

    // Remove a specific article by id
    public void deleteArticleById(UUID id) {
        verifyExistingArticle(id);
        articleRepository.deleteById(id);
    }

    // Create an article
    public Article createNewArticles(ArticleRequest articleRequest) {
        Article newArticle = new Article(null, articleRequest.title(), articleRequest.content(),
                LocalDateTime.now(), LocalDateTime.now());
        return articleRepository.save(newArticle);
    }

    // Update a specific article
    public Article updateArticle(ArticleRequest articleRequest, UUID id) {
        Optional<Article> oldArticle = articleRepository.findById(id);
        verifyExistingArticle(id);
        Article updatedArticle = new Article(id, articleRequest.title(), articleRequest.content(),
                oldArticle.get().getCreatedDate(), LocalDateTime.now());
        return articleRepository.save(updatedArticle);
    }
}

