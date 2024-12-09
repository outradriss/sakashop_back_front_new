package com.example.sakashop.Exceptions;


import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
  private String message;
  private String errorType;
  private LocalDateTime timestamp;

  public ErrorResponse(String message, String errorType) {
    this.message = message;
    this.errorType = errorType;
    this.timestamp = LocalDateTime.now();
  }

}
