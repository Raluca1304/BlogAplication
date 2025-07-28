package com.cognizant.practice.blog.comments.service;

import com.cognizant.practice.blog.articles.repository.ArticleRepository;
import com.cognizant.practice.blog.comments.model.CommentDto;
import com.cognizant.practice.blog.comments.model.CommentEntity;
import com.cognizant.practice.blog.comments.model.CommentRequest;
import com.cognizant.practice.blog.comments.repository.CommentRepository;
import com.cognizant.practice.blog.users.model.UserEntity;
import com.cognizant.practice.blog.users.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collections;
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
                       commentEntity.getAuthor().getUsername()
       )).toList();
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
                savedComment.getAuthor().getUsername()
        );

    }


    public void deleteComment(UUID articleId, UUID commentId, Principal principal) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!comment.getArticle().getId().equals(articleId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment does not belong to this article");
        }
        if (!comment.getAuthor().getUsername().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to delete this comment");
        }
        commentRepository.delete(comment);
    }
}
