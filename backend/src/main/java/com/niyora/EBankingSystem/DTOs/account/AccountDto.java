package com.niyora.EBankingSystem.DTOs.account;


import lombok.Data;

@Data
public class AccountDto {

    private Long id;
    private String accountNumber;
    private Long customerId;
    private String accountType;
    private Double balance;
    private String createdAt;
    private String accountStatus;
//     branch details
    private String branchName;
    private String branchCode;
    private String branchIfsc;

}
