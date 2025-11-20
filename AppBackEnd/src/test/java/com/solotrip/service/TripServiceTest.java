package com.solotrip.service;

import com.solotrip.dto.TripDTO;
import com.solotrip.entity.Trip;
import com.solotrip.entity.User;
import com.solotrip.exception.ResourceNotFoundException;
import com.solotrip.repository.TripRepository;
import com.solotrip.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TripService tripService;

    private Trip trip;
    private TripDTO tripDTO;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        trip = new Trip();
        trip.setId(1L);
        trip.setDestination("Barcelona");
        trip.setBudget(1500.0);
        trip.setTravelStyle(Trip.TravelStyle.STANDARD);
        trip.setRequiresVisa(false);
        trip.setGroupSize("Solo");
        trip.setStartDate(LocalDate.now().plusDays(30));
        trip.setUser(user);

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
    void getAllTrips_ShouldReturnListOfTripDTOs() {
        when(tripRepository.findAll()).thenReturn(Arrays.asList(trip));
        
        List<TripDTO> result = tripService.getAllTrips();
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Barcelona", result.get(0).getDestination());
        verify(tripRepository, times(1)).findAll();
    }

    @Test
    void getTripById_WhenTripExists_ShouldReturnTripDTO() {
        when(tripRepository.findById(1L)).thenReturn(Optional.of(trip));
        
        TripDTO result = tripService.getTripById(1L);
        
        assertNotNull(result);
        assertEquals("Barcelona", result.getDestination());
        verify(tripRepository, times(1)).findById(1L);
    }

    @Test
    void getTripById_WhenTripDoesNotExist_ShouldThrowException() {
        when(tripRepository.findById(999L)).thenReturn(Optional.empty());
        
        assertThrows(ResourceNotFoundException.class, () -> {
            tripService.getTripById(999L);
        });
        
        verify(tripRepository, times(1)).findById(999L);
    }

    @Test
    void createTrip_ShouldCreateAndReturnTripDTO() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(tripRepository.save(any(Trip.class))).thenReturn(trip);
        
        TripDTO result = tripService.createTrip(tripDTO, "testuser");
        
        assertNotNull(result);
        assertEquals("Barcelona", result.getDestination());
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(tripRepository, times(1)).save(any(Trip.class));
    }

    @Test
    void updateTrip_WhenTripExists_ShouldUpdateAndReturnTripDTO() {
        when(tripRepository.findById(1L)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(Trip.class))).thenReturn(trip);
        
        tripDTO.setDestination("Madrid");
        TripDTO result = tripService.updateTrip(1L, tripDTO);
        
        assertNotNull(result);
        assertEquals("Madrid", result.getDestination());
        verify(tripRepository, times(1)).findById(1L);
        verify(tripRepository, times(1)).save(any(Trip.class));
    }

    @Test
    void deleteTrip_WhenTripExists_ShouldDeleteTrip() {
        when(tripRepository.existsById(1L)).thenReturn(true);
        
        assertDoesNotThrow(() -> tripService.deleteTrip(1L));
        
        verify(tripRepository, times(1)).existsById(1L);
        verify(tripRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteTrip_WhenTripDoesNotExist_ShouldThrowException() {
        when(tripRepository.existsById(999L)).thenReturn(false);
        
        assertThrows(ResourceNotFoundException.class, () -> {
            tripService.deleteTrip(999L);
        });
        
        verify(tripRepository, times(1)).existsById(999L);
        verify(tripRepository, never()).deleteById(any());
    }

    @Test
    void searchTripsByDestination_ShouldReturnMatchingTrips() {
        when(tripRepository.findByDestinationContainingIgnoreCase("Barcelona"))
            .thenReturn(Arrays.asList(trip));
        
        List<TripDTO> result = tripService.searchTripsByDestination("Barcelona");
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Barcelona", result.get(0).getDestination());
        verify(tripRepository, times(1)).findByDestinationContainingIgnoreCase("Barcelona");
    }
}