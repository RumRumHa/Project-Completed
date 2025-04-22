package com.ra.service.imp;

import com.ra.exception.CustomException;
import com.ra.model.dto.request.RoleRequestDTO;
import com.ra.model.dto.response.RoleResponseDTO;
import com.ra.model.entity.ERole;
import com.ra.model.entity.Role;
import com.ra.repository.RoleRepository;
import com.ra.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImp implements RoleService {
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<RoleResponseDTO> getRoles() {
        return roleRepository.findAll().stream()
                .map(role -> new RoleResponseDTO(role.getRoleId(), role.getRoleName().name()))
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponseDTO addRole(RoleRequestDTO roleRequestDTO) {
        return null;
    }

    @Override
    public RoleResponseDTO updateRole(Long roleId, RoleRequestDTO roleRequestDTO) {
        return null;
    }

    @Override
    public void deleteRole(Long roleId) {

    }

    @Override
    public Role findByRoleName(ERole roleName) {
        return roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new CustomException("Error: Role not found."));
    }
}
