package com.niyora.EBankingSystem.DTOs.auth;

import com.niyora.EBankingSystem.DTOs.user.UserDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginRespDto {
    private String jwtToken;
    private UserDto userDto;
}
