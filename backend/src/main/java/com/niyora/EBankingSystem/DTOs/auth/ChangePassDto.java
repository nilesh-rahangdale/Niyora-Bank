package com.niyora.EBankingSystem.DTOs.auth;

import lombok.Data;

@Data
public class ChangePassDto {
    private String oldPassword;
    private String newPassword;
    private String confirmNewPassword;
}
