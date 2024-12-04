package com.example.sakashop.Exceptions;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

  private String error; // Le type ou le titre de l'erreur
  private String message; // Le message d'erreur détaillé

}
