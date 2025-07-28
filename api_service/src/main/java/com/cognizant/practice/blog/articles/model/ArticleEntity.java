package com.cognizant.practice.blog.articles.model;

import com.cognizant.practice.blog.comments.model.CommentDto;
import com.cognizant.practice.blog.comments.model.CommentEntity;
import com.cognizant.practice.blog.users.model.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Entity
@Table(name = "ARTICLES")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    @Column(columnDefinition = "TEXT")
    private String summmary;

    @ManyToOne
    private UserEntity author;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommentEntity> comments;

    public ArticleEntity(UUID id, String title, String content, LocalDateTime createdDate, LocalDateTime updatedDate,
                         UserEntity author, String summmary) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.author = author;
        this.summmary = summmary;
    }

//    public ArticleEntity(Object o, String title, String content, LocalDateTime now, LocalDateTime now1, UserEntity author,
//                         String summmary) {
//    }

}
