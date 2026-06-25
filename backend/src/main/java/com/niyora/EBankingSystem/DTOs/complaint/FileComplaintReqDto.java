package com.niyora.EBankingSystem.DTOs.complaint;

import lombok.Data;

@Data
public class FileComplaintReqDto {
    private String description;
    private String branchIfsc;
}
