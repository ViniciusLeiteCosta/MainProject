package com.qmasters.fila_flex.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.qmasters.fila_flex.model.User;
import com.qmasters.fila_flex.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public UserDetails findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Usuário não encontrado, remoção não foi realizada");
        }
    }

    public User update(User user) {
        return userRepository.save(user);
    }

}