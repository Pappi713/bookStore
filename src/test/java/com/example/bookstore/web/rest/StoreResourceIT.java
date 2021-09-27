package com.example.bookstore.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.bookstore.IntegrationTest;
import com.example.bookstore.domain.Store;
import com.example.bookstore.repository.StoreRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link StoreResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class StoreResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADRESS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/stores";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StoreRepository storeRepository;

    @Mock
    private StoreRepository storeRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStoreMockMvc;

    private Store store;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Store createEntity(EntityManager em) {
        Store store = new Store().name(DEFAULT_NAME).adress(DEFAULT_ADRESS);
        return store;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Store createUpdatedEntity(EntityManager em) {
        Store store = new Store().name(UPDATED_NAME).adress(UPDATED_ADRESS);
        return store;
    }

    @BeforeEach
    public void initTest() {
        store = createEntity(em);
    }

    @Test
    @Transactional
    void createStore() throws Exception {
        int databaseSizeBeforeCreate = storeRepository.findAll().size();
        // Create the Store
        restStoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(store)))
            .andExpect(status().isCreated());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeCreate + 1);
        Store testStore = storeList.get(storeList.size() - 1);
        assertThat(testStore.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStore.getAdress()).isEqualTo(DEFAULT_ADRESS);
    }

    @Test
    @Transactional
    void createStoreWithExistingId() throws Exception {
        // Create the Store with an existing ID
        store.setId(1L);

        int databaseSizeBeforeCreate = storeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(store)))
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStores() throws Exception {
        // Initialize the database
        storeRepository.saveAndFlush(store);

        // Get all the storeList
        restStoreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(store.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].adress").value(hasItem(DEFAULT_ADRESS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllStoresWithEagerRelationshipsIsEnabled() throws Exception {
        when(storeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restStoreMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(storeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllStoresWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(storeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restStoreMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(storeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getStore() throws Exception {
        // Initialize the database
        storeRepository.saveAndFlush(store);

        // Get the store
        restStoreMockMvc
            .perform(get(ENTITY_API_URL_ID, store.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(store.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.adress").value(DEFAULT_ADRESS));
    }

    @Test
    @Transactional
    void getNonExistingStore() throws Exception {
        // Get the store
        restStoreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewStore() throws Exception {
        // Initialize the database
        storeRepository.saveAndFlush(store);

        int databaseSizeBeforeUpdate = storeRepository.findAll().size();

        // Update the store
        Store updatedStore = storeRepository.findById(store.getId()).get();
        // Disconnect from session so that the updates on updatedStore are not directly saved in db
        em.detach(updatedStore);
        updatedStore.name(UPDATED_NAME).adress(UPDATED_ADRESS);

        restStoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStore.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStore))
            )
            .andExpect(status().isOk());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
        Store testStore = storeList.get(storeList.size() - 1);
        assertThat(testStore.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStore.getAdress()).isEqualTo(UPDATED_ADRESS);
    }

    @Test
    @Transactional
    void putNonExistingStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, store.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(store)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStoreWithPatch() throws Exception {
        // Initialize the database
        storeRepository.saveAndFlush(store);

        int databaseSizeBeforeUpdate = storeRepository.findAll().size();

        // Update the store using partial update
        Store partialUpdatedStore = new Store();
        partialUpdatedStore.setId(store.getId());

        partialUpdatedStore.adress(UPDATED_ADRESS);

        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStore.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStore))
            )
            .andExpect(status().isOk());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
        Store testStore = storeList.get(storeList.size() - 1);
        assertThat(testStore.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStore.getAdress()).isEqualTo(UPDATED_ADRESS);
    }

    @Test
    @Transactional
    void fullUpdateStoreWithPatch() throws Exception {
        // Initialize the database
        storeRepository.saveAndFlush(store);

        int databaseSizeBeforeUpdate = storeRepository.findAll().size();

        // Update the store using partial update
        Store partialUpdatedStore = new Store();
        partialUpdatedStore.setId(store.getId());

        partialUpdatedStore.name(UPDATED_NAME).adress(UPDATED_ADRESS);

        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStore.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStore))
            )
            .andExpect(status().isOk());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
        Store testStore = storeList.get(storeList.size() - 1);
        assertThat(testStore.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStore.getAdress()).isEqualTo(UPDATED_ADRESS);
    }

    @Test
    @Transactional
    void patchNonExistingStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, store.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(store)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStore() throws Exception {
        // Initialize the database
        storeRepository.saveAndFlush(store);

        int databaseSizeBeforeDelete = storeRepository.findAll().size();

        // Delete the store
        restStoreMockMvc
            .perform(delete(ENTITY_API_URL_ID, store.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
