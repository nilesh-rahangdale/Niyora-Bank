package com.niyora.EBankingSystem.DTOs.admin;

import com.niyora.EBankingSystem.Entities.branch.Branch;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDTO {

    private Long userId;
    private Long createdById;
    private Long branchId;
    private String adminLevel;
    private String permissions;
}
