package com.qmasters.fila_flex;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.qmasters.fila_flex.dto.AdressDTO;
import com.qmasters.fila_flex.model.Adress;
import com.qmasters.fila_flex.repository.AdressRepository;
import com.qmasters.fila_flex.service.AdressService;

public class AdressServiceTest {

    @Mock
    private AdressRepository adressRepository;

    @InjectMocks
    private AdressService adressService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveAdress() {
        AdressDTO adressDTO = new AdressDTO("123", "Rua A", "Cidade A", "Estado A", "País A");
        Adress adress = new Adress("123", "Rua A", "Cidade A", "Estado A", "País A");

        when(adressRepository.save(any(Adress.class))).thenReturn(adress);

        Adress savedAdress = adressService.saveAdress(adressDTO);

        assertNotNull(savedAdress);
        assertEquals("123", savedAdress.getNumber());
        assertEquals("Rua A", savedAdress.getStreet());
    }

    @Test
    public void testFindAdressById() {
        Adress adress = new Adress("123", "Rua A", "Cidade A", "Estado A", "País A");
        when(adressRepository.findById(1L)).thenReturn(Optional.of(adress));

        Optional<Adress> foundAdress = adressService.findAdressById(1L);

        assertTrue(foundAdress.isPresent());
        assertEquals("123", foundAdress.get().getNumber());
    }

    @Test
    public void testFindAdressById_NotFound() {
        when(adressRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Adress> foundAdress = adressService.findAdressById(1L);

        assertFalse(foundAdress.isPresent());
    }

    @Test
    public void testDeleteAdress() {
        when(adressRepository.existsById(1L)).thenReturn(true);
        doNothing().when(adressRepository).deleteById(1L);

        adressService.deleteAdress(1L);

        verify(adressRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testDeleteAdress_NotFound() {
        when(adressRepository.existsById(1L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> adressService.deleteAdress(1L));
    }
}