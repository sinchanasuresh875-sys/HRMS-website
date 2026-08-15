package com.hrms.dto;

import com.hrms.entity.Role;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String employeeId;
    private String name;
    private String email;
    private Role role;
    private Long organizationId;

    public AuthResponse(String token, Long userId, String employeeId, String name, String email, Role role, Long organizationId) {
        this.token = token;
        this.userId = userId;
        this.employeeId = employeeId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.organizationId = organizationId;
    }

    public String getToken() { return token; }
    public String getTokenType() { return tokenType; }
    public Long getUserId() { return userId; }
    public String getEmployeeId() { return employeeId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public Long getOrganizationId() { return organizationId; }
}
