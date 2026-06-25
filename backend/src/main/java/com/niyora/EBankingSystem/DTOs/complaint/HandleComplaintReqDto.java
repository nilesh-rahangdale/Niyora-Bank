package com.niyora.EBankingSystem.DTOs.complaint;

import com.niyora.EBankingSystem.Entities.requests.Complaint;
import lombok.Data;

@Data
public class HandleComplaintReqDto {
    private Complaint.Status status;   // RESOLVED or REJECTED
    private String rejectReason;       // Required when status is REJECTED
}
