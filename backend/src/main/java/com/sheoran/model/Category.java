package com.sheoran.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(unique = true, nullable = false)
    private String categoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parentCategory;

    @NotNull
    @Column(nullable = false)
    private Integer level;

    public void setPatentCategory(Category level1) {

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

    public @NotNull String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(@NotNull String categoryId) {
        this.categoryId = categoryId;
    }

    public Category getParentCategory() {
        return parentCategory;
    }

    public void setParentCategory(Category parentCategory) {
        this.parentCategory = parentCategory;
    }

    public @NotNull Integer getLevel() {
        return level;
    }

    public void setLevel(@NotNull Integer level) {
        this.level = level;
    }

    public Category(Long id, String name, String categoryId, Category parentCategory, Integer level) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.parentCategory = parentCategory;
        this.level = level;
    }

    public Category() {
    }
}