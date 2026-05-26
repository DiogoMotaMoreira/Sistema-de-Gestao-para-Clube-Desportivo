package com.sigd.auth.service;

import org.springframework.stereotype.Component;

@Component
public class PasswordValidator {

    public void validarPassword(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("A password deve ter pelo menos 8 caracteres.");
        }
        
        boolean hasUppercase = false;
        boolean hasDigit = false;
        
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                hasUppercase = true;
            }
            if (Character.isDigit(c)) {
                hasDigit = true;
            }
        }
        
        if (!hasUppercase) {
            throw new IllegalArgumentException("A password deve conter pelo menos uma letra maiúscula.");
        }
        
        if (!hasDigit) {
            throw new IllegalArgumentException("A password deve conter pelo menos um dígito.");
        }
    }
}
