package com.example.aishopping.product;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
  private final ProductService productService;

  @GetMapping
  public List<ProductResponseDto> getProducts() {
    return productService.getProducts();
  }

  @GetMapping("/{id}")
  public ProductResponseDto getProduct(@PathVariable long id) {
    return productService.getProduct(id);
  }

  @GetMapping("/search")
  public List<ProductResponseDto> searchProduct(@RequestParam String keyword) {
    return productService.searchProduct(keyword);
  }

  @GetMapping("/category")
  public List<ProductResponseDto> getProductsByCategory(@RequestParam String category) {
    return productService.getProductsByCategory(category);
  }

  @GetMapping("/gender")
  public List<ProductResponseDto> getProductsByGender(@RequestParam String gender) {
    return productService.getProductsByGender(gender);
  }

  @GetMapping("/color")
  public List<ProductResponseDto> getProductsByColor(@RequestParam String color) {
    return productService.getProductsByColor(color);
  }

  @GetMapping("/size")
  public List<ProductResponseDto> getProductsBySize(@RequestParam String size) {
    return productService.getProductsBySize(size);
  }

  @PostMapping
  public ProductResponseDto createProduct(@Valid @RequestBody ProductRequestDto productRequestDto) {
    return productService.createProduct(productRequestDto);
  }

  @PutMapping("/{id}")
  public ProductResponseDto updateProduct(
      @PathVariable long id, @Valid @RequestBody ProductRequestDto productRequestDto) {
    return productService.updateProduct(id, productRequestDto);
  }

  @DeleteMapping("/{id}")
  public void deleteProduct(@PathVariable long id) {
    productService.deleteProduct(id);
  }

  @GetMapping("/filter")
  public List<ProductResponseDto> getProductsByFilters(
      @RequestParam(required = false) String gender,
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String color,
      @RequestParam(required = false) String size) {
    return productService.getProductsByFilters(gender, category, color, size);
  }

  @GetMapping("/sort")
  public List<ProductResponseDto> getProductsSorted(@RequestParam String sort) {
    return productService.getProductsSorted(sort);
  }

  @GetMapping("/page")
  public Page<ProductResponseDto> getProductsPaged(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "latest") String sort) {
    return productService.getProductsPaged(page, size, sort);
  }
}
