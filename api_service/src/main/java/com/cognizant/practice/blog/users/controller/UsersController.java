package com.cognizant.practice.blog.users.controller;

import com.cognizant.practice.blog.users.model.*;
import com.cognizant.practice.blog.users.security.JwtDto;
import com.cognizant.practice.blog.users.security.JwtService;
import com.cognizant.practice.blog.users.security.LoginUserDto;
import com.cognizant.practice.blog.users.service.UserService;
import io.jsonwebtoken.Jwt;
import org.apache.catalina.User;
import org.springframework.boot.web.embedded.jetty.JettyWebServer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class UsersController {

    private final UserService userService;
    private final JwtService jwtService;

    public UsersController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    private UserDto verifyExistingUser(UUID id) {
        return  userService.getUserById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private void verifyPosibleToCreateNewUser (UserRequest userRequest) {
        if (userRequest.username() == null || userRequest.firstName() == null ||
                userRequest.lastName() == null || userRequest.email() == null ||
                userRequest.password() == null || userRequest.username().isEmpty() ||
                userRequest.firstName().isEmpty() || userRequest.lastName().isEmpty() ||
                userRequest.password().isEmpty() || userRequest.email().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/users/signup")
    public JwtDto registerUser(@RequestBody UserRequest userRequest) {
         return new JwtDto(userService.createNewUser(userRequest));
    }

    @PostMapping("/users/login")
    public JwtDto loginUser(@RequestBody LoginUserDto loginUserDto) {
        return new JwtDto(userService.loginUser(loginUserDto));
    }

    @GetMapping(value = "/users")
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }


    @GetMapping(value = "/users/{id}")
    public UserDto getUsersById(@PathVariable UUID id) {
        verifyExistingUser(id);
        var userVerify = userService.getUserById(id);
        return userVerify.get();
    }

    @DeleteMapping(value = "/users/{id}")
    public void deleteUserById(@PathVariable UUID id) {
        verifyExistingUser(id);
        userService.deleteUserById(id);
    }

    @PostMapping(value = "/users")
    public String createNewUser(@RequestBody UserRequest userRequest) {
        verifyPosibleToCreateNewUser(userRequest);
        return userService.createNewUser(userRequest);
    }

    @PutMapping(value = "/users/{id}/role")
    public Optional<UserDto> updateRole(@PathVariable UUID id, @RequestBody Role role) {
        return userService.updateUsersRole(role, id);
    }

}
