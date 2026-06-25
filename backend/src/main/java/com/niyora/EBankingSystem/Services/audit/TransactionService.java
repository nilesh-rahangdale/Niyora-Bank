package com.niyora.EBankingSystem.Services.audit;


import com.niyora.EBankingSystem.DTOs.audit.TransactionDto;
import com.niyora.EBankingSystem.Entities.audit.Transaction;
import com.niyora.EBankingSystem.Repositories.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;


//    @Transactional(propagation = Propagation.REQUIRES_NEW)
//    public Transaction transactionHelper(TransactionDto transactionDto) {
//        return createTransaction(transactionDto);
//    }

//    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Transaction createTransaction(TransactionDto transactionDto) {

        try {
            Transaction transaction = Transaction.builder()
                    .account(transactionDto.getAccount())
                    .amount(transactionDto.getAmount())
                    .transactionType(transactionDto.getTransactionType())
                    .transactionDate(transactionDto.getTransactionDate())
                    .processedBy(transactionDto.getProcessedBy())
                    .status(transactionDto.getStatus())
                    .remarks(transactionDto.getRemarks() !=null ? transactionDto.getRemarks() : "No remarks")
                    .cheque(transactionDto.getCheque()!=null?transactionDto.getCheque():null)
                    .build();
            return transactionRepository.save(transaction);
        } catch (Exception e) {
            Transaction transaction = Transaction.builder()
                    .account(transactionDto.getAccount())
                    .amount(transactionDto.getAmount())
                    .transactionType(transactionDto.getTransactionType())
                    .transactionDate(transactionDto.getTransactionDate())
                    .processedBy(transactionDto.getProcessedBy())
                    .status(Transaction.Status.FAILED)
                    .remarks(e.getMessage() !=null ? e.getMessage() : "Transaction failed due to unknown error")
                    .cheque(transactionDto.getCheque()!=null?transactionDto.getCheque():null)
                    .build();
            return transactionRepository.save(transaction);
        }
    }
}



