-- ============================================
-- PART 1: CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL,
    attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_mastered BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, question_id)
);

-- Track cleared difficulties
CREATE TABLE IF NOT EXISTS user_cleared_difficulties (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    difficulty VARCHAR(20) NOT NULL,
    cleared_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, difficulty)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id BIGINT REFERENCES categories(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Main questions table
CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES categories(id),
    topic VARCHAR(100),
    question_text TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    question_type VARCHAR(20) DEFAULT 'SINGLE' 
        CHECK (question_type IN ('SINGLE', 'MULTI', 'TRUE_FALSE', 'FILL_BLANK')),
    explanation TEXT,
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Options table
CREATE TABLE IF NOT EXISTS options (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    option_order INTEGER NOT NULL,
    UNIQUE(question_id, option_order)
);

-- User answers history
CREATE TABLE IF NOT EXISTS user_answers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id BIGINT REFERENCES options(id),
    user_answer_text TEXT,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INTEGER,
    xp_earned INTEGER DEFAULT 0,
    answered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_user ON user_answers(user_id);

-- ============================================
-- PART 2: INSERT CATEGORIES
-- ============================================

INSERT INTO categories (name, description) VALUES
('Arrays', 'Java arrays - indexing, initialization, and operations'),
('Strings', 'Java String manipulation and methods'),
('Loops', 'For loops, while loops, and iteration'),
('Functions', 'Java methods, parameters, and return values'),
('Conditionals', 'If-else statements and conditional logic'),
('OOP', 'Object-Oriented Programming concepts'),
('Variables', 'Java variable types and declarations')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- PART 3: INSERT ONLY EASY QUESTIONS FOR NOW
-- ============================================

-- ========== ARRAYS EASY QUESTIONS (10) ==========

-- Q1
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Arrays', 'What is printed?
int[] arr = {1,2,3};
System.out.println(arr[0]);', 'EASY', 'SINGLE', 
'Arrays are zero-indexed in Java. arr[0] accesses the first element which is 1.', 10
FROM categories c WHERE c.name = 'Arrays';

-- Q2
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Arrays', 'What is printed?
int[] arr = {5,10,15};
System.out.println(arr[2]);', 'EASY', 'SINGLE', 
'Arrays are zero-indexed, so index 2 accesses the third element which is 15.', 10
FROM categories c WHERE c.name = 'Arrays';

-- Q3
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Arrays', 'What is the size of this array?
int[] arr = {1,2,3,4};', 'EASY', 'SINGLE', 
'The array has 4 elements: 1,2,3,4. The size is 4.', 10
FROM categories c WHERE c.name = 'Arrays';

-- Q4 (MULTI)
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Arrays', 'Which are valid array declarations?', 'EASY', 'MULTI', 
'Both "int[] arr = new int[5];" and "int arr[] = new int[5];" are valid array declarations in Java.', 15
FROM categories c WHERE c.name = 'Arrays';

-- Q5
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Arrays', 'What is printed?
int[] arr = {1,2,3};
arr[1] = 5;
System.out.println(arr[1]);', 'EASY', 'SINGLE', 
'arr[1] = 5 changes the second element from 2 to 5, so printing arr[1] outputs 5.', 10
FROM categories c WHERE c.name = 'Arrays';

-- Q6
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Arrays', 'What is printed?
int[] arr = {1,2,3};
System.out.println(arr.length);', 'EASY', 'SINGLE', 
'arr.length returns the number of elements in the array, which is 3.', 10
FROM categories c WHERE c.name = 'Arrays';

-- Q7
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Arrays', 'What is printed?
int[] arr = {1,2,3};
System.out.println(arr[3]);', 'EASY', 'SINGLE', 
'Index 3 is out of bounds because valid indices are 0,1,2. This throws ArrayIndexOutOfBoundsException.', 10
FROM categories c WHERE c.name = 'Arrays';

-- Q8
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Arrays', 'What is printed?
int[] arr = new int[2];
System.out.println(arr[0]);', 'EASY', 'SINGLE', 
'When an int array is created, all elements are initialized to 0 by default.', 10
FROM categories c WHERE c.name = 'Arrays';

-- Q9
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Arrays', 'What is printed?
int[] arr = {1,2,3};
for(int i=0;i<3;i++){
 System.out.print(arr[i]);
}', 'EASY', 'SINGLE', 
'The loop prints each element: 1, then 2, then 3, resulting in "123".', 10
FROM categories c WHERE c.name = 'Arrays';

-- Q10 (MULTI)
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Arrays', 'Which are properties of arrays in Java?', 'EASY', 'MULTI', 
'Arrays have fixed size, are zero-indexed, and store elements of the same type.', 15
FROM categories c WHERE c.name = 'Arrays';

-- ========== STRINGS EASY QUESTIONS (7) ==========

-- Q11
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Strings', 'What is printed?
String s = "Java";
System.out.println(s.length());', 'EASY', 'SINGLE', 
'length() returns the number of characters. "Java" has 4 characters.', 10
FROM categories c WHERE c.name = 'Strings';

-- Q12
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Strings', 'What is printed?
String s = "Code";
System.out.println(s.charAt(0));', 'EASY', 'SINGLE', 
'charAt(0) returns the character at index 0, which is "C".', 10
FROM categories c WHERE c.name = 'Strings';

-- Q13
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Strings', 'What is printed?
System.out.println("Hi" + "Java");', 'EASY', 'SINGLE', 
'The + operator concatenates strings, resulting in "HiJava" (no space).', 10
FROM categories c WHERE c.name = 'Strings';

-- Q14 (MULTI)
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Strings', 'Which are valid String methods?', 'EASY', 'MULTI', 
'length(), charAt(), and concat() are valid String methods. push() is for arrays/lists.', 15
FROM categories c WHERE c.name = 'Strings';

-- Q15
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Strings', 'What is printed?
String s = "cat";
System.out.println(s.charAt(2));', 'EASY', 'SINGLE', 
'Index 2 returns the third character, which is "t".', 10
FROM categories c WHERE c.name = 'Strings';

-- Q16
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Strings', 'What is printed?
String s = "abc";
System.out.println(s.charAt(1));', 'EASY', 'SINGLE', 
'Index 1 returns the second character, which is "b".', 10
FROM categories c WHERE c.name = 'Strings';

-- Q17
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Strings', 'What is printed?
String s = "A".concat("B");
System.out.println(s);', 'EASY', 'SINGLE', 
'concat() joins strings: "A" + "B" = "AB".', 10
FROM categories c WHERE c.name = 'Strings';

-- ========== LOOPS EASY QUESTIONS (6) ==========

-- Q18
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Loops', 'What is printed?
for(int i=0;i<3;i++)
 System.out.print(i);', 'EASY', 'SINGLE', 
'The loop runs i=0,1,2 and prints each value: 012', 10
FROM categories c WHERE c.name = 'Loops';

-- Q19
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Loops', 'What is printed?
int i=0;
while(i<2){
 System.out.print(i);
 i++;
}', 'EASY', 'SINGLE', 
'The while loop runs while i<2, printing 0 then 1.', 10
FROM categories c WHERE c.name = 'Loops';

-- Q20
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Loops', 'How many times does this loop run?
for(int i=0;i<4;i++){}', 'EASY', 'SINGLE', 
'The loop runs for i=0,1,2,3 - that''s 4 times.', 10
FROM categories c WHERE c.name = 'Loops';

-- Q21
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Loops', 'What is printed?
for(int i=1;i<=3;i++)
 System.out.print(i);', 'EASY', 'SINGLE', 
'The loop runs i=1,2,3 and prints each value: 123', 10
FROM categories c WHERE c.name = 'Loops';

-- Q22 (MULTI)
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Loops', 'Which are loop types in Java?', 'EASY', 'MULTI', 
'Java has for, while, and do-while loops. "repeat" is not a Java loop type.', 15
FROM categories c WHERE c.name = 'Loops';

-- Q23
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Loops', 'What is printed?
for(int i=2;i<5;i++)
 System.out.print(i);', 'EASY', 'SINGLE', 
'The loop runs i=2,3,4 and prints each value: 234', 10
FROM categories c WHERE c.name = 'Loops';

-- ========== FUNCTIONS EASY QUESTIONS (6) ==========

-- Q24
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Functions', 'What is printed?
int add(int a,int b){ return a+b; }
System.out.println(add(2,3));', 'EASY', 'SINGLE', 
'The add method returns the sum: 2+3=5', 10
FROM categories c WHERE c.name = 'Functions';

-- Q25
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Functions', 'What does a return statement do?', 'EASY', 'SINGLE', 
'A return statement sends a value back to the caller and exits the method.', 10
FROM categories c WHERE c.name = 'Functions';

-- Q26
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Functions', 'How do you call a method named test with no parameters?', 'EASY', 'SINGLE', 
'You call a method using parentheses: test()', 10
FROM categories c WHERE c.name = 'Functions';

-- Q27 (MULTI)
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Functions', 'Which parts can a method have?', 'EASY', 'MULTI', 
'Methods have a return type, name, and parameters (optional).', 15
FROM categories c WHERE c.name = 'Functions';

-- Q28
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Functions', 'What is printed?
int square(int x){ return x*x; }
System.out.println(square(3));', 'EASY', 'SINGLE', 
'square(3) returns 3*3 = 9', 10
FROM categories c WHERE c.name = 'Functions';

-- Q29 (MULTI)
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Functions', 'Which are valid method declarations?', 'EASY', 'MULTI', 
'Valid methods have return type, name, parameters, and body. "method go(){}" is invalid syntax.', 15
FROM categories c WHERE c.name = 'Functions';

-- ========== CONDITIONALS EASY QUESTIONS (5) ==========

-- Q30
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Conditionals', 'What is printed?
int x=5;
if(x>3) System.out.println("Yes");', 'EASY', 'SINGLE', 
'5 > 3 is true, so "Yes" is printed.', 10
FROM categories c WHERE c.name = 'Conditionals';

-- Q31
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Conditionals', 'What is printed?
int x=2;
if(x>3) System.out.println("Yes"); else System.out.println("No");', 'EASY', 'SINGLE', 
'2 > 3 is false, so the else block executes, printing "No"', 10
FROM categories c WHERE c.name = 'Conditionals';

-- Q32
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Conditionals', 'Which keyword is used for another condition check?', 'EASY', 'SINGLE', 
'"else if" is used for additional condition checks after an if statement.', 10
FROM categories c WHERE c.name = 'Conditionals';

-- Q33 (MULTI)
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Conditionals', 'Which comparison operators are valid in Java conditions?', 'EASY', 'MULTI', 
'Java uses >, <, ==, !=, >=, <= for comparisons. <> is not valid.', 15
FROM categories c WHERE c.name = 'Conditionals';

-- Q34
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Conditionals', 'What is printed?
int x=7;
if(x==7) System.out.println("Match");', 'EASY', 'SINGLE', 
'x == 7 is true, so "Match" is printed.', 10
FROM categories c WHERE c.name = 'Conditionals';

-- Q35
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Conditionals', 'What is printed?
int x=4;
if(x<2) System.out.println("Low"); else System.out.println("High");', 'EASY', 'SINGLE', 
'4 < 2 is false, so else executes, printing "High"', 10
FROM categories c WHERE c.name = 'Conditionals';

-- ========== OOP EASY QUESTIONS (5) ==========

-- Q36
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'OOP', 'What does this create?
class A{}
A obj = new A();', 'EASY', 'SINGLE', 
'new A() creates an object (instance) of class A.', 10
FROM categories c WHERE c.name = 'OOP';

-- Q37
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'OOP', 'What is a class?', 'EASY', 'SINGLE', 
'A class is a blueprint or template for creating objects.', 10
FROM categories c WHERE c.name = 'OOP';

-- Q38
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'OOP', 'What keyword creates an object?', 'EASY', 'SINGLE', 
'The "new" keyword is used to create an object in Java.', 10
FROM categories c WHERE c.name = 'OOP';

-- Q39 (MULTI)
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'OOP', 'Which are common OOP concepts?', 'EASY', 'MULTI', 
'Classes, objects, and inheritance are fundamental OOP concepts.', 15
FROM categories c WHERE c.name = 'OOP';

-- Q40
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'OOP', 'What is obj in A obj = new A();?', 'EASY', 'SINGLE', 
'obj is an object reference variable that refers to the A object.', 10
FROM categories c WHERE c.name = 'OOP';

-- ========== VARIABLES EASY QUESTIONS (6) ==========

-- Q41
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Variables', 'What is printed?
int x=10;
System.out.println(x);', 'EASY', 'SINGLE', 
'The variable x holds the value 10, which is printed.', 10
FROM categories c WHERE c.name = 'Variables';

-- Q42
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Variables', 'Which type stores whole numbers?', 'EASY', 'SINGLE', 
'int (integer) is used for whole numbers in Java.', 10
FROM categories c WHERE c.name = 'Variables';

-- Q43
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Variables', 'Which type stores true or false?', 'EASY', 'SINGLE', 
'boolean stores true or false values.', 10
FROM categories c WHERE c.name = 'Variables';

-- Q44 (MULTI)
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Variables', 'Which are valid Java variable types?', 'EASY', 'MULTI', 
'int, String, and boolean are valid Java types. "number" is not a Java type.', 15
FROM categories c WHERE c.name = 'Variables';

-- Q45
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Variables', 'What is printed?
String name = "Sam";
System.out.println(name);', 'EASY', 'SINGLE', 
'The variable name holds the String "Sam", which is printed.', 10
FROM categories c WHERE c.name = 'Variables';

-- Q46
INSERT INTO questions (category_id, topic, question_text, difficulty, question_type, explanation, xp_reward) 
SELECT c.id, 'Variables', 'What is printed?
double x = 2.5;
System.out.println(x);', 'EASY', 'SINGLE', 
'The double variable holds 2.5, which is printed.', 10
FROM categories c WHERE c.name = 'Variables';

-- ============================================
-- PART 4: INSERT OPTIONS FOR EASY QUESTIONS
-- ============================================

-- ARRAYS OPTIONS (Q1-Q10)
DO $$
DECLARE 
    q1_id BIGINT; q2_id BIGINT; q3_id BIGINT; q4_id BIGINT; q5_id BIGINT;
    q6_id BIGINT; q7_id BIGINT; q8_id BIGINT; q9_id BIGINT; q10_id BIGINT;
BEGIN
    SELECT id INTO q1_id FROM questions WHERE question_text LIKE '%arr[0]%' AND topic='Arrays' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q2_id FROM questions WHERE question_text LIKE '%5,10,15%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q3_id FROM questions WHERE question_text LIKE 'What is the size%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q4_id FROM questions WHERE question_text = 'Which are valid array declarations?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q5_id FROM questions WHERE question_text LIKE '%arr[1] = 5%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q6_id FROM questions WHERE question_text LIKE '%arr.length%' AND topic='Arrays' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q7_id FROM questions WHERE question_text LIKE '%arr[3]%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q8_id FROM questions WHERE question_text LIKE '%new int[2]%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q9_id FROM questions WHERE question_text LIKE '%for(int i=0%' AND question_text LIKE '%print(arr[i])%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q10_id FROM questions WHERE question_text = 'Which are properties of arrays in Java?' AND difficulty='EASY' LIMIT 1;
    
    IF q1_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q1_id, '1', TRUE, 1), (q1_id, '2', FALSE, 2), (q1_id, '3', FALSE, 3), (q1_id, 'Error', FALSE, 4);
    END IF;
    
    IF q2_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q2_id, '5', FALSE, 1), (q2_id, '10', FALSE, 2), (q2_id, '15', TRUE, 3), (q2_id, 'Error', FALSE, 4);
    END IF;
    
    IF q3_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q3_id, '3', FALSE, 1), (q3_id, '4', TRUE, 2), (q3_id, '5', FALSE, 3), (q3_id, 'Error', FALSE, 4);
    END IF;
    
    IF q4_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q4_id, 'int[] arr = new int[5];', TRUE, 1),
        (q4_id, 'int arr[] = new int[5];', TRUE, 2),
        (q4_id, 'int arr = [1,2];', FALSE, 3),
        (q4_id, 'int arr = new int();', FALSE, 4);
    END IF;
    
    IF q5_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q5_id, '2', FALSE, 1), (q5_id, '5', TRUE, 2), (q5_id, '3', FALSE, 3), (q5_id, 'Error', FALSE, 4);
    END IF;
    
    IF q6_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q6_id, '2', FALSE, 1), (q6_id, '3', TRUE, 2), (q6_id, '4', FALSE, 3), (q6_id, 'Error', FALSE, 4);
    END IF;
    
    IF q7_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q7_id, '3', FALSE, 1), (q7_id, '0', FALSE, 2), (q7_id, 'Error', TRUE, 3), (q7_id, 'null', FALSE, 4);
    END IF;
    
    IF q8_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q8_id, '0', TRUE, 1), (q8_id, 'null', FALSE, 2), (q8_id, 'Error', FALSE, 3), (q8_id, '1', FALSE, 4);
    END IF;
    
    IF q9_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q9_id, '123', TRUE, 1), (q9_id, '321', FALSE, 2), (q9_id, '012', FALSE, 3), (q9_id, 'Error', FALSE, 4);
    END IF;
    
    IF q10_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q10_id, 'Fixed size', TRUE, 1),
        (q10_id, 'Indexed', TRUE, 2),
        (q10_id, 'Dynamic', FALSE, 3),
        (q10_id, 'Stores same type', TRUE, 4);
    END IF;
END $$;

-- STRINGS OPTIONS (Q11-Q17)
DO $$
DECLARE 
    q11_id BIGINT; q12_id BIGINT; q13_id BIGINT; q14_id BIGINT; q15_id BIGINT;
    q16_id BIGINT; q17_id BIGINT;
BEGIN
    SELECT id INTO q11_id FROM questions WHERE question_text LIKE '%s.length()%' AND topic='Strings' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q12_id FROM questions WHERE question_text LIKE '%s.charAt(0)%' AND topic='Strings' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q13_id FROM questions WHERE question_text LIKE '"Hi" + "Java"' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q14_id FROM questions WHERE question_text = 'Which are valid String methods?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q15_id FROM questions WHERE question_text LIKE '"cat"%' AND question_text LIKE '%charAt(2)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q16_id FROM questions WHERE question_text LIKE '"abc"%' AND question_text LIKE '%charAt(1)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q17_id FROM questions WHERE question_text LIKE '"A".concat("B")%' AND difficulty='EASY' LIMIT 1;
    
    IF q11_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q11_id, '3', FALSE, 1), (q11_id, '4', TRUE, 2), (q11_id, '5', FALSE, 3), (q11_id, 'Error', FALSE, 4);
    END IF;
    
    IF q12_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q12_id, 'C', TRUE, 1), (q12_id, 'o', FALSE, 2), (q12_id, 'd', FALSE, 3), (q12_id, 'Error', FALSE, 4);
    END IF;
    
    IF q13_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q13_id, 'Hi Java', FALSE, 1), (q13_id, 'HiJava', TRUE, 2), (q13_id, 'JavaHi', FALSE, 3), (q13_id, 'Error', FALSE, 4);
    END IF;
    
    IF q14_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q14_id, 'length()', TRUE, 1),
        (q14_id, 'charAt()', TRUE, 2),
        (q14_id, 'concat()', TRUE, 3),
        (q14_id, 'push()', FALSE, 4);
    END IF;
    
    IF q15_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q15_id, 'c', FALSE, 1), (q15_id, 'a', FALSE, 2), (q15_id, 't', TRUE, 3), (q15_id, 'Error', FALSE, 4);
    END IF;
    
    IF q16_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q16_id, 'a', FALSE, 1), (q16_id, 'b', TRUE, 2), (q16_id, 'c', FALSE, 3), (q16_id, 'Error', FALSE, 4);
    END IF;
    
    IF q17_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q17_id, 'A B', FALSE, 1), (q17_id, 'BA', FALSE, 2), (q17_id, 'AB', TRUE, 3), (q17_id, 'Error', FALSE, 4);
    END IF;
END $$;

-- LOOPS OPTIONS (Q18-Q23)
DO $$
DECLARE 
    q18_id BIGINT; q19_id BIGINT; q20_id BIGINT; q21_id BIGINT; q22_id BIGINT; q23_id BIGINT;
BEGIN
    SELECT id INTO q18_id FROM questions WHERE question_text LIKE 'for(int i=0;i<3;i++)%' AND difficulty='EASY' AND topic='Loops' LIMIT 1;
    SELECT id INTO q19_id FROM questions WHERE question_text LIKE 'int i=0;%while(i<2)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q20_id FROM questions WHERE question_text LIKE 'How many times%for(int i=0;i<4;i++)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q21_id FROM questions WHERE question_text LIKE 'for(int i=1;i<=3;i++)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q22_id FROM questions WHERE question_text = 'Which are loop types in Java?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q23_id FROM questions WHERE question_text LIKE 'for(int i=2;i<5;i++)%' AND difficulty='EASY' LIMIT 1;
    
    IF q18_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q18_id, '012', TRUE, 1), (q18_id, '123', FALSE, 2), (q18_id, '321', FALSE, 3), (q18_id, 'Error', FALSE, 4);
    END IF;
    
    IF q19_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q19_id, '01', TRUE, 1), (q19_id, '12', FALSE, 2), (q19_id, '02', FALSE, 3), (q19_id, 'Error', FALSE, 4);
    END IF;
    
    IF q20_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q20_id, '3', FALSE, 1), (q20_id, '4', TRUE, 2), (q20_id, '5', FALSE, 3), (q20_id, '0', FALSE, 4);
    END IF;
    
    IF q21_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q21_id, '123', TRUE, 1), (q21_id, '012', FALSE, 2), (q21_id, '321', FALSE, 3), (q21_id, 'Error', FALSE, 4);
    END IF;
    
    IF q22_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q22_id, 'for', TRUE, 1),
        (q22_id, 'while', TRUE, 2),
        (q22_id, 'repeat', FALSE, 3),
        (q22_id, 'do-while', TRUE, 4);
    END IF;
    
    IF q23_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q23_id, '234', TRUE, 1), (q23_id, '245', FALSE, 2), (q23_id, '123', FALSE, 3), (q23_id, 'Error', FALSE, 4);
    END IF;
END $$;

-- FUNCTIONS OPTIONS (Q24-Q29)
DO $$
DECLARE 
    q24_id BIGINT; q25_id BIGINT; q26_id BIGINT; q27_id BIGINT; q28_id BIGINT; q29_id BIGINT;
BEGIN
    SELECT id INTO q24_id FROM questions WHERE question_text LIKE 'int add(int a,int b)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q25_id FROM questions WHERE question_text = 'What does a return statement do?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q26_id FROM questions WHERE question_text = 'How do you call a method named test with no parameters?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q27_id FROM questions WHERE question_text = 'Which parts can a method have?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q28_id FROM questions WHERE question_text LIKE 'int square(int x)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q29_id FROM questions WHERE question_text = 'Which are valid method declarations?' AND difficulty='EASY' LIMIT 1;
    
    IF q24_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q24_id, '2', FALSE, 1), (q24_id, '3', FALSE, 2), (q24_id, '5', TRUE, 3), (q24_id, '23', FALSE, 4);
    END IF;
    
    IF q25_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q25_id, 'Stops a loop', FALSE, 1), (q25_id, 'Sends a value back', TRUE, 2), 
        (q25_id, 'Prints text', FALSE, 3), (q25_id, 'Creates a variable', FALSE, 4);
    END IF;
    
    IF q26_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q26_id, 'test;', FALSE, 1), (q26_id, 'call(test);', FALSE, 2), (q26_id, 'test();', TRUE, 3), (q26_id, 'method test();', FALSE, 4);
    END IF;
    
    IF q27_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q27_id, 'return type', TRUE, 1),
        (q27_id, 'method name', TRUE, 2),
        (q27_id, 'parameters', TRUE, 3),
        (q27_id, 'pizza', FALSE, 4);
    END IF;
    
    IF q28_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q28_id, '3', FALSE, 1), (q28_id, '6', FALSE, 2), (q28_id, '9', TRUE, 3), (q28_id, 'Error', FALSE, 4);
    END IF;
    
    IF q29_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q29_id, 'int add(int a, int b){ return a+b; }', TRUE, 1),
        (q29_id, 'void test(){}', TRUE, 2),
        (q29_id, 'method go(){}', FALSE, 3),
        (q29_id, 'String name(){ return "A"; }', TRUE, 4);
    END IF;
END $$;

-- CONDITIONALS OPTIONS (Q30-Q35)
DO $$
DECLARE 
    q30_id BIGINT; q31_id BIGINT; q32_id BIGINT; q33_id BIGINT; q34_id BIGINT; q35_id BIGINT;
BEGIN
    SELECT id INTO q30_id FROM questions WHERE question_text LIKE 'int x=5;%if(x>3)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q31_id FROM questions WHERE question_text LIKE 'int x=2;%if(x>3)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q32_id FROM questions WHERE question_text = 'Which keyword is used for another condition check?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q33_id FROM questions WHERE question_text = 'Which comparison operators are valid in Java conditions?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q34_id FROM questions WHERE question_text LIKE 'int x=7;%if(x==7)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q35_id FROM questions WHERE question_text LIKE 'int x=4;%if(x<2)%' AND difficulty='EASY' LIMIT 1;
    
    IF q30_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q30_id, 'Yes', TRUE, 1), (q30_id, 'No', FALSE, 2), (q30_id, '5', FALSE, 3), (q30_id, 'Error', FALSE, 4);
    END IF;
    
    IF q31_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q31_id, 'Yes', FALSE, 1), (q31_id, 'No', TRUE, 2), (q31_id, '2', FALSE, 3), (q31_id, 'Error', FALSE, 4);
    END IF;
    
    IF q32_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q32_id, 'otherwise', FALSE, 1), (q32_id, 'elseif', FALSE, 2), (q32_id, 'else if', TRUE, 3), (q32_id, 'next if', FALSE, 4);
    END IF;
    
    IF q33_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q33_id, '>', TRUE, 1),
        (q33_id, '<', TRUE, 2),
        (q33_id, '==', TRUE, 3),
        (q33_id, '<>', FALSE, 4);
    END IF;
    
    IF q34_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q34_id, 'Match', TRUE, 1), (q34_id, 'No Match', FALSE, 2), (q34_id, '7', FALSE, 3), (q34_id, 'Error', FALSE, 4);
    END IF;
    
    IF q35_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q35_id, 'Low', FALSE, 1), (q35_id, 'High', TRUE, 2), (q35_id, '4', FALSE, 3), (q35_id, 'Error', FALSE, 4);
    END IF;
END $$;

-- OOP OPTIONS (Q36-Q40)
DO $$
DECLARE 
    q36_id BIGINT; q37_id BIGINT; q38_id BIGINT; q39_id BIGINT; q40_id BIGINT;
BEGIN
    SELECT id INTO q36_id FROM questions WHERE question_text LIKE 'class A{}%A obj = new A()%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q37_id FROM questions WHERE question_text = 'What is a class?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q38_id FROM questions WHERE question_text = 'What keyword creates an object?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q39_id FROM questions WHERE question_text = 'Which are common OOP concepts?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q40_id FROM questions WHERE question_text = 'What is obj in A obj = new A();?' AND difficulty='EASY' LIMIT 1;
    
    IF q36_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q36_id, 'A method', FALSE, 1), (q36_id, 'An object', TRUE, 2), (q36_id, 'A loop', FALSE, 3), (q36_id, 'An array', FALSE, 4);
    END IF;
    
    IF q37_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q37_id, 'An object created from code', FALSE, 1), (q37_id, 'A blueprint for objects', TRUE, 2), 
        (q37_id, 'A variable type only', FALSE, 3), (q37_id, 'A loop structure', FALSE, 4);
    END IF;
    
    IF q38_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q38_id, 'class', FALSE, 1), (q38_id, 'object', FALSE, 2), (q38_id, 'new', TRUE, 3), (q38_id, 'this', FALSE, 4);
    END IF;
    
    IF q39_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q39_id, 'Class', TRUE, 1),
        (q39_id, 'Object', TRUE, 2),
        (q39_id, 'Inheritance', TRUE, 3),
        (q39_id, 'Array index', FALSE, 4);
    END IF;
    
    IF q40_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q40_id, 'Class name', FALSE, 1), (q40_id, 'Object reference', TRUE, 2), (q40_id, 'Method name', FALSE, 3), (q40_id, 'Keyword', FALSE, 4);
    END IF;
END $$;

-- VARIABLES OPTIONS (Q41-Q46)
DO $$
DECLARE 
    q41_id BIGINT; q42_id BIGINT; q43_id BIGINT; q44_id BIGINT; q45_id BIGINT; q46_id BIGINT;
BEGIN
    SELECT id INTO q41_id FROM questions WHERE question_text LIKE 'int x=10;%System.out.println(x)%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q42_id FROM questions WHERE question_text = 'Which type stores whole numbers?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q43_id FROM questions WHERE question_text = 'Which type stores true or false?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q44_id FROM questions WHERE question_text = 'Which are valid Java variable types?' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q45_id FROM questions WHERE question_text LIKE 'String name = "Sam"%' AND difficulty='EASY' LIMIT 1;
    SELECT id INTO q46_id FROM questions WHERE question_text LIKE 'double x = 2.5%' AND difficulty='EASY' LIMIT 1;
    
    IF q41_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q41_id, '10', TRUE, 1), (q41_id, 'x', FALSE, 2), (q41_id, '0', FALSE, 3), (q41_id, 'Error', FALSE, 4);
    END IF;
    
    IF q42_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q42_id, 'String', FALSE, 1), (q42_id, 'int', TRUE, 2), (q42_id, 'boolean', FALSE, 3), (q42_id, 'double[]', FALSE, 4);
    END IF;
    
    IF q43_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q43_id, 'int', FALSE, 1), (q43_id, 'String', FALSE, 2), (q43_id, 'boolean', TRUE, 3), (q43_id, 'char', FALSE, 4);
    END IF;
    
    IF q44_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q44_id, 'int', TRUE, 1),
        (q44_id, 'String', TRUE, 2),
        (q44_id, 'boolean', TRUE, 3),
        (q44_id, 'number', FALSE, 4);
    END IF;
    
    IF q45_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q45_id, 'Sam', TRUE, 1), (q45_id, 'name', FALSE, 2), (q45_id, 'String', FALSE, 3), (q45_id, 'Error', FALSE, 4);
    END IF;
    
    IF q46_id IS NOT NULL THEN
        INSERT INTO options (question_id, option_text, is_correct, option_order) VALUES
        (q46_id, '2', FALSE, 1), (q46_id, '2.5', TRUE, 2), (q46_id, 'x', FALSE, 3), (q46_id, 'Error', FALSE, 4);
    END IF;
END $$;