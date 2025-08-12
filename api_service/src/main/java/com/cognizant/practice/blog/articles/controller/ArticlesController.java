package com.cognizant.practice.blog.articles.controller;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.model.ArticleRequest;
import com.cognizant.practice.blog.articles.service.ArticleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
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

    // Read
//    @GetMapping(value = "/articles")
//    public List<ArticleDto> getAllArticles() {
//        return articleService.getAllArticles();
//    }

//    @GetMapping("/articles")
//    public List<ArticleDto> getAllArticles(
//            @RequestParam(defaultValue = "0") int from,
//            @RequestParam(defaultValue = "10") int limit,
//            @RequestParam(defaultValue = "createdDate") String sortBy,
//            @RequestParam(defaultValue = "asc") String sortDirection,
//            @RequestParam(required = false) String title,
//            @RequestParam(required = false) String author
//    ) {
//        Sort sort = sortDirection.equalsIgnoreCase("desc") ?
//                Sort.by(sortBy).ascending() :
//                Sort.by(sortBy).descending();
//
//        Pageable pageable = PageRequest.of(from, limit, sort);
//        return articleService.getFilteredArticles(pageable, title, author);
//    }

    @GetMapping("/articles")
    public List<ArticleDto> getArticles(@RequestParam(required = false) UUID authorId) {
        if (authorId != null) {
            return articleService.getArticlesByAuthorId(authorId);
        } else {
            return articleService.getAllArticles();
        }
    }

    @GetMapping("/articles/latest")
    public List<ArticleDto> getLatestArticles(@RequestParam(defaultValue = "4") int limit) {
        if (limit <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "limit must be positive");
        }
        return articleService.getLatestArticles(limit);
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
    public ArticleDto createNewArticles(@RequestBody ArticleRequest articleRequest, Principal principal) {
        return articleService.createNewArticles(articleRequest, principal);
    }

    // Update a specific article
    @PutMapping(value = "/articles/{id}")
    public ArticleDto updateArticle(@RequestBody ArticleRequest articleRequest, @PathVariable UUID id, Principal principal) {
        if (articleRequest.title() == null || articleRequest.content() == null ||
                articleRequest.title().isEmpty() || articleRequest.content().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        verifyExistingArticle(id);
        return articleService.updateArticle(articleRequest, id, principal);
    }

}

