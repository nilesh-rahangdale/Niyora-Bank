package com.niyora.EBankingSystem.Services.admin;

import com.niyora.EBankingSystem.DTOs.auth.RegisterReqDto;
import com.niyora.EBankingSystem.DTOs.admin.AdminUpdateDto;
import com.niyora.EBankingSystem.Entities.users.Admin;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Repositories.AdminRepository;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import com.niyora.EBankingSystem.Repositories.BranchRepository;
import com.niyora.EBankingSystem.Services.auth.AuthenticationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final AuthenticationService authService;
    private final BranchRepository branchRepository;

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

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Transactional
    public Admin updateAdmin(Long adminId, AdminUpdateDto updateDto) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        User user = admin.getUser();

        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getEmail() != null) user.setEmail(updateDto.getEmail());
        if (updateDto.getPhoneNumber() != null) user.setPhoneNumber(updateDto.getPhoneNumber());
        if (updateDto.getStatus() != null) user.setStatus(updateDto.getStatus());

        if (updateDto.getAdminLevel() != null) admin.setAdminLevel(updateDto.getAdminLevel());
        if (updateDto.getPermissions() != null) admin.setPermissions(updateDto.getPermissions());
        if (updateDto.getBranchId() != null) {
            Branch branch = branchRepository.findById(updateDto.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found with id: " + updateDto.getBranchId()));
            admin.setBranch(branch);
        }

        userRepository.save(user);
        return adminRepository.save(admin);
    }
}
