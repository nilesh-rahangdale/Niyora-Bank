package com.niyora.EBankingSystem.Services.admin;

import com.niyora.EBankingSystem.DTOs.auth.RegisterReqDto;
import com.niyora.EBankingSystem.Entities.users.Admin;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Repositories.AdminRepository;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import com.niyora.EBankingSystem.Services.auth.AuthenticationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final AuthenticationService authService;

    @Transactional
    public Admin registerAdmin(RegisterReqDto registerReqDto, Set<String> roles, User loggedInUser) {
        User user=authService.registerUser(registerReqDto, roles);

        Admin admin=new Admin();

        admin.setUser(user);
        admin.setCreatedBy(loggedInUser);
        admin.setAdminLevel("SUPER_ADMIN");
        admin.setPermissions("CRUD");

        Admin savedAdmin=adminRepository.save(admin);

        return savedAdmin;

    }

    public Admin getAdminById(Long adminId) {
        return adminRepository.findByUserId(adminId).orElseThrow(()->new RuntimeException("Admin not found with id: "+adminId));
    }
}
