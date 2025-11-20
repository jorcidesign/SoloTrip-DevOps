package com.solotrip.controller;

import com.solotrip.dto.TripDTO;
import com.solotrip.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class TripController {

    private final TripService tripService;

    @GetMapping
    public ResponseEntity<List<TripDTO>> getAllTrips() {
        log.info("GET /api/trips - Obteniendo todos los viajes");
        List<TripDTO> trips = tripService.getAllTrips();
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripDTO> getTripById(@PathVariable Long id) {
        log.info("GET /api/trips/{} - Obteniendo viaje", id);
        TripDTO trip = tripService.getTripById(id);
        return ResponseEntity.ok(trip);
    }

    @PostMapping
    public ResponseEntity<TripDTO> createTrip(
            @Valid @RequestBody TripDTO tripDTO,
            Authentication authentication) {
        log.info("POST /api/trips - Creando nuevo viaje");
        String username = authentication.getName();
        TripDTO createdTrip = tripService.createTrip(tripDTO, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrip);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripDTO> updateTrip(
            @PathVariable Long id,
            @Valid @RequestBody TripDTO tripDTO) {
        log.info("PUT /api/trips/{} - Actualizando viaje", id);
        TripDTO updatedTrip = tripService.updateTrip(id, tripDTO);
        return ResponseEntity.ok(updatedTrip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        log.info("DELETE /api/trips/{} - Eliminando viaje", id);
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<TripDTO>> searchTrips(@RequestParam String destination) {
        log.info("GET /api/trips/search?destination={} - Buscando viajes", destination);
        List<TripDTO> trips = tripService.searchTripsByDestination(destination);
        return ResponseEntity.ok(trips);
    }
}