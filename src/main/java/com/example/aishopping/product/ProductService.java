package com.example.aishopping.product;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(long id) {
    return productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
    }

    public List<Product> searchProduct(String keyword) {
        return productRepository.findByProductNameContaining(keyword);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getProductsByGender(String gender) {
        return productRepository.findByGender(gender);
    }

    public List<Product> getProductsByColor(String color) {
        return productRepository.findByColor(color);
    }

    public List<Product> getProductsBySize(String size) {
        return productRepository.findBySize(size);
    }

    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(long id, Product updatedProduct) {
        Product product = getProduct(id);
        product.setProductName(updatedProduct.getProductName());
        product.setGender(updatedProduct.getGender());
        product.setCategory(updatedProduct.getCategory());
        product.setColor(updatedProduct.getColor());
        product.setPrice(updatedProduct.getPrice());
        product.setImageUrl(updatedProduct.getImageUrl());
        product.setSize(updatedProduct.getSize());
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(long id) {
        Product product = getProduct(id);
        productRepository.delete(product);
    }
}
