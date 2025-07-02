package com.cognizant.practice.blog;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping(value="/hello")
public class HelloController {

    @GetMapping
    public String helloPrint() {
        return "Hello World";
    }

    @GetMapping("/{name}")
    public String helloPrint2(@PathVariable String name) {
        return "Hello " + name;
    }
}
