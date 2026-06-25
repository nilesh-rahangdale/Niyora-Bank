package com.niyora.EBankingSystem.DTOs.branch;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BranchRegDto {
    @NotNull
    private String bankName;
    @NotNull
    private String branchName;
    @NotNull
    @Pattern(regexp = "\\d{6}", message = "Branch code must be exactly 6 digits")
    private String branchCode;
    @NotNull
    @Pattern(regexp = "[A-Z]{4}0[A-Z0-9]{6}", message = "Branch IFSC must be 11 characters (4 letters + 0 + 6 alphanumeric)")
    @Size(min = 11, max = 11, message = "Branch IFSC must be exactly 11 characters")
    private String branchIfsc;
    @NotNull
    private String address;
    @NotNull
    private String contactNumber;

}
