package com.niyora.EBankingSystem.DTOs.account;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CashDepositDto {
    private String accountNumber;
    private Double amount;
}