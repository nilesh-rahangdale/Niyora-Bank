package com.niyora.EBankingSystem.DTOs.cheque;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ChequeReqDto {

    private String chequeNumber;
    private String issuingBank;
    private String branchCode;
    private String issuerAccountNumber;
    private String payeeAccountNumber;
    private Double amount;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate issueDate;
}

