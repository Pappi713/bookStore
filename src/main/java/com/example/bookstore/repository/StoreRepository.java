package com.example.bookstore.repository;

import com.example.bookstore.domain.Store;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Store entity.
 */
@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    @Query(
        value = "select distinct store from Store store left join fetch store.books",
        countQuery = "select count(distinct store) from Store store"
    )
    Page<Store> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct store from Store store left join fetch store.books")
    List<Store> findAllWithEagerRelationships();

    @Query("select store from Store store left join fetch store.books where store.id =:id")
    Optional<Store> findOneWithEagerRelationships(@Param("id") Long id);
}
