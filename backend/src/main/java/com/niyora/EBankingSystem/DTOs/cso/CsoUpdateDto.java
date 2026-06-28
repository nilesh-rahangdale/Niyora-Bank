package com.niyora.EBankingSystem.DTOs.cso;

import com.niyora.EBankingSystem.Entities.users.User;
import lombok.Data;

@Data
public class CsoUpdateDto {
    private String fullName;
    private String email;
    private String phoneNumber;
    private User.Status status;
    private Long branchId;
}
