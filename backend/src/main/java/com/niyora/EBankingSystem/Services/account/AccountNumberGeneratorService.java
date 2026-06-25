package com.niyora.EBankingSystem.Services.account;

import com.niyora.EBankingSystem.Entities.account.BranchAccountSequence;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Repositories.BranchAccountSequenceRepository;
import com.niyora.EBankingSystem.Repositories.AccountRepository;
import com.niyora.EBankingSystem.Repositories.BranchRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class AccountNumberGeneratorService {

    private final BranchRepository branchRepo;
    private final BranchAccountSequenceRepository seqRepo;
    private final AccountRepository accountRepo; // used for rare uniqueness double-check

    private final SecureRandom random = new SecureRandom();

    /**
     * Generates a 12-digit account number: 4-digit branch, 6-digit sequence, 2-digit random suffix.
     * This method is transactional and uses PESSIMISTIC_WRITE locking on the BranchAccountSequence row.
     */
    @Transactional
    public String generateAccountNumber(Branch branch) {

        Long branchId=branch.getBranchId();
//        // 1) fetch branch
//        Branch branch = branchRepo.findByBranchId(branchId)
//                .orElseThrow(() -> new EntityNotFoundException("Branch not found: " + branchId));

        // 2) fetch (and lock) the BranchAccountSequence row
        BranchAccountSequence sequence = seqRepo.findByBranchIdForUpdate(branchId)
                .orElseGet(() -> {
                    // If not present, create initial sequence = 0 and persist.
                    BranchAccountSequence newSeq = BranchAccountSequence.builder()
                            .branch(branch)
                            .lastSequence(0L)
                            .build();
                    try {
                        // saveAndFlush helps ensure DB row is created within this transaction
                        return seqRepo.saveAndFlush(newSeq);
                    } catch (DataIntegrityViolationException ex) {
                        // rare race where another thread inserted the row first — fetch again with lock
                        return seqRepo.findByBranchIdForUpdate(branchId)
                                .orElseThrow(() -> new IllegalStateException("Failed to initialize sequence for branch " + branchId));
                    }
                });

        // 3) increment sequence safely (we hold PESSIMISTIC_WRITE on the row)
        long nextSeq = sequence.getLastSequence() + 1L;
        if (nextSeq > 999_999L) {
            // sequence overflow for 6 digits — handle according to your policy:
            // - throw error and ask admin to extend format, or
            // - reset after archival (not recommended)
            throw new IllegalStateException("Account sequence overflow for branch " + branchId);
        }
        sequence.setLastSequence(nextSeq);
        seqRepo.save(sequence); // persist increment within the transaction

        // 4) build parts
        // branchPart: 4 digits (use branch.id modulo 10000 if id grows)
//        long branchNumeric = branch.getBranchId();
//        if (branchNumeric < 0) branchNumeric = Math.abs(branchNumeric);
//        if (branchNumeric > 9999L) branchNumeric = branchNumeric % 10000L;
//        String branchPart = String.format("%04d", branchNumeric);
        String branchCode = branch.getBranchCode();
        String branchPart = branchCode.substring(0,4); // assuming branchCode is at least 4 chars

        // seqPart: 6 digits
        String seqPart = String.format("%06d", nextSeq);

        // suffix: 2-digit random between 10 and 99
        int suffix = random.nextInt(90) + 10;
        String suffixPart = String.format("%02d", suffix);

        String accountNumber = branchPart + seqPart + suffixPart; // length == 12

        // 5) very rare double-check against DB uniqueness (precaution)
        if (accountRepo.existsByAccountNumber(accountNumber)){
            // extremely unlikely because sequence and branchPart make it unique;
            // attempt a few suffix re-generations before failing
            boolean unique = false;
            for (int i = 0; i < 5; i++) {
                suffix = random.nextInt(90) + 10;
                suffixPart = String.format("%02d", suffix);
                accountNumber = branchPart + seqPart + suffixPart;
                if (!accountRepo.existsByAccountNumber(accountNumber)) {
                    unique = true;
                    break;
                }
            }
            if (!unique) {
                throw new IllegalStateException("Unable to generate unique account number after retries");
            }
        }
        return accountNumber;
    }
}

