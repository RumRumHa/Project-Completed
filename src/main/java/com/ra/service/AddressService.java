package com.ra.service;

import com.ra.exception.CustomException;
import com.ra.model.dto.request.AddressRequestDTO;
import com.ra.model.dto.response.AddressResponseDTO;

import java.util.List;

public interface AddressService {
    AddressResponseDTO addAddress(AddressRequestDTO addressRequestDTO);
    void deleteAddress(Long addressId) throws CustomException;
    List<AddressResponseDTO> getAddresses() throws CustomException;
    AddressResponseDTO getAddressById(Long addressId);
    void setDefaultAddress(Long addressId) throws CustomException;
    AddressResponseDTO getDefaultAddress() throws CustomException;
    AddressResponseDTO updateAddress(Long addressId, AddressRequestDTO addressRequestDTO) throws CustomException;
}
