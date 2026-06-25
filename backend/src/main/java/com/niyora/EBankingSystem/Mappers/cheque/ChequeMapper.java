package com.niyora.EBankingSystem.Mappers.cheque;

import com.niyora.EBankingSystem.DTOs.cheque.ChequeReqDto;
import com.niyora.EBankingSystem.DTOs.cheque.ChequeRespDto;
import com.niyora.EBankingSystem.Entities.cheque.Cheque;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChequeMapper {

    @Mapping(source = "issuerAccount", target = "issuerAccountNumber")
    @Mapping(source = "payeeAccount", target = "payeeAccountNumber")
    @Mapping(source = "transaction.transactionId", target = "transactionId")
    ChequeRespDto toChequeRespDto(Cheque chq);

}
