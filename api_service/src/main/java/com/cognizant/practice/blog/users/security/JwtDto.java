package com.cognizant.practice.blog.users.security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtDto {
    private String token;
    private String role;
    private String username;
}
