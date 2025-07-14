package com.cognizant.practice.blog.users.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;


@Data
//@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private UUID id;

    private String firstName;

    private String lastName;

    private String userName;

    private String email;

    private String password;

    private LocalDateTime createdDate;

    private String role;

    public UserDto(UUID id, String firstName, String userName, String lastName, String email, String password, LocalDateTime createdDate, String role) {
        this.id = id;
        this.firstName = firstName;
        this.userName = userName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.createdDate = createdDate;
        this.role = role;
    }
}
