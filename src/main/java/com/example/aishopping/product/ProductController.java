package com.example.aishopping.product;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public List<Product> getProducts() {
        return productService.getProducts();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable long id) {
        return productService.getProduct(id);
    }

    @GetMapping("/search")
    public List<Product> searchProduct(@RequestParam String keyword) {
        return productService.searchProduct(keyword);
    }

    @GetMapping("/category")
    public List<Product> getProductsByCategory(@RequestParam String category) {
        return productService.getProductsByCategory(category);
    }

    @GetMapping("/gender")
    public List<Product> getProductsByGender(@RequestParam String gender) {
        return productService.getProductsByGender(gender);
    }

    @GetMapping("/color")
    public List<Product> getProductsByColor(@RequestParam String color) {
        return productService.getProductsByColor(color);
    }

    @GetMapping("/size")
    public List<Product> getProductsBySize(@RequestParam String size) {
        return productService.getProductsBySize(size);
    }

}
