package com.niyora.EBankingSystem.DTOs.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterReqDto {



//    @NotBlank
//    @Size(min=8, message = "Password must be at least 8 characters long",max =16)
//    private String password;
//
//    @NotBlank
//    @Email
//    private String email;

    @NotBlank
    @Email
    private String email;
    private String fullName;
    private String phoneNumber;
    private String password;
//    private Set<String> roles;


}
