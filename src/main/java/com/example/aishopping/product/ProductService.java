package com.example.aishopping.product;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class ProductService {

  private final ProductRepository productRepository;

  private ProductResponseDto convertToDto(Product product) {
    ProductResponseDto dto = new ProductResponseDto();
    dto.setId(product.getId());
    dto.setProductName(product.getProductName());
    dto.setGender(product.getGender());
    dto.setCategory(product.getCategory());
    dto.setColor(product.getColor());
    dto.setPrice(product.getPrice());
    dto.setImageUrl(product.getImageUrl());
    dto.setSize(product.getSize());
    return dto;
  }

  @Transactional
  protected Product findProduct(Long id) {
    return productRepository
        .findById(id)
        .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
  }

  @Transactional(readOnly = true)
  public List<ProductResponseDto> getProducts() {
    return productRepository.findAll().stream().map(this::convertToDto).toList();
  }

  @Transactional(readOnly = true)
  public ProductResponseDto getProduct(Long id) {
    return convertToDto(findProduct(id));
  }

  @Transactional(readOnly = true)
  public List<ProductResponseDto> searchProduct(String keyword) {
    return productRepository.findByProductNameContaining(keyword).stream()
        .map(this::convertToDto)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<ProductResponseDto> getProductsByCategory(String category) {
    return productRepository.findByCategory(category).stream().map(this::convertToDto).toList();
  }

  @Transactional(readOnly = true)
  public List<ProductResponseDto> getProductsByGender(String gender) {
    return productRepository.findByGender(gender).stream().map(this::convertToDto).toList();
  }

  @Transactional(readOnly = true)
  public List<ProductResponseDto> getProductsByColor(String color) {
    return productRepository.findByColor(color).stream().map(this::convertToDto).toList();
  }

  @Transactional(readOnly = true)
  public List<ProductResponseDto> getProductsBySize(String size) {
    return productRepository.findBySize(size).stream().map(this::convertToDto).toList();
  }

  @Transactional
  public ProductResponseDto createProduct(ProductRequestDto productRequestDto) {
    Product product = new Product();
    product.setProductName(productRequestDto.getProductName());
    product.setGender(productRequestDto.getGender());
    product.setCategory(productRequestDto.getCategory());
    product.setColor(productRequestDto.getColor());
    product.setPrice(productRequestDto.getPrice());
    product.setImageUrl(productRequestDto.getImageUrl());
    product.setSize(productRequestDto.getSize());

    Product savedProduct = productRepository.save(product);
    return convertToDto(savedProduct);
  }

  @Transactional
  public ProductResponseDto updateProduct(Long id, ProductRequestDto productRequestDto) {
    Product product = findProduct(id);
    product.setProductName(productRequestDto.getProductName());
    product.setGender(productRequestDto.getGender());
    product.setCategory(productRequestDto.getCategory());
    product.setColor(productRequestDto.getColor());
    product.setPrice(productRequestDto.getPrice());
    product.setImageUrl(productRequestDto.getImageUrl());
    product.setSize(productRequestDto.getSize());

    Product updatedProduct = productRepository.save(product);
    return convertToDto(updatedProduct);
  }

  @Transactional
  public void deleteProduct(Long id) {
    Product product = findProduct(id);
    productRepository.delete(product);
  }
}
