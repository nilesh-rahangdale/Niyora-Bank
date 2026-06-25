package com.niyora.EBankingSystem.Controllers.MobileApis.profile;

import com.niyora.EBankingSystem.DTOs.customer.CustomerDto;
import com.niyora.EBankingSystem.Services.customer.MobileCustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mobile/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class MobileProfileController {

    private final MobileCustomerService mobileCustomerService;

    /**
     * GET /api/mobile/profile
     * Returns the full profile of the currently authenticated customer.
     */
    @GetMapping
    public ResponseEntity<CustomerDto> getMyProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        CustomerDto profile = mobileCustomerService.getMyProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }
}
