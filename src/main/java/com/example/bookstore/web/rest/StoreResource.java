package com.example.bookstore.web.rest;

import com.example.bookstore.domain.Store;
import com.example.bookstore.repository.StoreRepository;
import com.example.bookstore.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.example.bookstore.domain.Store}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StoreResource {

    private final Logger log = LoggerFactory.getLogger(StoreResource.class);

    private static final String ENTITY_NAME = "store";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StoreRepository storeRepository;

    public StoreResource(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    /**
     * {@code POST  /stores} : Create a new store.
     *
     * @param store the store to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new store, or with status {@code 400 (Bad Request)} if the store has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/stores")
    public ResponseEntity<Store> createStore(@RequestBody Store store) throws URISyntaxException {
        log.debug("REST request to save Store : {}", store);
        if (store.getId() != null) {
            throw new BadRequestAlertException("A new store cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Store result = storeRepository.save(store);
        return ResponseEntity
            .created(new URI("/api/stores/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /stores/:id} : Updates an existing store.
     *
     * @param id the id of the store to save.
     * @param store the store to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated store,
     * or with status {@code 400 (Bad Request)} if the store is not valid,
     * or with status {@code 500 (Internal Server Error)} if the store couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/stores/{id}")
    public ResponseEntity<Store> updateStore(@PathVariable(value = "id", required = false) final Long id, @RequestBody Store store)
        throws URISyntaxException {
        log.debug("REST request to update Store : {}, {}", id, store);
        if (store.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, store.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!storeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Store result = storeRepository.save(store);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, store.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /stores/:id} : Partial updates given fields of an existing store, field will ignore if it is null
     *
     * @param id the id of the store to save.
     * @param store the store to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated store,
     * or with status {@code 400 (Bad Request)} if the store is not valid,
     * or with status {@code 404 (Not Found)} if the store is not found,
     * or with status {@code 500 (Internal Server Error)} if the store couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/stores/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Store> partialUpdateStore(@PathVariable(value = "id", required = false) final Long id, @RequestBody Store store)
        throws URISyntaxException {
        log.debug("REST request to partial update Store partially : {}, {}", id, store);
        if (store.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, store.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!storeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Store> result = storeRepository
            .findById(store.getId())
            .map(existingStore -> {
                if (store.getName() != null) {
                    existingStore.setName(store.getName());
                }
                if (store.getAdress() != null) {
                    existingStore.setAdress(store.getAdress());
                }

                return existingStore;
            })
            .map(storeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, store.getId().toString())
        );
    }

    /**
     * {@code GET  /stores} : get all the stores.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stores in body.
     */
    @GetMapping("/stores")
    public List<Store> getAllStores(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Stores");
        return storeRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /stores/:id} : get the "id" store.
     *
     * @param id the id of the store to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the store, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/stores/{id}")
    public ResponseEntity<Store> getStore(@PathVariable Long id) {
        log.debug("REST request to get Store : {}", id);
        Optional<Store> store = storeRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(store);
    }

    /**
     * {@code DELETE  /stores/:id} : delete the "id" store.
     *
     * @param id the id of the store to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/stores/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        log.debug("REST request to delete Store : {}", id);
        storeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
