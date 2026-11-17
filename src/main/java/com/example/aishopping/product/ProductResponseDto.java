package com.example.aishopping.product;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductResponseDto {
  private Long id;
  private String productName;
  private String gender;
  private String category;
  private String color;
  private Integer price;
  private String imageUrl;
  private String size;
}
