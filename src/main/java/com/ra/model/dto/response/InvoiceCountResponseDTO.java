package com.ra.model.dto.response;

import lombok.*;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class InvoiceCountResponseDTO {
    private Date date;
    private Long invoiceCount;
    private Double total;
}
