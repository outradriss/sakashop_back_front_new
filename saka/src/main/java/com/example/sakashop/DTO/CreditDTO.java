package com.example.sakashop.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditDTO {

  private String clientName;
  private String comment;
  private LocalDate creditDate;
  private LocalDate dueDate;
  private String productName;
  private double productPrice;
  private int quantity;
  private double total;
}
