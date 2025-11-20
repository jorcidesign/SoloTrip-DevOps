package com.solotrip.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripDTO {
    private Long id;

    @NotBlank(message = "El destino es obligatorio")
    @Size(min = 3, max = 255, message = "El destino debe tener entre 3 y 255 caracteres")
    private String destination;

    @NotNull(message = "El presupuesto es obligatorio")
    @Positive(message = "El presupuesto debe ser positivo")
    private Double budget;

    @NotNull(message = "El estilo de viaje es obligatorio")
    private String travelStyle;

    private Boolean requiresVisa = false;

    @NotBlank(message = "El tamaño del grupo es obligatorio")
    private String groupSize;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Future(message = "La fecha debe ser futura")
    private LocalDate startDate;
}