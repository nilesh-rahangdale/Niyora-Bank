package com.niyora.EBankingSystem.DTOs.cso;

import com.niyora.EBankingSystem.DTOs.user.UserDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CsoDto {
    private Long csoId;
    private UserDto userDto;
    private Long createdById;
    private Long branchId;
}
