package com.niyora.EBankingSystem.Mappers.teller;

import com.niyora.EBankingSystem.DTOs.teller.TellerDto;
import com.niyora.EBankingSystem.Entities.users.Teller;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TellerMapper {

    @Mapping(source = "user", target = "userDto")
    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "branch.branchId", target = "branchId")
    TellerDto toTellerDto(Teller teller);

}
