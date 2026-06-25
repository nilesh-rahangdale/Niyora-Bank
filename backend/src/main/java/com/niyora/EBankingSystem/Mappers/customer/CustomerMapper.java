package com.niyora.EBankingSystem.Mappers.customer;

import com.niyora.EBankingSystem.DTOs.customer.CustomerDto;
import com.niyora.EBankingSystem.Entities.users.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    @Mapping(source = "createdBy.id" , target = "createdById")
    @Mapping(source = "user", target = "userDetails")
    CustomerDto toCustomerDto(Customer customer);


}
