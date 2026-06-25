package com.niyora.EBankingSystem.Controllers.customer;

import com.niyora.EBankingSystem.DTOs.customer.CustomerDto;
import com.niyora.EBankingSystem.DTOs.customer.CustomerUpdateDto;
import com.niyora.EBankingSystem.DTOs.customer.RegisterCustomerDto;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import com.niyora.EBankingSystem.Services.customer.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final UserRepository userRepo;

//    Register a new customer - only CSO can register a customer
    @PreAuthorize("hasAnyRole('ROLE_CSO','ROLE_MANAGER')")
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisterCustomerDto registerCustomerDto, Authentication authentication) {
        if(authentication==null){
            return ResponseEntity.status(401).body("user is not authenticated");
        }
        String email = authentication.getName();
        User loggedInUser = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Set<String> roles=new HashSet<>();
        roles.add("ROLE_CUSTOMER");

        CustomerDto customerDto=customerService.registerCustomer(registerCustomerDto,roles, loggedInUser);

        return ResponseEntity.ok(customerDto);

    }

//    Get customer details by customer id
    @PreAuthorize("hasAnyRole('ROLE_CSO','ROLE_MANAGER','ROLE_TELLER')")
    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long customerId){
        CustomerDto customerDto=customerService.getCustomerById(customerId);
        return ResponseEntity.ok(customerDto);
    }

//   Update user status
    @PreAuthorize("hasAnyRole('ROLE_CSO','ROLE_MANAGER')")
    @PatchMapping("/{customerId}/KYC")
    public ResponseEntity<String> updateCustomerKyc(@PathVariable Long customerId, @RequestBody CustomerUpdateDto updateDto){
        String resp= customerService.updateCustomerKyc(customerId, updateDto);
        return ResponseEntity.ok(resp);
    }



}
