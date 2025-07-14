package com.cognizant.practice.blog.users.model;

public record UserRequest(String firstName, String lastName, String username, String email,
                String password, Role role) {

}
