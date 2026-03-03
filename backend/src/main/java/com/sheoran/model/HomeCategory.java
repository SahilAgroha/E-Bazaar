package com.sheoran.model;

import com.sheoran.domain.HomeCategorySection;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "home_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class HomeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String image;

    @Column(nullable = false)
    private String categoryId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HomeCategorySection section;

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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public HomeCategorySection getSection() {
        return section;
    }

    public void setSection(HomeCategorySection section) {
        this.section = section;
    }
}