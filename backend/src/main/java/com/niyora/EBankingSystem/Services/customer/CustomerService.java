package com.niyora.EBankingSystem.Services.customer;


import com.niyora.EBankingSystem.DTOs.auth.RegisterReqDto;
import com.niyora.EBankingSystem.DTOs.customer.CustomerDto;
import com.niyora.EBankingSystem.DTOs.customer.CustomerUpdateDto;
import com.niyora.EBankingSystem.DTOs.customer.RegisterCustomerDto;
import com.niyora.EBankingSystem.Entities.users.Customer;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Mappers.customer.CustomerMapper;
import com.niyora.EBankingSystem.Repositories.CustomerRepository;
import com.niyora.EBankingSystem.Services.auth.AuthenticationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;


@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepo;
    private final AuthenticationService authService;
    private final CustomerMapper customerMapper;

    @Transactional
    public CustomerDto registerCustomer(RegisterCustomerDto registerCustomerDto, Set<String> roles, User loggedInUser) {
        RegisterReqDto registerReqDto=RegisterReqDto.builder()
                .email(registerCustomerDto.getEmail())
                .fullName(registerCustomerDto.getFullName())
                .phoneNumber(registerCustomerDto.getPhoneNumber())
                .password(registerCustomerDto.getPassword())
                .build();

        User user=authService.registerUser(registerReqDto, roles);

        Customer customer= Customer.builder()
                .createdBy(loggedInUser)
                .user(user)
                .KYCStatus(true)
                .fatherName(registerCustomerDto.getFatherName())
                .gender(registerCustomerDto.getGender())
                .dob(registerCustomerDto.getDob())
                .maritalStatus( registerCustomerDto.getMaritalStatus())
                .kycDocs(registerCustomerDto.getKycDocs())
                .address(registerCustomerDto.getAddress())
                .build();

        Customer savedCustomer=customerRepo.save(customer);

        return customerMapper.toCustomerDto(savedCustomer);

    }

    public CustomerDto getCustomerById(Long customerId) {

        Customer customer=customerRepo.findByCustomerId(customerId).orElseThrow(()->new RuntimeException("Customer not found with id: "+customerId));
        return customerMapper.toCustomerDto(customer);
    }

    @Transactional
    public String updateCustomerKyc(Long customerId, CustomerUpdateDto updateDto) {
        Customer customer=customerRepo.findByCustomerId(customerId).orElseThrow(()->new RuntimeException("Customer not found with id: "+customerId));
        User user = customer.getUser();

//        if (updateDto.getEmail() != null) user.setEmail(updateDto.getEmail());
        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getPhoneNumber() != null) user.setPhoneNumber(updateDto.getPhoneNumber());

        if (updateDto.getFatherName() != null) customer.setFatherName(updateDto.getFatherName());
        if (updateDto.getDob() != null) customer.setDob(updateDto.getDob());
        if (updateDto.getGender() != null) customer.setGender(updateDto.getGender());
        if (updateDto.getMaritalStatus() != null) customer.setMaritalStatus(updateDto.getMaritalStatus());
        if (updateDto.getAddress() != null) customer.setAddress(updateDto.getAddress());
        if (updateDto.getKycDocs() != null) customer.setKycDocs(updateDto.getKycDocs());

        customer.setKYCStatus(true);
        customerRepo.save(customer);
        return "Customer KYC updated successfully";
    }


}
