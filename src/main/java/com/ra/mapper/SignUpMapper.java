package com.ra.mapper;

import com.ra.model.dto.request.SignupRequestDTO;
import com.ra.model.dto.request.UserRequestDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SignUpMapper {
    SignUpMapper INSTANCE = Mappers.getMapper(SignUpMapper.class);
    UserRequestDTO signupRequestDTOToUserRequestDTO(SignupRequestDTO signupRequestDTO);
}
