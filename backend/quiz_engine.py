import random

class QuizGenerator:
    def __init__(self):
        # Expanded Question Banks (15+ per skill to ensure variety when picking 5)
        self.question_banks = {
            "python": [
                {"q": "What is the output of print(2 ** 3)?", "options": ["6", "8", "9", "5"], "answer": "8"},
                {"q": "Which keyword is used to define a function?", "options": ["func", "def", "definition", "function"], "answer": "def"},
                {"q": "What data type is [1, 2, 3]?", "options": ["Tuple", "List", "Dictionary", "Set"], "answer": "List"},
                {"q": "How do you start a for loop?", "options": ["for x in y:", "loop x in y", "for each x in y", "x.loop()"], "answer": "for x in y:"},
                {"q": "What is the result of 'a' + 'b'?", "options": ["ab", "a+b", "Error", "None"], "answer": "ab"},
                {"q": "Which is immutable?", "options": ["List", "Dictionary", "Set", "Tuple"], "answer": "Tuple"},
                {"q": "What does `len()` return?", "options": ["Length", "Last Item", "First Item", "Loop"], "answer": "Length"},
                {"q": "How to comment in Python?", "options": ["//", "#", "/* */", "<!-- -->"], "answer": "#"},
                {"q": "Keyword for infinite loop?", "options": ["forever", "while True:", "loop:", "infinite"], "answer": "while True:"},
                {"q": "Output of `bool([])`?", "options": ["True", "False", "Error", "None"], "answer": "False"},
                {"q": "Correct way to import?", "options": ["import math", "include math", "using math", "load math"], "answer": "import math"},
                {"q": "What is `None`?", "options": ["Zero", "Null value", "Empty String", "False"], "answer": "Null value"},
                {"q": "Method to add to set?", "options": ["add()", "append()", "push()", "insert()"], "answer": "add()"},
                {"q": "Which is not a keyword?", "options": ["eval", "pass", "assert", "lambda"], "answer": "eval"},
                {"q": "Operator for integer division?", "options": ["/", "//", "%", "#"], "answer": "//"}
            ],
            "react": [
                {"q": "Which hook is used for side effects?", "options": ["useState", "useEffect", "useContext", "useReducer"], "answer": "useEffect"},
                {"q": "How do you pass data to child components?", "options": ["State", "Props", "Context", "Redux"], "answer": "Props"},
                {"q": "What is JSX?", "options": ["Java XML", "JavaScript XML", "JSON XML", "Java Syntax"], "answer": "JavaScript XML"},
                {"q": "Which method is used to update state?", "options": ["updateState", "setState", "changeState", "modState"], "answer": "setState"},
                {"q": "What is the virtual DOM?", "options": ["A virus", "A lightweight copy of the DOM", "A heavy database", "None"], "answer": "A lightweight copy of the DOM"},
                {"q": "Hook for managing local state?", "options": ["useEffect", "useReducer", "useState", "useMemo"], "answer": "useState"},
                {"q": "Value of reference with `useRef`?", "options": [".value", ".current", ".ref", ".node"], "answer": ".current"},
                {"q": "Purpose of `useMemo`?", "options": ["Memoize values", "Memoize functions", "Side effects", "Routing"], "answer": "Memoize values"},
                {"q": "Default port for React scripts?", "options": ["3000", "8000", "8080", "5000"], "answer": "3000"},
                {"q": "Library for typechecking?", "options": ["PropTypes", "ReactTypes", "CheckTypes", "None"], "answer": "PropTypes"},
                {"q": "Context API avoids?", "options": ["Prop Drilling", "State", "Hooks", "CSS"], "answer": "Prop Drilling"},
                {"q": "Parent of all components?", "options": ["Root", "App", "Main", "Index"], "answer": "App"},
                {"q": "React router hook for parameters?", "options": ["useParams", "useHistory", "useRoute", "useQuery"], "answer": "useParams"},
                {"q": "Which is a Higher Order Component?", "options": ["withRouter", "div", "span", "App"], "answer": "withRouter"},
                {"q": "Attribute for list rendering?", "options": ["id", "key", "index", "ref"], "answer": "key"}
            ],
            "javascript": [
                {"q": "Which is not a primitive type?", "options": ["String", "Number", "Object", "Boolean"], "answer": "Object"},
                {"q": "How do you declare a constant?", "options": ["var", "let", "const", "def"], "answer": "const"},
                {"q": "What is 'NaN'?", "options": ["Not a Number", "Null", "Undefined", "Error"], "answer": "Not a Number"},
                {"q": "Which method adds to array end?", "options": ["push", "pop", "shift", "unshift"], "answer": "push"},
                {"q": "What is ===?", "options": ["Assignment", "Equality", "Strict Equality", "Inequality"], "answer": "Strict Equality"},
                {"q": "Keyword for current object?", "options": ["self", "this", "me", "object"], "answer": "this"},
                {"q": "Output of `typeof []`?", "options": ["array", "list", "object", "undefined"], "answer": "object"},
                {"q": "Convert string to int?", "options": ["parseInt", "toInt", "parseInteger", "int"], "answer": "parseInt"},
                {"q": "Which is a loop?", "options": ["for", "foreach", "map", "All of above"], "answer": "All of above"},
                {"q": "DOM stands for?", "options": ["Document Object Model", "Data Object Model", "Disk Operating Mode", "None"], "answer": "Document Object Model"},
                {"q": "Default return of function?", "options": ["0", "null", "undefined", "false"], "answer": "undefined"},
                {"q": "Event for clicking?", "options": ["onclick", "onpress", "onhit", "ontouch"], "answer": "onclick"},
                {"q": "JSON stringify does?", "options": ["Parses JSON", "Converts to String", "Formats Code", "Deletes Data"], "answer": "Converts to String"},
                {"q": "Symbol for logical OR?", "options": ["||", "&&", "!", "|"], "answer": "||"},
                {"q": "Async function returns?", "options": ["Value", "Promise", "Error", "Callback"], "answer": "Promise"}
            ]
        }
        
    def generate_quiz(self, skill: str):
        skill_key = skill.lower()
        questions = []
        
        if skill_key in self.question_banks:
             pool = self.question_banks[skill_key]
             questions = random.sample(pool, min(5, len(pool)))
        else:
            # Enhanced Dynamic Fallback
            # Creates randomization even for unknown skills by mixing templates
            templates = [
                {"q": f"What is a core principle of {skill}?", "options": ["Abstraction", "Compilation", "Execution", "Validation"], "answer": "Abstraction"},
                {"q": f"Which tool is commonly associated with {skill}?", "options": ["VS Code", "Eclipse", "Notepad", "Excel"], "answer": "VS Code"},
                {"q": f"Level of difficulty for {skill}?", "options": ["Beginner", "Intermediate", "Advanced", "Expert"], "answer": "Intermediate"},
                {"q": f"Community verification for {skill}?", "options": ["GitHub", "StackOverflow", "Reddit", "LinkedIn"], "answer": "GitHub"},
                {"q": f"Standard file extension for {skill}?", "options": [".txt", ".bin", ".src", ".code"], "answer": ".src"},
                {"q": f"Primary use case for {skill}?", "options": ["Web Dev", "Data Science", "System Admin", "Design"], "answer": "Web Dev"},
                {"q": f"Is {skill} open source?", "options": ["Yes", "No", "Partially", "Unknown"], "answer": "Yes"},
                {"q": f"Year {skill} was popularized?", "options": ["1990s", "2000s", "2010s", "2020s"], "answer": "2010s"}
            ]
            questions = random.sample(templates, 5)

        # Shuffle Options for every question to ensure it looks different even if question repeats
        final_questions = []
        for q in questions:
            opts = q["options"][:] # Copy
            random.shuffle(opts)
            final_questions.append({
                "q": q["q"],
                "options": opts,
                "answer": q["answer"]
            })
            
        return final_questions
