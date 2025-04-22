package com.ra.model.entity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public enum EOrderStatus {
    @Enumerated(EnumType.STRING)
    WAITING,
    @Enumerated(EnumType.STRING)
    CONFIRM,
    @Enumerated(EnumType.STRING)
    DELIVERY,
    @Enumerated(EnumType.STRING)
    SUCCESS,
    @Enumerated(EnumType.STRING)
    CANCEL,
    @Enumerated(EnumType.STRING)
    DENIED
}