package com.sigd.core.model;

/**
 * Grau de restrição desportiva atribuído a uma ocorrência clínica.
 *
 * VERDE    — sem restrição, treino e jogo permitidos.
 * AMARELO  — restrição parcial, apenas treino condicionado.
 * VERMELHO — restrição total, sem qualquer atividade desportiva.
 */
public enum GrauRestricaoDesportiva {
    VERDE,
    AMARELO,
    VERMELHO
}
