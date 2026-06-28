package com.niyora.EBankingSystem.DTOs.teller;

import com.niyora.EBankingSystem.Entities.users.User;
import lombok.Data;

@Data
public class TellerUpdateDto {
    private String fullName;
    private String email;
    private String phoneNumber;
    private User.Status status;
    private Long branchId;
    private String cashDrawerId;
}
