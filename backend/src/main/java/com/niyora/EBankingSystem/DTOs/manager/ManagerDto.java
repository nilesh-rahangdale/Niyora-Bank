package com.niyora.EBankingSystem.DTOs.manager;

import com.niyora.EBankingSystem.DTOs.user.UserDto;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.users.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@Getter
@Setter
public class ManagerDto {
    private Long managerId;
    private UserDto userDto;
    private Long createdById;
    private Long branchId;
}
