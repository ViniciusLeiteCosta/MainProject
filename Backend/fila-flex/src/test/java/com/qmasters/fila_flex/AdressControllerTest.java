package com.qmasters.fila_flex;

import com.qmasters.fila_flex.dto.AdressDTO;
import com.qmasters.fila_flex.model.Adress;
import com.qmasters.fila_flex.service.AdressService;
import com.qmasters.fila_flex.controller.AdressController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Optional;
import java.util.List;

public class AdressControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AdressService adressService;

    @InjectMocks
    private AdressController adressController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(adressController).build();
    }

    @Test
    public void testGetAllAdress() throws Exception {
        // Dados simulados
        when(adressService.getAllAdress()).thenReturn(List.of(new Adress("123", "Main St", "Springfield", "SP", "Brazil")));

        mockMvc.perform(get("/adress/all"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].number").value("123"))
               .andExpect(jsonPath("$[0].street").value("Main St"))
               .andExpect(jsonPath("$[0].city").value("Springfield"))
               .andExpect(jsonPath("$[0].state").value("SP"))
               .andExpect(jsonPath("$[0].country").value("Brazil"));
    }

    @Test
    public void testCreateAdress() throws Exception {
        // Dados simulados para criação
        AdressDTO adressDTO = new AdressDTO("123", "Main St", "Springfield", "SP", "Brazil");
        Adress adress = new Adress("123", "Main St", "Springfield", "SP", "Brazil");

        when(adressService.saveAdress(adressDTO)).thenReturn(adress);

        mockMvc.perform(post("/adress/create")
                        .contentType("application/json")
                        .content("{\"number\":\"123\",\"street\":\"Main St\",\"city\":\"Springfield\",\"state\":\"SP\",\"country\":\"Brazil\"}"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.number").value("123"))
               .andExpect(jsonPath("$.street").value("Main St"))
               .andExpect(jsonPath("$.city").value("Springfield"))
               .andExpect(jsonPath("$.state").value("SP"))
               .andExpect(jsonPath("$.country").value("Brazil"));
    }

    @Test
    public void testGetAdressById_Found() throws Exception {
        Long id = 1L;
        Adress adress = new Adress("123", "Main St", "Springfield", "SP", "Brazil");
        adress.setId(id);

        when(adressService.findAdressById(id)).thenReturn(Optional.of(adress));

        mockMvc.perform(get("/adress/{id}", id))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.id").value(id))
               .andExpect(jsonPath("$.number").value("123"))
               .andExpect(jsonPath("$.street").value("Main St"))
               .andExpect(jsonPath("$.city").value("Springfield"))
               .andExpect(jsonPath("$.state").value("SP"))
               .andExpect(jsonPath("$.country").value("Brazil"));
    }

    @Test
    public void testGetAdressById_NotFound() throws Exception {
        Long id = 1L;

        when(adressService.findAdressById(id)).thenReturn(Optional.empty());

        mockMvc.perform(get("/adress/{id}", id))
               .andExpect(status().isNotFound())
               .andExpect(jsonPath("$.message").value("Usuário não encontrado"));
    }

    @Test
    public void testDeleteAdressById_Success() throws Exception {
        Long id = 1L;

        doNothing().when(adressService).deleteAdress(id);

        mockMvc.perform(delete("/adress/{id}", id))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("Endereço removido com sucesso"));
    }

    @Test
    public void testDeleteAdressById_NotFound() throws Exception {
        Long id = 1L;

        doThrow(new IllegalArgumentException("Endereço não encontrado")).when(adressService).deleteAdress(id);

        mockMvc.perform(delete("/adress/{id}", id))
               .andExpect(status().isNotFound())
               .andExpect(jsonPath("$.message").value("Endereço não encontrado"));
    }
}
