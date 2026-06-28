package com.niyora.EBankingSystem.Services.teller;

import com.niyora.EBankingSystem.DTOs.auth.RegisterReqDto;
import com.niyora.EBankingSystem.DTOs.teller.TellerDto;
import com.niyora.EBankingSystem.DTOs.teller.TellerUpdateDto;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.users.Teller;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Mappers.teller.TellerMapper;
import com.niyora.EBankingSystem.Repositories.BranchRepository;
import com.niyora.EBankingSystem.Repositories.TellerRepository;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import com.niyora.EBankingSystem.Services.auth.AuthenticationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TellerService {
    
    private final TellerRepository tellerRepo;
    private final AuthenticationService authService;
    private final BranchRepository branchRepo;
    private final TellerMapper tellerMapper;
    private final UserRepository userRepo;
    
    @Transactional
    public TellerDto registerTeller(RegisterReqDto registerReqDto, Set<String> roles, User loggedInUser, Long branchId) {
        try{
            User newUser=authService.registerUser(registerReqDto,roles);
            Branch branch=branchRepo.findById(branchId).orElseThrow(
                    ()-> new RuntimeException("Branch not found with id: "+branchId)
            );

            Teller teller=Teller.builder()
                    .user(newUser)
                    .createdBy(loggedInUser)
                    .branch(branch)
                    .build();

            teller=tellerRepo.save(teller);

            return tellerMapper.toTellerDto(teller);

        }catch (Exception e){
            System.out.println(e);
            throw new RuntimeException(e);
        }
    }

    public TellerDto getTellerById(Long tellerId) {
        Teller teller=tellerRepo.findById(tellerId).orElseThrow(
                ()-> new RuntimeException("Teller not found with id: "+tellerId)
        );
        return tellerMapper.toTellerDto(teller);
    }

    public TellerDto setCashDrawer(String cashDrawerId, String email) {
        User user=userRepo.findByEmail(email).orElseThrow( ()-> new RuntimeException("User not found with email: "+email));
        Teller teller=user.getTeller();
        teller.setCashDrawerId(cashDrawerId);
        teller=tellerRepo.save(teller);
        return tellerMapper.toTellerDto(teller);

//                =tellerRepo.findById(tellerId).orElseThrow(()-> new RuntimeException("Teller not found with id: "+tellerId));
    }

    public TellerDto setLastBalanced(LocalDateTime lastBalancedDate, String email) {
        User user=userRepo.findByEmail(email).orElseThrow( ()-> new RuntimeException("User not found with email: "+email));
        Teller teller=user.getTeller();
        teller.setLastBalanced(lastBalancedDate);
        teller=tellerRepo.save(teller);
        return tellerMapper.toTellerDto(teller);
    }

    public List<TellerDto> getAllTellers() {
        return tellerRepo.findAll().stream()
                .map(tellerMapper::toTellerDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TellerDto updateTeller(Long tellerId, TellerUpdateDto updateDto) {
        Teller teller = tellerRepo.findById(tellerId)
                .orElseThrow(() -> new RuntimeException("Teller not found with id: " + tellerId));
        User user = teller.getUser();

        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getEmail() != null) user.setEmail(updateDto.getEmail());
        if (updateDto.getPhoneNumber() != null) user.setPhoneNumber(updateDto.getPhoneNumber());
        if (updateDto.getStatus() != null) user.setStatus(updateDto.getStatus());

        if (updateDto.getBranchId() != null) {
            Branch branch = branchRepo.findById(updateDto.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found with id: " + updateDto.getBranchId()));
            teller.setBranch(branch);
        }

        if (updateDto.getCashDrawerId() != null) {
            teller.setCashDrawerId(updateDto.getCashDrawerId());
        }

        userRepo.save(user);
        Teller savedTeller = tellerRepo.save(teller);
        return tellerMapper.toTellerDto(savedTeller);
    }
}
