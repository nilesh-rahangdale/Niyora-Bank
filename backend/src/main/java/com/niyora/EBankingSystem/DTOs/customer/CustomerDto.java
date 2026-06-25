package com.niyora.EBankingSystem.DTOs.customer;

import com.niyora.EBankingSystem.DTOs.user.UserDto;
import com.niyora.EBankingSystem.Entities.users.Customer;
import com.niyora.EBankingSystem.Entities.users.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
public class CustomerDto {
    private Long customerId;
    private Long createdById;
    private UserDto userDetails;
    private String fatherName;
    private LocalDate dob;
    private String gender;
    private Customer.MaritalStatus maritalStatus;
    private String address;
    private Map<String, String> kycDocs;
    private boolean KYCStatus;
}
