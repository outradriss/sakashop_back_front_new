package com.example.sakashop.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditDTO {

  private String nameClient;
  private String comment;
  private LocalDate localDateTime;
  private LocalDate datePayCredit;
  private String productName;
  private double productPrice;
  private int quantity;
  private double totale;
}
