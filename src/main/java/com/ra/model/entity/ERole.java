package com.ra.model.entity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public enum ERole {
    @Enumerated(EnumType.STRING)
    ADMIN,
    @Enumerated(EnumType.STRING)
    USER,
    @Enumerated(EnumType.STRING)
    MANAGER
}