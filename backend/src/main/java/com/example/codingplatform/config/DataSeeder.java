package com.example.codingplatform.config;

import com.example.codingplatform.entity.Question;
import com.example.codingplatform.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    public CommandLineRunner seedQuestions(QuestionRepository questionRepository) {
        return args -> {
            if (questionRepository.count() == 0) {
                // Java Basics
                questionRepository.save(Question.createSampleQuestion(
                    "Java Basics", "Beginner",
                    "What is the correct way to declare a variable in Java?",
                    "int x = 5;",
                    "x = 5;",
                    "declare x = 5;",
                    "var x as 5;",
                    0
                ));

                questionRepository.save(Question.createSampleQuestion(
                    "Java Basics", "Beginner",
                    "Which of the following is a primitive data type in Java?",
                    "String",
                    "int",
                    "ArrayList",
                    "HashMap",
                    1
                ));

                questionRepository.save(Question.createSampleQuestion(
                    "Java Basics", "Beginner",
                    "What is the output of: System.out.println(5 + 3);?",
                    "53",
                    "8",
                    "5",
                    "Error",
                    1
                ));

                // Loops
                questionRepository.save(Question.createSampleQuestion(
                    "Loops", "Beginner",
                    "Which loop will execute at least once even if condition is false?",
                    "while loop",
                    "for loop",
                    "do-while loop",
                    "foreach loop",
                    2
                ));

                questionRepository.save(Question.createSampleQuestion(
                    "Loops", "Intermediate",
                    "What will this loop print? for(int i=0; i<3; i++) { System.out.print(i); }",
                    "012",
                    "123",
                    "0123",
                    "1230",
                    0
                ));

                // Arrays
                questionRepository.save(Question.createSampleQuestion(
                    "Arrays", "Beginner",
                    "How do you declare an array of integers with size 5?",
                    "int[] arr = new int[5];",
                    "array arr[5];",
                    "int arr(5);",
                    "vector<int> arr(5);",
                    0
                ));

                questionRepository.save(Question.createSampleQuestion(
                    "Arrays", "Intermediate",
                    "What is the index of the first element in a Java array?",
                    "1",
                    "0",
                    "-1",
                    "First",
                    1
                ));

                // Strings
                questionRepository.save(Question.createSampleQuestion(
                    "Strings", "Beginner",
                    "How do you get the length of a string in Java?",
                    "str.size()",
                    "str.length()",
                    "len(str)",
                    "str.count()",
                    1
                ));

                questionRepository.save(Question.createSampleQuestion(
                    "Strings", "Intermediate",
                    "What does str.toUpperCase() return?",
                    "The string in lowercase",
                    "The string in uppercase",
                    "The length of the string",
                    "A boolean value",
                    1
                ));

                // OOP
                questionRepository.save(Question.createSampleQuestion(
                    "OOP", "Intermediate",
                    "What is a class in Java?",
                    "A variable type",
                    "A blueprint for creating objects",
                    "A method",
                    "An array",
                    1
                ));

                questionRepository.save(Question.createSampleQuestion(
                    "OOP", "Intermediate",
                    "Which keyword is used to inherit from a class in Java?",
                    "inherits",
                    "extends",
                    "implements",
                    "inherits from",
                    1
                ));

                System.out.println("✅ Sample questions seeded successfully!");
            }
        };
    }
}
