package com.hrms.controller;

import com.hrms.dto.AuthResponse;
import com.hrms.dto.LoginRequest;
import com.hrms.entity.Employee;
import com.hrms.security.JwtTokenProvider;
import com.hrms.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Employee employee = principal.getEmployee();

        AuthResponse response = new AuthResponse(
                jwt,
                employee.getId(),
                employee.getEmployeeId(),
                employee.getFirstName() + " " + employee.getLastName(),
                employee.getEmail(),
                employee.getRole(),
                employee.getOrganization() != null ? employee.getOrganization().getId() : null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Employee> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(principal.getEmployee());
    }
}
