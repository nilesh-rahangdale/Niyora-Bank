package com.niyora.EBankingSystem.DTOs.account;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MoneyTransferDto {

    private String fromAccountNumber;
    private String toAccountNumber;
    private Double amount;

}
