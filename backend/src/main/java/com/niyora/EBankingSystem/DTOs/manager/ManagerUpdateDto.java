package com.niyora.EBankingSystem.DTOs.manager;

import com.niyora.EBankingSystem.Entities.users.User;
import lombok.Data;

@Data
public class ManagerUpdateDto {
    private String fullName;
    private String email;
    private String phoneNumber;
    private User.Status status;
    private Long branchId;
}
