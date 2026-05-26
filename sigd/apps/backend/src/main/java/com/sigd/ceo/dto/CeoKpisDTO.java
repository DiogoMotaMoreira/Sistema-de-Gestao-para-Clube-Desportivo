package com.sigd.ceo.dto;

import java.math.BigDecimal;

public record CeoKpisDTO(
    long totalAtletas,
    long totalEquipas,
    long totalSocios,
    BigDecimal receitaTotal,
    BigDecimal dividaTotal,
    long atletasAptos,
    long atletasCondicionados,
    long atletasInaptos
) {}
