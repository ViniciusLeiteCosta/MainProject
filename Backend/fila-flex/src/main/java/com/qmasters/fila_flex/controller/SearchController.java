package com.qmasters.fila_flex.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchController {

    @GetMapping("/search")
    public ResponseEntity<List<String>> search() {
        List<String> results = List.of("Resultado 1", "Resultado 2", "Resultado 3");
        return ResponseEntity.ok(results);
    }
}
