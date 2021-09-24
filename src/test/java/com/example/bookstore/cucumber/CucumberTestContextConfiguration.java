package com.example.bookstore.cucumber;

import com.example.bookstore.BookstoreApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = BookstoreApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
