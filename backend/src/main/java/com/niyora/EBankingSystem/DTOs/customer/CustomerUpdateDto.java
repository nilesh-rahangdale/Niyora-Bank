package com.niyora.EBankingSystem.DTOs.customer;

import com.niyora.EBankingSystem.Entities.users.Customer;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
public class CustomerUpdateDto {

    private String fullName;
    private String phoneNumber;


    private String fatherName;
    private LocalDate dob;
    private String gender;
    private Customer.MaritalStatus maritalStatus;
    private String address;
    private Map<String, String> kycDocs;

}
