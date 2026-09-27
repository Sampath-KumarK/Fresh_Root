package com.freshroots.service;

import com.freshroots.dto.Dtos.*;
import com.freshroots.model.User;
import com.freshroots.model.Role;
import com.freshroots.repository.UserRepository;
import com.freshroots.security.JwtUtils;
import com.freshroots.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired AuthenticationManager authenticationManager;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtils jwtUtils;

    public MessageResponse registerUser(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot register as ADMIN");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use!");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setRole(request.getRole());
        userRepository.save(user);
        return new MessageResponse("User registered successfully!");
    }

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        if (userDetails.getRole() != loginRequest.getRole()) {
            throw new RuntimeException("Role mismatch!");
        }
        String jwt = jwtUtils.generateJwtToken(authentication);
        return new LoginResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getUsername(), userDetails.getRole());
    }
}
