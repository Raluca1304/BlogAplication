package com.cognizant.practice.blog;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@RestController
public class ArticlesController {

    List<Article> allArticles = new ArrayList<>();

    public ArticlesController() {
        allArticles.add(new Article(1, "a1", "c1", LocalDateTime.now(), LocalDateTime.now()));
        allArticles.add(new Article(2, "a2", "c2", LocalDateTime.now(), LocalDateTime.now()));
        allArticles.add(new Article(3, "a3", "c3", LocalDateTime.now(), LocalDateTime.now()));
    }

    public static int MAXIM = 3 ;

    @GetMapping(value = "/articles")
    public List<Article> getAllArticles() {

        return  allArticles;
    }

    @GetMapping(value = "/articles/{id}")
    public Article getArticleById(@PathVariable int id) {
        for (Article art : allArticles) {
            int currentId = art.id();
                if (currentId == id) {
                    return art;
                } else  {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND);
                }
        }
       return null;
    }

    @DeleteMapping(value = "/articles/{id}")
    public void deleteArticleById(@PathVariable int id) {
        for (Article art : allArticles) {
            int currentId = art.id();
            if (currentId == id) {
                allArticles.remove(art);
                return;
            }
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @PostMapping(value = "/articles")
    public Article createNewArticles(@RequestBody ArticleRequest articleRequest) {
        if (articleRequest.title() == null || articleRequest.content() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
            Article newArticle = new Article(MAXIM++, articleRequest.title(), articleRequest.content(),
                    LocalDateTime.now(), null);
            allArticles.add(newArticle);
            return newArticle;
    }


    @PutMapping(value = "/articles/{id}")
    public Article updateArticle(@RequestBody ArticleRequest articleRequest, @PathVariable int id) {
        if (articleRequest.content() == null || articleRequest.title() == null || articleRequest.content().isEmpty()
        || articleRequest.title().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        for (Article art : allArticles) {
            int currentId = art.id();
            if (currentId == id) {
                Article updatedArticle = new Article(currentId, articleRequest.title(), articleRequest.content(),
                        art.createdDate(),  LocalDateTime.now());
                allArticles.set(currentId - 1, updatedArticle);
                return updatedArticle;
            }
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
}
