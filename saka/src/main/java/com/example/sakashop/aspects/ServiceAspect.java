package com.example.sakashop.aspects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import org.aspectj.lang.annotation.Aspect;

import java.util.Arrays;

@Aspect
@Component
public class ServiceAspect {
  // Intercepte toutes les méthodes du package service
  @Around("execution(* com.example.sakashop.services.*.*(..))")
  public Object logAndHandleExceptions(ProceedingJoinPoint joinPoint) throws Throwable {
    long startTime = System.currentTimeMillis();
    try {
      // Log avant l'exécution de la méthode
      System.out.println("Début de la méthode : " + joinPoint.getSignature().toShortString());
      System.out.println("Arguments : " + Arrays.toString(joinPoint.getArgs()));

      // Exécution de la méthode cible
      Object result = joinPoint.proceed();

      // Log après l'exécution réussie
      System.out.println("Méthode exécutée avec succès : " + joinPoint.getSignature().toShortString());
      return result;

    } catch (Exception e) {
      // Gestion des exceptions
      System.err.println("Exception dans la méthode : " + joinPoint.getSignature().toShortString());
      System.err.println("Cause : " + e.getMessage());
      throw e; // Propager l'exception pour être gérée plus haut
    } finally {
      long duration = System.currentTimeMillis() - startTime;
      System.out.println("Durée d'exécution : " + duration + " ms");
    }
  }
}

