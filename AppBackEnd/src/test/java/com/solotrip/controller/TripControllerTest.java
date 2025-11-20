package com.solotrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.solotrip.dto.TripDTO;
import com.solotrip.service.TripService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TripControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TripService tripService;

    private TripDTO tripDTO;

    @BeforeEach
    void setUp() {
        tripDTO = new TripDTO();
        tripDTO.setId(1L);
        tripDTO.setDestination("Barcelona");
        tripDTO.setBudget(1500.0);
        tripDTO.setTravelStyle("STANDARD");
        tripDTO.setRequiresVisa(false);
        tripDTO.setGroupSize("Solo");
        tripDTO.setStartDate(LocalDate.now().plusDays(30));
    }

    @Test
    void getAllTrips_ShouldReturnListOfTrips() throws Exception {
        List<TripDTO> trips = Arrays.asList(tripDTO);
        when(tripService.getAllTrips()).thenReturn(trips);

        mockMvc.perform(get("/api/trips"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].destination").value("Barcelona"))
            .andExpect(jsonPath("$[0].budget").value(1500.0));

        verify(tripService, times(1)).getAllTrips();
    }

    @Test
    void getTripById_ShouldReturnTrip() throws Exception {
        when(tripService.getTripById(1L)).thenReturn(tripDTO);

        mockMvc.perform(get("/api/trips/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.destination").value("Barcelona"))
            .andExpect(jsonPath("$.budget").value(1500.0));

        verify(tripService, times(1)).getTripById(1L);
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void createTrip_ShouldCreateNewTrip() throws Exception {
        when(tripService.createTrip(any(TripDTO.class), anyString())).thenReturn(tripDTO);

        mockMvc.perform(post("/api/trips")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(tripDTO)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.destination").value("Barcelona"));

        verify(tripService, times(1)).createTrip(any(TripDTO.class), eq("testuser"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void updateTrip_ShouldUpdateExistingTrip() throws Exception {
        when(tripService.updateTrip(eq(1L), any(TripDTO.class))).thenReturn(tripDTO);

        mockMvc.perform(put("/api/trips/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(tripDTO)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.destination").value("Barcelona"));

        verify(tripService, times(1)).updateTrip(eq(1L), any(TripDTO.class));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void deleteTrip_ShouldDeleteTrip() throws Exception {
        doNothing().when(tripService).deleteTrip(1L);

        mockMvc.perform(delete("/api/trips/1"))
            .andExpect(status().isNoContent());

        verify(tripService, times(1)).deleteTrip(1L);
    }

    @Test
    void searchTrips_ShouldReturnMatchingTrips() throws Exception {
        List<TripDTO> trips = Arrays.asList(tripDTO);
        when(tripService.searchTripsByDestination("Barcelona")).thenReturn(trips);

        mockMvc.perform(get("/api/trips/search")
            .param("destination", "Barcelona"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].destination").value("Barcelona"));

        verify(tripService, times(1)).searchTripsByDestination("Barcelona");
    }
}