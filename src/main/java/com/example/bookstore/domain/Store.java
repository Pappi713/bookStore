package com.example.bookstore.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Store.
 */
@Entity
@Table(name = "store")
public class Store implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "adress")
    private String adress;

    @ManyToMany
    @JoinTable(name = "rel_store__book", joinColumns = @JoinColumn(name = "store_id"), inverseJoinColumns = @JoinColumn(name = "book_id"))
    @JsonIgnoreProperties(value = { "author", "publisher", "stores" }, allowSetters = true)
    private Set<Book> books = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Store id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Store name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAdress() {
        return this.adress;
    }

    public Store adress(String adress) {
        this.setAdress(adress);
        return this;
    }

    public void setAdress(String adress) {
        this.adress = adress;
    }

    public Set<Book> getBooks() {
        return this.books;
    }

    public void setBooks(Set<Book> books) {
        this.books = books;
    }

    public Store books(Set<Book> books) {
        this.setBooks(books);
        return this;
    }

    public Store addBook(Book book) {
        this.books.add(book);
        book.getStores().add(this);
        return this;
    }

    public Store removeBook(Book book) {
        this.books.remove(book);
        book.getStores().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Store)) {
            return false;
        }
        return id != null && id.equals(((Store) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Store{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", adress='" + getAdress() + "'" +
            "}";
    }
}
