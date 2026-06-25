package com.niyora.EBankingSystem.Services.manager;


import com.niyora.EBankingSystem.DTOs.auth.RegisterReqDto;
import com.niyora.EBankingSystem.DTOs.manager.ManagerDto;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.users.Manager;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Mappers.manager.ManagerMapper;
import com.niyora.EBankingSystem.Repositories.BranchRepository;
import com.niyora.EBankingSystem.Repositories.ManagerRepository;
import com.niyora.EBankingSystem.Services.auth.AuthenticationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final AuthenticationService authService;
    private final ManagerRepository managerRepo;
    private final BranchRepository branchRepo;
    private final ManagerMapper managerMapper;



    @Transactional
    public ManagerDto registerManager(RegisterReqDto registerReqDto, Set<String> roles, User loggedInUser, Long branchId) {
        User newUser=authService.registerUser(registerReqDto, roles);

        Branch branch=branchRepo.findById(branchId).orElseThrow(()->new RuntimeException("Branch not found with id: "+branchId));
        Manager manager=new Manager();
        manager.setCreatedBy(loggedInUser);
        manager.setUser(newUser);
        manager.setBranch(branch);
        Manager savedManager=managerRepo.save(manager);
        return managerMapper.toManagerDto(savedManager);
    }

    public Manager getManagerById(Long managerId) {
        return managerRepo.findByManagerId(managerId).orElseThrow(()->new RuntimeException("Manager not found with id: "+managerId));
    }
}
