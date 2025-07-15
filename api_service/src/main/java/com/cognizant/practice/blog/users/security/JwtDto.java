package com.cognizant.practice.blog.users.security;

import jdk.jfr.MemoryAddress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtDto {
    private String token;
}
