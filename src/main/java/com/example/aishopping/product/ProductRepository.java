package com.example.aishopping.product;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByProductNameContaining(String keyword);
    List<Product> findByCategory(String category);
    List<Product> findByGender(String gender);
    List<Product> findByColor(String color);
    List<Product> findBySize(String size);

}
