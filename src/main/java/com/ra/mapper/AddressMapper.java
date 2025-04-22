package com.ra.mapper;

import com.ra.model.dto.request.AddressRequestDTO;
import com.ra.model.dto.response.AddressResponseDTO;
import com.ra.model.entity.Address;
import com.ra.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressMapper INSTANCE = Mappers.getMapper(AddressMapper.class);

    default Address addressRequestDTOToAddress(AddressRequestDTO addressRequestDTO, User user){
        Address address = new Address();
        address.setFullAddress(addressRequestDTO.getFullAddress());
        address.setPhone(addressRequestDTO.getPhone());
        address.setReceiveName(addressRequestDTO.getReceiveName());
        address.setUser(user);
        address.setIsDefault(false);
        return address;
    };
    default AddressResponseDTO toAddressResponseDTO(Address address) {
        if (address == null) {
            return null;
        }
        AddressResponseDTO dto = new AddressResponseDTO();
        dto.setAddressId(address.getAddressId());
        dto.setFullAddress(address.getFullAddress());
        dto.setPhone(address.getPhone());
        dto.setReceiveName(address.getReceiveName());
        dto.setIsDefault(address.getIsDefault());
        return dto;
    }
}
