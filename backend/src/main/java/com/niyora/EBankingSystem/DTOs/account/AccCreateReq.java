package com.niyora.EBankingSystem.DTOs.account;

import com.niyora.EBankingSystem.Entities.account.Account;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.users.Customer;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AccCreateReq {

    private Long customerId;
    private String branchCode;
    private Account.AccountType accountType;
}
