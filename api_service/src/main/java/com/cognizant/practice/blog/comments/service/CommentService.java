package com.cognizant.practice.blog.comments.service;

import com.cognizant.practice.blog.articles.model.ArticleDto;
import com.cognizant.practice.blog.articles.repository.ArticleRepository;
import com.cognizant.practice.blog.comments.model.CommentDto;
import com.cognizant.practice.blog.comments.model.CommentEntity;
import com.cognizant.practice.blog.comments.model.CommentRequest;
import com.cognizant.practice.blog.comments.repository.CommentRepository;
import com.cognizant.practice.blog.users.model.UserEntity;
import com.cognizant.practice.blog.users.repository.UserRepository;
import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentService {

    public CommentRepository commentRepository;
    public ArticleRepository articleRepository;
    public UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, ArticleRepository articleRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

   public List<CommentDto> getAllComments(UUID id) {
       return articleRepository.findById(id).get().getComments().stream().
               map(commentEntity -> new CommentDto(
               commentEntity.getId(),
               commentEntity.getText(),
               commentEntity.getCreatedDate(),
               commentEntity.getAuthor().getUsername(),
               new ArticleDto(
                       commentEntity.getArticle().getId(),
                       commentEntity.getArticle().getTitle(),
                       commentEntity.getArticle().getContent(),
                       commentEntity.getArticle().getCreatedDate(),
                       commentEntity.getArticle().getUpdatedDate(),
                       commentEntity.getArticle().getAuthor().getUsername(),
                       commentEntity.getArticle().getSummmary(),
                       commentEntity.getArticle().getAuthor().getId()
               )
       )).toList();
   }

   public List<CommentDto> getAllCommentsFromDatabase() {
        //return commentRepository.findAll()
       return commentRepository.findAll().stream()
               .map(comment -> new CommentDto(
                       comment.getId(),
                       comment.getText(),
                       comment.getCreatedDate(),
                       comment.getAuthor().getUsername(),
                       new ArticleDto(
                               comment.getArticle().getId(),
                               comment.getArticle().getTitle(),
                               comment.getArticle().getContent(),
                               comment.getArticle().getCreatedDate(),
                               comment.getArticle().getUpdatedDate(),
                               comment.getArticle().getAuthor().getUsername(),
                               comment.getArticle().getSummmary(),
                               comment.getArticle().getAuthor().getId()
                       )
               ))
               .collect(Collectors.toList());
   }

    public UserEntity getUserFromUsername(String username) {
        Optional<UserEntity> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return user.get();
    }

    public UserEntity getPrincialUser(Principal author) {
        String username = author.getName();
        return getUserFromUsername(username);
    }

    public CommentDto createNewComment(CommentRequest commentRequest, UUID id, Principal principal) {
        UserEntity author = getPrincialUser(principal);
        CommentEntity newComment = new CommentEntity(null, commentRequest.text(), LocalDateTime.now(),
                articleRepository.findById(id).get(), author);
        CommentEntity savedComment = commentRepository.save(newComment);

        return new CommentDto(
                savedComment.getId(),
                savedComment.getText(),
                savedComment.getCreatedDate(),
                savedComment.getAuthor().getUsername(),
                new ArticleDto(
                        savedComment.getArticle().getId(),
                        savedComment.getArticle().getTitle(),
                        savedComment.getArticle().getContent(),
                        savedComment.getArticle().getCreatedDate(),
                        savedComment.getArticle().getUpdatedDate(),
                        savedComment.getArticle().getAuthor().getUsername(),
                        savedComment.getArticle().getSummmary(),
                        savedComment.getArticle().getAuthor().getId()
                )
        );

    }


    public void deleteComment(UUID commentId, Principal principal) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        // Check if user is the author of the comment
        if (!comment.getAuthor().getUsername().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to delete this comment");
        }
        
        commentRepository.delete(comment);
    }

    public CommentDto updateComment(UUID commentId, CommentRequest commentRequest, Principal principal) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        // Check if user is the author of the comment
//        if (!comment.getAuthor().getUsername().equals(principal.getName())) {
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to edit this comment");
//        }
        
        comment.setText(commentRequest.text());
        CommentEntity updatedComment = commentRepository.save(comment);
        
        return new CommentDto(
                updatedComment.getId(),
                updatedComment.getText(),
                updatedComment.getCreatedDate(),
                updatedComment.getAuthor().getUsername(),
                new ArticleDto(
                        updatedComment.getArticle().getId(),
                        updatedComment.getArticle().getTitle(),
                        updatedComment.getArticle().getContent(),
                        updatedComment.getArticle().getCreatedDate(),
                        updatedComment.getArticle().getUpdatedDate(),
                        updatedComment.getArticle().getAuthor().getUsername(),
                        updatedComment.getArticle().getSummmary(),
                        updatedComment.getArticle().getAuthor().getId()
                )
        );
    }

    public Optional<CommentDto> getCommentById(UUID id) {
        Optional<CommentEntity> comment = commentRepository.findById(id);

        return comment
                .map(com -> new CommentDto(
                        com.getId(),
                        com.getText(),
                        com.getCreatedDate(),
                        com.getAuthor().getUsername(),
                        new ArticleDto(
                                com.getArticle().getId(),
                                com.getArticle().getTitle(),
                                com.getArticle().getContent(),
                                com.getArticle().getCreatedDate(),
                                com.getArticle().getUpdatedDate(),
                                com.getArticle().getAuthor().getUsername(),
                                com.getArticle().getSummmary(),
                                com.getArticle().getAuthor().getId()
                        )
                ));
    }
}
