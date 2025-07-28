package com.cognizant.practice.blog.users.service;

import com.cognizant.practice.blog.users.convertor.UserConvertor;
import com.cognizant.practice.blog.users.model.*;
import com.cognizant.practice.blog.users.repository.UserRepository;
import com.cognizant.practice.blog.users.security.JwtDto;
import com.cognizant.practice.blog.users.security.JwtService;
import com.cognizant.practice.blog.users.security.LoginUserDto;
import org.apache.catalina.User;
import org.aspectj.apache.bcel.generic.RET;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    public UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public String loginUser(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input.username(), input.password())
        );
        Optional<UserEntity> savedUser = userRepository.findByUsername(input.username());
        String jwtToken = jwtService.generateToken(savedUser.get());

        return jwtToken;
    }
    // Get method on all users
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserConvertor::toDto)
                .collect(Collectors.toList());
    }

    public Optional<UserDto> getUserById(UUID id) {
        Optional<UserEntity> user = userRepository.findById(id);
        return user
                .map(UserConvertor::toDto);
    }

    // Create new user
    public String createNewUser(UserRequest userRequest) {
        String encodedPassword = passwordEncoder.encode(userRequest.password());
        UserEntity userEntity = new UserEntity(null, userRequest.firstName(), userRequest.lastName(),
                userRequest.username(), userRequest.email(), encodedPassword, LocalDateTime.now(), Role.ROLE_USER, null, null);
        String tokenToReturn = jwtService.generateToken(userRepository.save(userEntity));
        return tokenToReturn;

    }

    public Optional<UserDto> updateUsersRole(Role role, UUID id) {
        Optional<UserEntity> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            user.setRole(role);
            userRepository.save(user);
            return Optional.of(UserConvertor.toDto(user));
        }
        return Optional.empty();
    }

    // Delete a user by id
    public void deleteUserById(UUID id) {
        userRepository.deleteById(id);
    }
}
