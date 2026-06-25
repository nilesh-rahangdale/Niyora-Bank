package com.niyora.EBankingSystem.DTOs.user;

import com.niyora.EBankingSystem.Entities.users.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Getter
@Setter
public class UserDto {
//    private Long id;

//    @NotBlank
//    @Size(min=3, max=50)
//    private String username;
//
//    @NotBlank
//    @Size(max=70)
//    @Email
//    private String email;
//
//    private Set<String> roles;
//
//
    private Long id;
    private String fullName;
    private Set<String> roles;
    private String email;
    private String phoneNumber;
    private User.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;
}
