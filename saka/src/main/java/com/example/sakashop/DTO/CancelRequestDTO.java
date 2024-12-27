package com.example.sakashop.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelRequestDTO {
  private List<Long> itemId;
  private String reason;
}
