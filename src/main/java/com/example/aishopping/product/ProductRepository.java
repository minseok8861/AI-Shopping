package com.example.aishopping.product;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByProductNameContaining(String keyword);

  List<Product> findByCategory(String category);

  List<Product> findByGender(String gender);

  List<Product> findByColor(String color);

  List<Product> findBySize(String size);

  @Query(
      """
      SELECT p FROM Product p WHERE (:gender IS NULL OR :gender = '' OR p.gender = :gender OR (:gender IN ('MEN', 'WOMEN') AND p.gender = 'UNISEX'))
         AND (:category IS NULL OR :category = '' OR p.category = :category)
         AND (:color IS NULL OR :color = '' OR p.color = :color)
         AND (:size IS NULL OR :size = '' OR p.size = :size)\
      """)
  List<Product> findByFilters(
      @Param("gender") String gender,
      @Param("category") String category,
      @Param("color") String color,
      @Param("size") String size);
}
