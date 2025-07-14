package com.cognizant.practice.blog.articles.service;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleEntity;
import com.cognizant.practice.blog.articles.model.ArticleRequest;
import com.cognizant.practice.blog.articles.repository.ArticleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class ArticleService {

    public ArticleRepository articleRepository;

    public ArticleService (ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }
    // Get method on all articles
    public List<ArticleDto> getAllArticles() {
        return articleRepository.findAll().stream()
                .map(article -> new ArticleDto(
                        article.getId(),
                        article.getTitle(),
                        article.getContent(),
                        article.getCreatedDate(),
                        article.getUpdatedDate()
                ))
                .collect(Collectors.toList());
    }

    public List<ArticleDto> getAllArticlesWithLimits(Pageable pageable, String title) {
        return articleRepository.findAll(pageable).stream()
                .map(article -> new ArticleDto(
                        article.getId(),
                        article.getTitle(),
                        article.getContent(),
                        article.getCreatedDate(),
                        article.getUpdatedDate()
                ))
                .collect(Collectors.toList());
    }

    public List<ArticleDto> getFilteredArticles(Pageable pageable, String titleFilter, String authorFilter) {


        if (titleFilter != null && authorFilter != null) {
            return articleRepository.findAllByTitleAndAuthor(
                    titleFilter, authorFilter, pageable).stream().map(
                            article -> new ArticleDto(
                                    article.getId(),
                                    article.getTitle(),
                                    article.getContent(),
                                    article.getCreatedDate(),
                                    article.getUpdatedDate()
                            ))
                    .collect(Collectors.toList());
        } else if (titleFilter != null) {
            return articleRepository.findAllByTitle(
                            titleFilter,pageable).stream().map(
                            article -> new ArticleDto(
                                    article.getId(),
                                    article.getTitle(),
                                    article.getContent(),
                                    article.getCreatedDate(),
                                    article.getUpdatedDate()
                            ))
                    .collect(Collectors.toList());
        } else if (authorFilter != null) {
            return articleRepository.findAllByAuthor(
                           authorFilter, pageable).stream().map(
                            article -> new ArticleDto(
                                    article.getId(),
                                    article.getTitle(),
                                    article.getContent(),
                                    article.getCreatedDate(),
                                    article.getUpdatedDate()
                            ))
                    .collect(Collectors.toList());
        } else {
            return articleRepository.findAll(pageable).stream()
                    .map(article -> new ArticleDto(
                            article.getId(),
                            article.getTitle(),
                            article.getContent(),
                            article.getCreatedDate(),
                            article.getUpdatedDate()
                    ))
                    .collect(Collectors.toList());
        }
    }

    // Get method on a specific article
    public Optional<ArticleDto> getArticlesById(UUID id) {
        Optional<ArticleEntity> article = articleRepository.findById(id);
        return article
                .map(art -> new ArticleDto(
                        art.getId(),
                        art.getTitle(),
                        art.getContent(),
                        art.getCreatedDate(),
                        art.getUpdatedDate()
                ));
    }

    // Remove a specific article by id
    public void deleteArticleById(UUID id) {
        articleRepository.deleteById(id);
    }


    // Create an article
    public ArticleDto createNewArticles(ArticleRequest articleRequest) {
        ArticleEntity newArticle = new ArticleEntity(null, articleRequest.title(), articleRequest.content(),
                LocalDateTime.now(), LocalDateTime.now());
        ArticleEntity savedArticle = articleRepository.save(newArticle);
        return new ArticleDto(
                savedArticle.getId(),
                savedArticle.getTitle(),
                savedArticle.getContent(),
                savedArticle.getCreatedDate(),
                savedArticle.getUpdatedDate()
        );
    }

    // Update a specific article
    public ArticleDto updateArticle(ArticleRequest articleRequest, UUID id) {
        Optional<ArticleEntity> oldArticle = articleRepository.findById(id);
        ArticleEntity updatedArticle = new ArticleEntity(id, articleRequest.title(), articleRequest.content(),
                oldArticle.get().getCreatedDate(), LocalDateTime.now());
        ArticleEntity savedArticle = articleRepository.save(updatedArticle);
        return new ArticleDto(
                savedArticle.getId(),
                savedArticle.getTitle(),
                savedArticle.getContent(),
                savedArticle.getCreatedDate(),
                savedArticle.getUpdatedDate()
        );
    }
}



