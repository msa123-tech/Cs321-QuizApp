/**
 * @param {string} topic
 * @param {number} i
 * @param {QuestionType} type
 * @param {string} prompt
 * @param {string[]} options
 * @param {number[]} correctIndices
 */
function q(topic, i, type, prompt, options, correctIndices) {
  return {
    id: `${topic}-${i}`,
    type,
    prompt,
    options,
    correctIndices,
  };
}

const TOPIC_IDS = ['arrays', 'strings', 'loops', 'functions', 'conditionals', 'oop', 'variables'];

const TOPIC_BANK = {
  arrays: [
    q('arrays', 0, 'single', 'What prints?\n\nint[] a = {2, 4, 6};\nSystem.out.println(a[1]);', ['2', '4', '6', '1'], [1]),
    q('arrays', 1, 'single', 'Length of `new int[5]`?', ['4', '5', '6', '0'], [1]),
    q('arrays', 2, 'multi', 'Which are valid ways to declare an int array? (pick all)', ['int[] x;', 'int x[];', 'array int x;', 'int x = [];'], [0, 1]),
    q('arrays', 3, 'single', 'What prints?\n\nint[] a = {1,2,3};\nSystem.out.println(a.length);', ['1', '2', '3', '0'], [2]),
    q('arrays', 4, 'single', 'Default value of `new int[3][2][1]` element?', ['null', '0', 'undefined', '1'], [1]),
    q('arrays', 5, 'multi', 'After `int[] a = {1,2,3};` which indices are safe?', ['0', '1', '2', '3'], [0, 1, 2]),
    q('arrays', 6, 'single', 'Enhanced for: `for (int v : arr)` iterates over?', ['Indices', 'Values', 'Copies of array object', 'Keys'], [1]),
    q('arrays', 7, 'single', 'What prints?\n\nint[][] m = {{1,2},{3}};\nSystem.out.println(m[1][0]);', ['1', '2', '3', '0'], [2]),
    q('arrays', 8, 'single', '`Arrays.copyOf(arr, n)` returns?', ['void', 'A new array', 'The same reference always', 'boolean'], [1]),
    q('arrays', 9, 'multi', 'Which literals create a 2-element int array?', ['new int[]{1,2}', '{1,2}', 'new int[2]', 'int[]{1,2}'], [0, 2]),
  ],
  strings: [
    q('strings', 0, 'single', 'What prints?\n\nString s = "hi";\nSystem.out.println(s.length());', ['0', '1', '2', '3'], [2]),
    q('strings', 1, 'single', '`"a" + "b"` evaluates to?', ['ab', 'a b', 'error', '2'], [0]),
    q('strings', 2, 'multi', 'Which methods return a new String? (pick all)', ['substring(0,1)', 'toUpperCase()', 'charAt(0)', 'replace("a","b")'], [0, 1, 3]),
    q('strings', 3, 'single', 'Comparing content should use?', ['==', 'equals()', 'compare()', 'same()'], [1]),
    q('strings', 4, 'single', 'What prints?\n\nString s = "abc";\nSystem.out.println(s.charAt(2));', ['a', 'b', 'c', 'error'], [2]),
    q('strings', 5, 'single', '`"hello".indexOf("l")`?', ['1', '2', '3', '-1'], [1]),
    q('strings', 6, 'single', '`String` objects are?', ['Always mutable', 'Immutable', 'Primitive', 'Numeric'], [1]),
    q('strings', 7, 'multi', 'Which escape valid in a Java string?', ['\\n', '\\t', '\\"', '\\\\'], [0, 1, 2, 3]),
    q('strings', 8, 'single', 'What prints?\n\nSystem.out.println("".isEmpty());', ['true', 'false', 'error', 'null'], [0]),
    q('strings', 9, 'single', '`"Aa".compareToIgnoreCase("aA")` is?', ['negative', '0', 'positive', 'error'], [1]),
  ],
  loops: [
    q('loops', 0, 'single', 'How many times prints `Hi`?\n\nfor (int i = 0; i < 3; i++) System.out.println("Hi");', ['2', '3', '4', '0'], [1]),
    q('loops', 1, 'single', '`while (false) { }` runs body how many times?', ['0', '1', 'Infinite', 'Compile error'], [0]),
    q('loops', 2, 'multi', 'Which can create an infinite loop if condition never changes?', ['while (true)', 'for (;;)', 'do { } while (true);', 'for (int i=0;i<10;i++)'], [0, 1, 2]),
    q('loops', 3, 'single', 'After loop `for (int i=0;i<5;i++)` final value of i in scope?', ['4', '5', 'Not in scope outside', '0'], [2]),
    q('loops', 4, 'single', '`break` inside inner loop exits?', ['Only inner loop', 'All loops', 'Program', 'Switch only'], [0]),
    q('loops', 5, 'single', '`continue` skips to?', ['End of program', 'Next iteration', 'Catch block', 'Finally'], [1]),
    q('loops', 6, 'single', 'do-while runs body at least?', ['0 times', '1 time', '2 times', 'Never'], [1]),
    q('loops', 7, 'multi', 'Valid for-loop headers?', ['for (;;)', 'for (int i : arr)', 'for (int i=0,j=0; i<3; i++)', 'for ()'], [0, 1, 2]),
    q('loops', 8, 'single', 'Nested loops for n×m matrix use complexity?', ['O(n)', 'O(n+m)', 'O(n*m)', 'O(1)'], [2]),
    q('loops', 9, 'single', 'What prints?\n\nint s=0; for(int i=1;i<=3;i++) s+=i;\nSystem.out.println(s);', ['3', '6', '10', '0'], [1]),
  ],
  functions: [
    q('functions', 0, 'single', 'Java methods live inside?', ['Files only', 'Classes (or interfaces/records)', 'Folders', 'Imports'], [1]),
    q('functions', 1, 'single', '`void foo()` return type means?', ['Returns null', 'Returns nothing', 'Error', 'Optional'], [1]),
    q('functions', 2, 'multi', 'Which can overload a method `void m(int x)`?', ['void m(double x)', 'int m(int x)', 'void m(int x, int y)', 'void m()'], [0, 2, 3]),
    q('functions', 3, 'single', '`static` method can access instance fields?', ['Always', 'Never', 'Sometimes', 'Only private'], [1]),
    q('functions', 4, 'single', 'Parameters are passed by value for?', ['Objects and primitives', 'Primitives only; object refs by value', 'Always reference', 'Always pointer'], [1]),
    q('functions', 5, 'single', 'Recursion needs?', ['for loop', 'A base case', 'Two classes', 'import java.lang.*'], [1]),
    q('functions', 6, 'single', 'Return type mismatch is caught at?', ['Runtime', 'Compile time', 'Never', 'JUnit only'], [1]),
    q('functions', 7, 'multi', 'Valid access modifiers on methods?', ['public', 'private', 'protected', 'friendly'], [0, 1, 2]),
    q('functions', 8, 'single', 'Varargs `void m(int... a)` receives as?', ['int[] inside method', 'List', 'int only', 'Object'], [0]),
    q('functions', 9, 'single', 'Method name + parameter types is the?', ['Signature', 'Body', 'Contract', 'Package'], [0]),
  ],
  conditionals: [
    q('conditionals', 0, 'single', '`if (false) A; else B;` runs?', ['A', 'B', 'Both', 'Error'], [1]),
    q('conditionals', 1, 'single', '`switch` on String is allowed since?', ['Java 1', 'Java 5', 'Java 7', 'Java 11'], [2]),
    q('conditionals', 2, 'multi', 'Which are relational operators?', ['<', '>', '&&', '=='], [0, 1, 3]),
    q('conditionals', 3, 'single', '`x = 5` inside `if` condition assigns and value is?', ['boolean', '5 (int)', 'void', 'illegal'], [1]),
    q('conditionals', 4, 'single', '`a && b` evaluates b if a is?', ['true', 'false', 'always', 'never'], [0]),
    q('conditionals', 5, 'single', 'Ternary `a ? b : c` requires?', ['a is int', 'a is boolean', 'b and c void', 'c omitted'], [1]),
    q('conditionals', 6, 'single', '`switch` without `break` can?', ['Fall through', 'Auto-stop', 'Error', 'Return'], [0]),
    q('conditionals', 7, 'multi', 'Compile-time constant case labels possible for?', ['int', 'String (Java 7+)', 'boolean', 'enum'], [0, 1, 3]),
    q('conditionals', 8, 'single', '`if (x = 0)` in Java is?', ['Valid', 'Compile error', 'Runtime error', 'Deprecated'], [1]),
    q('conditionals', 9, 'single', 'What prints?\n\nint x=2;\nSystem.out.println(x>1 ? "yes" : "no");', ['yes', 'no', 'error', '2'], [0]),
  ],
  oop: [
    q('oop', 0, 'single', '`new` allocates object on?', ['Stack only', 'Heap', 'Register', 'String pool'], [1]),
    q('oop', 1, 'single', 'A subclass constructor must call super?', ['Never', 'First line implicitly or explicitly', 'Last line', 'Only if abstract'], [1]),
    q('oop', 2, 'multi', 'Which support runtime polymorphism?', ['Overriding instance methods', 'Overloading', 'Interfaces', 'static methods'], [0, 2]),
    q('oop', 3, 'single', '`abstract class` can be instantiated?', ['Yes', 'No', 'Only static', 'Only inner'], [1]),
    q('oop', 4, 'single', '`@Override` helps catch?', ['Syntax in comments', 'Incorrect override at compile time', 'Nulls', 'Loops'], [1]),
    q('oop', 5, 'single', 'Encapsulation often uses?', ['public fields only', 'private fields + accessors', 'No fields', 'global'], [1]),
    q('oop', 6, 'single', 'A class implements interfaces with?', ['implements', 'extends', 'uses', 'with'], [0]),
    q('oop', 7, 'multi', 'Which can be true about `final`?', ['final class cannot be subclassed', 'final method cannot be overridden', 'final field always constant', 'final variable reassigned'], [0, 1]),
    q('oop', 8, 'single', '`this` refers to?', ['Parent class', 'Current object', 'Static context', 'Package'], [1]),
    q('oop', 9, 'single', 'Default package visibility is also called?', ['public', 'private', 'package-private', 'protected'], [2]),
  ],
  variables: [
    q('variables', 0, 'single', 'Local variables must be?', ['Initialized before use', 'Declared static', 'Final', 'Public'], [0]),
    q('variables', 1, 'single', 'Default for uninitialized instance `int x` is?', ['Random', '0', 'null', 'Compile error'], [1]),
    q('variables', 2, 'multi', 'Which are primitive types?', ['int', 'double', 'String', 'boolean'], [0, 1, 3]),
    q('variables', 3, 'single', '`var x = 10;` x type is?', ['Object', 'int', 'var', 'Integer'], [1]),
    q('variables', 4, 'single', 'Widening: `double d = 3;` is?', ['Illegal', 'Allowed', 'Needs cast', 'Runtime error'], [1]),
    q('variables', 5, 'single', 'Narrowing `int x = (int) 3.9;` gives x =', ['4', '3', '3.9', 'error'], [1]),
    q('variables', 6, 'single', 'Instance variable lives for?', ['Method call only', 'Object lifetime', 'Forever static', 'Loop only'], [1]),
    q('variables', 7, 'multi', 'Valid identifiers?', ['_count', '2bad', 'totalSum', 'class'], [0, 2]),
    q('variables', 8, 'single', '`final` local can be assigned?', ['Once', 'Many times', 'Never', 'Only in loop'], [0]),
    q('variables', 9, 'single', 'Wrapper `Integer.valueOf(5)` is?', ['Always new object', 'May be cached for small values', 'Primitive', 'char'], [1]),
  ],
};

const DIFFICULTY_BANK = {
  easy: [
    q('easy', 0, 'single', 'What prints?\n\nSystem.out.println(2 + 3);', ['23', '5', '6', 'error'], [1]),
    q('easy', 1, 'single', 'What prints?\n\nint x = 7;\nSystem.out.println(x / 2);', ['3.5', '3', '4', '0'], [1]),
    q('easy', 2, 'multi', 'Which are Java keywords? (pick all)', ['class', 'goto', 'if', 'while'], [0, 2, 3]),
    q('easy', 3, 'single', 'What prints?\n\nboolean b = true;\nSystem.out.println(!b);', ['true', 'false', '0', 'error'], [1]),
    q('easy', 4, 'single', 'What prints?\n\nString s = null;\nSystem.out.println(s == null);', ['true', 'false', 'error', 'null'], [0]),
    q('easy', 5, 'single', '`15 % 4` equals?', ['3', '4', '1', '0'], [0]),
    q('easy', 6, 'single', 'What prints?\n\nSystem.out.println("A".equals("a"));', ['true', 'false', 'error', '0'], [1]),
    q('easy', 7, 'multi', 'Which evaluate to 4?', ['2+2', '8/2', '2*3', '9-5'], [0, 1, 3]),
    q('easy', 8, 'single', 'What prints?\n\nint x=5;\nx++;\nSystem.out.println(x);', ['4', '5', '6', 'error'], [2]),
    q('easy', 9, 'single', '`System.out.println(10 > 3);` prints?', ['10', '3', 'true', '1'], [2]),
  ],
  medium: [
    q('medium', 0, 'single', 'What prints?\n\nString a = "x";\nString b = "x";\nSystem.out.println(a == b);', ['true', 'false', 'compile error', 'null'], [0]),
    q('medium', 1, 'single', 'What prints?\n\nint i = 0;\nSystem.out.println(i++ + ++i);', ['1', '2', '3', '0'], [1]),
    q('medium', 2, 'multi', 'Which can throw NullPointerException? (pick all)', ['s.length() if s is null', '((Integer)null).intValue()', 'Objects.requireNonNull(null)', '1 + 2'], [0, 1, 2]),
    q('medium', 3, 'single', '`try { return 1; } finally { return 2; }` returns?', ['1', '2', '0', 'error'], [1]),
    q('medium', 4, 'single', 'What prints?\n\nList<Integer> xs = Arrays.asList(1,2,3);\nSystem.out.println(xs.get(2));', ['1', '2', '3', 'IndexOutOfBounds'], [2]),
    q('medium', 5, 'single', '`"abcde".substring(1,3)` is?', ['"abc"', '"bc"', '"ab"', '"bcd"'], [1]),
    q('medium', 6, 'single', 'What prints?\n\nInteger a = 200, b = 200;\nSystem.out.println(a == b);', ['true', 'false', 'error', '200'], [1]),
    q('medium', 7, 'multi', 'Valid interface members in modern Java?', ['default methods', 'static methods', 'private methods', 'final fields only'], [0, 1, 2]),
    q('medium', 8, 'single', 'What prints?\n\nint x=0;\nfor(;x<3;x++);\nSystem.out.println(x);', ['2', '3', '4', '0'], [1]),
    q('medium', 9, 'single', '`switch` on `null` String throws?', ['IllegalArgument', 'NullPointerException', 'No error', 'Compile error'], [1]),
  ],
  hard: [
    q('hard', 0, 'single', 'What prints?\n\nint a = 5;\nSystem.out.println(a++ + --a);', ['9', '10', '11', 'Compile error'], [1]),
    q('hard', 1, 'single', 'What prints?\n\nboolean a=false,b=true;\nSystem.out.println(a = b);', ['false', 'true', 'error', '0'], [1]),
    q('hard', 2, 'multi', 'Which are true about generics? (pick all)', ['Type erasure removes param types at runtime', 'You cannot new T()', 'List<String> is List at runtime', 'Primitives as type args allowed'], [0, 1, 2]),
    q('hard', 3, 'single', '`try (AutoCloseable c = () -> {}) { }` — valid?', ['Yes', 'No', 'Only with catch', 'Java 8 only'], [0]),
    q('hard', 4, 'single', 'What prints?\n\nSystem.out.println(Math.abs(Integer.MIN_VALUE));', ['Integer.MAX_VALUE', 'positive MIN_VALUE', 'Integer.MIN_VALUE', '0'], [2]),
    q('hard', 5, 'single', 'Capturing `int` in lambda requires it to be?', ['static', 'effectively final', 'volatile', 'public'], [1]),
    q('hard', 6, 'single', '`enum E { A { void m(){} } }` — inner?', ['syntax invalid', 'constant-specific class body', 'anonymous class', 'nested enum'], [1]),
    q('hard', 7, 'multi', 'Unchecked warnings often from? (pick all)', ['Raw List usage', 'Cast to generic type', 'String concat', 'var with diamond'], [0, 1]),
    q('hard', 8, 'single', 'What prints?\n\nString s = "hello";\ns.concat(" world");\nSystem.out.println(s);', ['hello world', 'hello', 'error', 'world'], [1]),
    q('hard', 9, 'single', '`Thread.start()` twice on same instance?', ['Runs twice', 'IllegalStateException', 'No-op', 'Compile error'], [1]),
  ],
};

export function isValidTopic(topic) {
  return TOPIC_IDS.includes(topic);
}

export function isValidDifficulty(d) {
  return d === 'easy' || d === 'medium' || d === 'hard';
}

/** @param {{ topic?: string, difficulty?: string }} params */
export function getMockQuestions(params) {
  const { topic, difficulty } = params;
  if (topic && TOPIC_BANK[topic]) {
    return TOPIC_BANK[topic].map((x) => ({ ...x }));
  }
  if (difficulty && DIFFICULTY_BANK[difficulty]) {
    return DIFFICULTY_BANK[difficulty].map((x) => ({ ...x }));
  }
  return [];
}

export { TOPIC_IDS };
