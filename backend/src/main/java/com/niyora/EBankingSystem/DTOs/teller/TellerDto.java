package com.niyora.EBankingSystem.DTOs.teller;

import com.niyora.EBankingSystem.DTOs.user.UserDto;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TellerDto {
    private Long tellerId;
    private UserDto userDto;
    private Long createdById;
    private Long branchId;
    private String cashDrawerId;
    private LocalDateTime lastBalanced;
}
