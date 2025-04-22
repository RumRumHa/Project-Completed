package com.ra.service;

import com.ra.model.dto.request.RoleRequestDTO;
import com.ra.model.dto.response.RoleResponseDTO;
import com.ra.model.entity.ERole;
import com.ra.model.entity.Role;

import java.util.List;

public interface RoleService {
    List<RoleResponseDTO> getRoles();
    RoleResponseDTO addRole(RoleRequestDTO roleRequestDTO);
    RoleResponseDTO updateRole(Long roleId, RoleRequestDTO roleRequestDTO);
    void deleteRole(Long roleId);
    Role findByRoleName(ERole roleName);
}
