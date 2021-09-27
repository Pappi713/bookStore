package com.example.bookstore.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Book.
 */
@Entity
@Table(name = "book")
public class Book implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "page_no")
    private Long pageNo;

    @ManyToOne
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private Author author;

    @ManyToOne
    private Publisher publisher;

    @ManyToMany(mappedBy = "books")
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private Set<Store> stores = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Book id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Book title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getPageNo() {
        return this.pageNo;
    }

    public Book pageNo(Long pageNo) {
        this.setPageNo(pageNo);
        return this;
    }

    public void setPageNo(Long pageNo) {
        this.pageNo = pageNo;
    }

    public Author getAuthor() {
        return this.author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public Book author(Author author) {
        this.setAuthor(author);
        return this;
    }

    public Publisher getPublisher() {
        return this.publisher;
    }

    public void setPublisher(Publisher publisher) {
        this.publisher = publisher;
    }

    public Book publisher(Publisher publisher) {
        this.setPublisher(publisher);
        return this;
    }

    public Set<Store> getStores() {
        return this.stores;
    }

    public void setStores(Set<Store> stores) {
        if (this.stores != null) {
            this.stores.forEach(i -> i.removeBook(this));
        }
        if (stores != null) {
            stores.forEach(i -> i.addBook(this));
        }
        this.stores = stores;
    }

    public Book stores(Set<Store> stores) {
        this.setStores(stores);
        return this;
    }

    public Book addStore(Store store) {
        this.stores.add(store);
        store.getBooks().add(this);
        return this;
    }

    public Book removeStore(Store store) {
        this.stores.remove(store);
        store.getBooks().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Book)) {
            return false;
        }
        return id != null && id.equals(((Book) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Book{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", pageNo=" + getPageNo() +
            "}";
    }
}
