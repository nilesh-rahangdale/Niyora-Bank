package com.niyora.EBankingSystem.DTOs.admin;

import com.niyora.EBankingSystem.Entities.users.User;
import lombok.Data;

@Data
public class AdminUpdateDto {
    private String fullName;
    private String email;
    private String phoneNumber;
    private User.Status status;
    private String adminLevel;
    private String permissions;
    private Long branchId;
}
