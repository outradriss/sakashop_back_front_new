package com.example.sakashop.Exceptions;

public class ResourceNotFoundException extends RuntimeException  {
  public ResourceNotFoundException(String message) {
    super(message);
  }
}
