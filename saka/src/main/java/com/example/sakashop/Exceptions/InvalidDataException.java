package com.example.sakashop.Exceptions;

public class InvalidDataException extends RuntimeException {
  public InvalidDataException(String message) {
    super(message);
  }

  public InvalidDataException(String message, Throwable cause) {
    super(message, cause);
  }
}
