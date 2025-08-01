package com.cognizant.practice.blog.users.controller;

import com.cognizant.practice.blog.users.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @GetMapping("/check-permission")
    public ResponseEntity<Map<String, Object>> checkPermissions(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String username = jwtService.extractUsername(token);
            String role = jwtService.extractRole(token);
            
            Map<String, Object> permissions = new HashMap<>();
            permissions.put("username", username);
            permissions.put("role", role);
            permissions.put("isAdmin", jwtService.isAdmin(token));
            permissions.put("isAuthor", jwtService.isAuthor(token));
            permissions.put("canCreateArticles", jwtService.isAuthor(token) || jwtService.isAdmin(token));
            permissions.put("canEditAllArticles", jwtService.isAdmin(token));
            permissions.put("canDeleteAllArticles", jwtService.isAdmin(token));
            permissions.put("canManageUsers", jwtService.isAdmin(token));
            
            return ResponseEntity.ok(permissions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, String>> getUserInfo(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String username = jwtService.extractUsername(token);
            String role = jwtService.extractRole(token);
            
            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("username", username);
            userInfo.put("role", role);
            
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
} 