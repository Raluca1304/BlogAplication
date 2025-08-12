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


import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
//        System.out.println("buna");
        // List<UserEntity> usernEnt = userRepository.findAll();
//        Stream<UserEntity> userEntityStream = userRepository.findAll().stream();
//        Stream<UserDto> userDtoStream = userEntityStream.map(UserConvertor::toDto);
       // List<UserDto> userDtos = userDtoStream.toList();
        List<UserDto> users = userRepository.findAll().stream()
                .map(UserConvertor::toDto)
                .toList();
        // System.out.printf("ajunge aici ");

        return users;

    }

    public Optional<UserDto> getUserById(UUID id) {
        Optional<UserEntity> user = userRepository.findById(id);
        return user
                .map(UserConvertor::toDto);
    }

    // Create new user
    public String createNewUser(UserRequest userRequest) {
        String encodedPassword = passwordEncoder.encode(userRequest.password());
        if (userRepository.findByUsername(userRequest.username()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }
         if (userRepository.findByEmail(userRequest.email()).isPresent()) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
         }
        UserEntity userEntity = new UserEntity(null, userRequest.firstName(), userRequest.lastName(),
                userRequest.username(), userRequest.email(), encodedPassword, LocalDateTime.now(), Role.ROLE_USER, null, null);
        String tokenToReturn = jwtService.generateToken(userRepository.save(userEntity));
        return tokenToReturn;

    }

    public Optional<UserDto> updateUserPartial(UserRequest userRequest, UUID id) {
        Optional<UserEntity> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            
            // Only update fields that are not null
            if (userRequest.role() != null) {
                user.setRole(userRequest.role());
            }
            if (userRequest.email() != null) {
                user.setEmail(userRequest.email());
            }
            if (userRequest.firstName() != null) {
                user.setFirstName(userRequest.firstName());
            }
            if (userRequest.lastName() != null) {
                user.setLastName(userRequest.lastName());
            }
            if (userRequest.username() != null) {
                user.setUsername(userRequest.username());
            }
            // Note: password is not included in partial updates for security
            
            userRepository.save(user);
            return Optional.of(UserConvertor.toDto(user));
        }
        return Optional.empty();
    }
    public Optional<UserDto> updateUser(UUID id , UserRequest userRequest) {
//        Optional<UserEntity> oldUserOpt = userRepository.findById(id);
//        if (oldUserOpt.isEmpty()) {
//            return Optional.empty();
//        }
//        UserEntity oldUser = oldUserOpt.get();
//        oldUser.setFirstName(userRequest.firstName());
//        oldUser.setLastName(userRequest.lastName());
//        oldUser.setUsername(userRequest.username());
//        oldUser.setEmail(userRequest.email());
//
//        oldUser.setRole(userRequest.role());
//        UserEntity savedUser = userRepository.save(oldUser);
//        return Optional.of(UserConvertor.toDto(savedUser));
        Optional<UserEntity> oldUser = userRepository.findById(id);
        UserEntity updatedUser = new UserEntity(id, userRequest.firstName(), userRequest.lastName(),
                userRequest.username(), userRequest.email(), oldUser.get().getPassword(), oldUser.get().getCreatedDate(),
                userRequest.role(), oldUser.get().getArticles(), oldUser.get().getComments());
        UserEntity savedUser = userRepository.save(updatedUser);
        return Optional.of(UserConvertor.toDto(savedUser));
    }

    // Delete a user by id
    public void deleteUserById(UUID id) {
        userRepository.deleteById(id);
    }
}
