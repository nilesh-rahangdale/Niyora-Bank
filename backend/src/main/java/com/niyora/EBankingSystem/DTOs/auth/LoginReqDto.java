package com.niyora.EBankingSystem.DTOs.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginReqDto {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}
