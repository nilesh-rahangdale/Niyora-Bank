package com.niyora.EBankingSystem.DTOs.audit;

import com.niyora.EBankingSystem.Entities.account.Account;
import com.niyora.EBankingSystem.Entities.audit.Transaction;
import com.niyora.EBankingSystem.Entities.cheque.Cheque;
import com.niyora.EBankingSystem.Entities.users.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TransactionRespDto {

    private Transaction.TransactionType transactionType;
    private Double amount;
    private LocalDateTime transactionDate;
    private Transaction.Status status;
    private Long processedById;
    private String remarks;

}
