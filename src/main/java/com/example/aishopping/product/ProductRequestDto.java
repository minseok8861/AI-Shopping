package com.example.aishopping.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductRequestDto {

  @NotBlank(message = "상품 이름은 필수입니다.")
  private String productName;

  @NotBlank(message = "상품 카테고리는 필수입니다.")
  private String category;

  @NotBlank(message = "성별은 필수입니다.")
  private String gender;

  @NotBlank(message = "색상은 필수입니다.")
  private String color;

  @NotBlank(message = "사이즈는 필수입니다.")
  private String size;

  @NotNull(message = "가격은 필수입니다.")
  @Positive(message = "가격은 0보다 커야 합니다.")
  private int price;

  @NotBlank(message = "이미지 URL은 필수입니다.")
  private String imageUrl;
}
