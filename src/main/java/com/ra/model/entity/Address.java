package com.ra.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "full_address", nullable = false)
    private String fullAddress;

    @Column(name = "phone", nullable = false, length = 15)
    private String phone;

    @Column(name = "receive_name", nullable = false, length = 50)
    private String receiveName;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault;
}