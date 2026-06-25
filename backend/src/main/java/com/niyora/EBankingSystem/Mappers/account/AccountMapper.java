package com.niyora.EBankingSystem.Mappers.account;

import com.niyora.EBankingSystem.DTOs.account.AccountDto;
import com.niyora.EBankingSystem.Entities.account.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AccountMapper {


    @Mapping(source = "customer.customerId", target = "customerId")
    @Mapping(source = "branch.branchName", target = "branchName")
    @Mapping(source = "branch.branchCode", target = "branchCode")
    @Mapping(source = "branch.branchIfsc", target = "branchIfsc")
    AccountDto toAccountDto(Account account);

    List<AccountDto> toAccountDtoList(List<Account> accounts);

}
