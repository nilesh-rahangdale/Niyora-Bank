package com.niyora.EBankingSystem.DTOs.manager;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterManagerDto {
    @NotBlank
    @Email
    private String email;
    private String fullName;
    private String phoneNumber;
    private String password;
    private Long branchId;
}
