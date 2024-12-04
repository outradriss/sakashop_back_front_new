package com.example.sakashop.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "categories")
@NoArgsConstructor
public class Categories {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false, unique = true)
  private String name;

  @Column(name = "creation_date")
  private LocalDateTime createdDate = LocalDateTime.now();

  @OneToMany(mappedBy = "categories", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonBackReference
  private List<Item> items; // Liste des items liés à cette catégorie

  public Categories(Long id, String name, LocalDateTime createdDate, List<Item> items) {
    this.id = id;
    this.name = name;
    this.createdDate = createdDate;
    this.items = items;
  }

  public Categories(Long id, String name, LocalDateTime createdDate) {
    this.id = id;
    this.name = name;
    this.createdDate = createdDate;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public LocalDateTime getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(LocalDateTime createdDate) {
    this.createdDate = createdDate;
  }
}
