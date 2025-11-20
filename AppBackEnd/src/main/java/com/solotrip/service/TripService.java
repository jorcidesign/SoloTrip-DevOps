package com.solotrip.service;

import com.solotrip.dto.TripDTO;
import com.solotrip.entity.Trip;
import com.solotrip.entity.User;
import com.solotrip.exception.ResourceNotFoundException;
import com.solotrip.repository.TripRepository;
import com.solotrip.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TripService {
    
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public List<TripDTO> getAllTrips() {
        log.debug("Obteniendo todos los viajes");
        return tripRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public TripDTO getTripById(Long id) {
        log.debug("Obteniendo viaje con id: {}", id);
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Viaje no encontrado con id: " + id));
        return convertToDTO(trip);
    }

    public TripDTO createTrip(TripDTO tripDTO, String username) {
        log.debug("Creando nuevo viaje para usuario: {}", username);
        Trip trip = convertToEntity(tripDTO);
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        trip.setUser(user);
        
        Trip savedTrip = tripRepository.save(trip);
        log.info("Viaje creado con id: {}", savedTrip.getId());
        return convertToDTO(savedTrip);
    }

    public TripDTO updateTrip(Long id, TripDTO tripDTO) {
        log.debug("Actualizando viaje con id: {}", id);
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Viaje no encontrado con id: " + id));
        
        trip.setDestination(tripDTO.getDestination());
        trip.setBudget(tripDTO.getBudget());
        trip.setTravelStyle(Trip.TravelStyle.valueOf(tripDTO.getTravelStyle()));
        trip.setRequiresVisa(tripDTO.getRequiresVisa());
        trip.setGroupSize(tripDTO.getGroupSize());
        trip.setStartDate(tripDTO.getStartDate());
        
        Trip updatedTrip = tripRepository.save(trip);
        log.info("Viaje actualizado con id: {}", updatedTrip.getId());
        return convertToDTO(updatedTrip);
    }

    public void deleteTrip(Long id) {
        log.debug("Eliminando viaje con id: {}", id);
        if (!tripRepository.existsById(id)) {
            throw new ResourceNotFoundException("Viaje no encontrado con id: " + id);
        }
        tripRepository.deleteById(id);
        log.info("Viaje eliminado con id: {}", id);
    }

    public List<TripDTO> searchTripsByDestination(String destination) {
        log.debug("Buscando viajes por destino: {}", destination);
        return tripRepository.findByDestinationContainingIgnoreCase(destination).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private TripDTO convertToDTO(Trip trip) {
        TripDTO dto = new TripDTO();
        dto.setId(trip.getId());
        dto.setDestination(trip.getDestination());
        dto.setBudget(trip.getBudget());
        dto.setTravelStyle(trip.getTravelStyle().toString());
        dto.setRequiresVisa(trip.getRequiresVisa());
        dto.setGroupSize(trip.getGroupSize());
        dto.setStartDate(trip.getStartDate());
        return dto;
    }

    private Trip convertToEntity(TripDTO dto) {
        Trip trip = new Trip();
        trip.setDestination(dto.getDestination());
        trip.setBudget(dto.getBudget());
        trip.setTravelStyle(Trip.TravelStyle.valueOf(dto.getTravelStyle()));
        trip.setRequiresVisa(dto.getRequiresVisa());
        trip.setGroupSize(dto.getGroupSize());
        trip.setStartDate(dto.getStartDate());
        return trip;
    }
}