document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userForm = document.getElementById('user-form');
    const categorySelectionSection = document.getElementById('category-selection');
    const difficultySelectionSection = document.getElementById('difficulty-selection');
    const quizSection = document.getElementById('quiz');
    const resultsSection = document.getElementById('results');
    const categoryHeading = document.getElementById('categoryTitle');

    // Global State
    let questionsData = [];
    let currentQuestions = [];
    let userAnswers = [];
    let currentQuestionIndex = 0;
    let selectedCategory = '';
    let selectedDifficulty = '';
    let tempSelectedOption = '';

    // Load questions from JSON
    function loadQuestions() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                questionsData = data;
                console.log("Domande Caricate", questionsData);
            })
            .catch(error => console.error("Impossibile caricare domande:", error));
    }
    loadQuestions();
    
    userForm.addEventListener('submit', handleUserFormSubmit);

    // Handlers
    function handleUserFormSubmit(event) {
        event.preventDefault();
        userForm.style.display = 'none';
        displayCategories();
    }
    
    function createBackButton(targetFunction) {
        const backButton = document.createElement('button');
        backButton.addEventListener('click', targetFunction);
        return backButton;
    }
    function backToLogin() {
        categorySelectionSection.style.display = 'none';
        userForm.style.display = 'block';
    }
    
    function backToCategorySelection() {
        difficultySelectionSection.style.display = 'none';
        displayCategories(); // This already handles showing the category selection
    }
    
    function backToDifficultySelection() {
        // Hide quiz or results and show difficulty selection
        quizSection.style.display = 'none';
        resultsSection.style.display = 'none'; // Adjust based on where the back button is placed
        displayDifficulties();
    }
    
    
    function displayCategories() {
        const categoryHeading = document.getElementById('categoryTitle');
        categoryHeading.style.display = 'block';
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'button-container';
    
        const uniqueCategories = [...new Set(questionsData.map(question => question.category))];
        uniqueCategories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.addEventListener('click', () => selectCategory(category));
            categoriesContainer.appendChild(button); // Append button to container
        });
    
        // Define the categorySection here, before using it
        const categorySection = document.getElementById('category-selection');
        categorySection.innerHTML = ''; // Clear existing content
        categorySection.appendChild(categoryHeading);
        categorySection.appendChild(categoriesContainer); // Append the container to the section
        
        // Now that categorySection is defined, you can append the back button
        const backButton = createBackButton(backToLogin);
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Torna alla login';
        backButton.className = 'back-button';
        categorySection.appendChild(backButton);
    
        categorySection.style.display = 'flex'; // Make sure the display is set to flex
    }
    
    
    function selectCategory(category) {
        selectedCategory = category;
        categorySelectionSection.style.display = 'none';
        displayDifficulties();
    }

    function displayDifficulties() {
        const difficultyHeading = document.getElementById('difficultyTitle');
        difficultyHeading.style.display = 'block';
        const difficultiesContainer = document.createElement('div');
        difficultiesContainer.className = 'button-container';
        
        const difficulties = ['Facile', 'Media', 'Difficile']; // Example difficulties
        
        // Initialize difficultySection here before the loop and before appending anything to it
        const difficultySection = document.getElementById('difficulty-selection');
        difficultySection.innerHTML = ''; // Clear existing content
        
        difficulties.forEach(difficulty => {
            const button = document.createElement('button');
            button.textContent = difficulty;
            button.addEventListener('click', () => selectDifficulty(difficulty));
            difficultiesContainer.appendChild(button); // Append button to container
        });
    
        difficultySection.appendChild(difficultyHeading);
        difficultySection.appendChild(difficultiesContainer); // Append the container to the section
        
        // Append the back button after the difficultySection is fully defined and initialized
        const backButton = createBackButton(backToCategorySelection);
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Torna alle Categorie';
        backButton.className = 'back-button';
        difficultySection.appendChild(backButton);
        
        difficultySection.style.display = 'flex'; // Make sure the display is set to flex
    }
    
    
    function selectDifficulty(difficulty) {
        selectedDifficulty = difficulty;
        difficultySelectionSection.style.display = 'none';
        prepareQuestions();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }
    
    function prepareQuestions() {
        currentQuestions = questionsData.filter(question => question.category === selectedCategory && question.difficulty === selectedDifficulty);
        shuffleArray(currentQuestions); // Shuffle questions
        currentQuestionIndex = 0;
        userAnswers = []; // Reset user answers for a new quiz attempt
        showQuestion();
    }
    
    function showQuestion() {
        const questionNumber = currentQuestionIndex + 1;
        quizSection.innerHTML = `<h1 class="question-title">DOMANDA NUMERO ${questionNumber} SU 10</h1><h4>${currentQuestions[currentQuestionIndex].question}</h4>`;
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
    
        currentQuestions[currentQuestionIndex].options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'answer-button';
            button.addEventListener('click', function() {
                // Clear previously selected answer's styling
                document.querySelectorAll('.answer-button').forEach(btn => {
                    btn.classList.remove('answer-selected');
                });
                
                // Mark this as the selected answer
                this.classList.add('answer-selected');
                tempSelectedOption = option;
            });
            buttonContainer.appendChild(button);
        });
    
        quizSection.appendChild(buttonContainer);
    
        // Next Question Button
        const nextQuestionButton = document.createElement('button');
        if (currentQuestionIndex + 1 === currentQuestions.lenght) {
            nextQuestionButton.textContent = 'Mostra Risultati';
            nextQuestionButton.addEventListener('click', displayResult);
        }
            else {
            nextQuestionButton.textContent = 'Prossima Domanda';
            nextQuestionButton.addEventListener('click', nextQuestion);
        }
        quizSection.appendChild(nextQuestionButton);
    
        // Back Button to allow going back to difficulty selection or category selection
        const backButton = createBackButton(() => {
            quizSection.style.display = 'none';
            displayDifficulties();
         
        });
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Torna alla difficoltà';
        backButton.className = 'back-button';
        quizSection.appendChild(backButton);
        
        quizSection.style.display = 'flex';
    }

    function nextQuestion() {
        if (tempSelectedOption === '') {
            alert('Seleziona una risposta per procedere.');
            return;
        }

        const currentQuestion = currentQuestions[currentQuestionIndex];
        userAnswers.push({ selectedOption: tempSelectedOption, correctAnswer: currentQuestion.answer, question: currentQuestion.question });
        tempSelectedOption = '';

        if (currentQuestionIndex + 1 < currentQuestions.length) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            displayResults();
        }
    }

    
    function displayResults() {
        quizSection.style.display = 'none';
        
        // Select the container for dynamic content
        const resultsContent = document.getElementById('resultsContent');
        resultsContent.innerHTML = ''; // Clear previous dynamic content
    
        let correctCount = 0;
        userAnswers.forEach(answer => {
            const isCorrect = answer.selectedOption === answer.correctAnswer;
            if (isCorrect) correctCount++;
            const resultItem = document.createElement('div');
            resultItem.innerHTML = `
                <p class="result-question"><strong>Domanda</strong>: ${answer.question}</p>
                <p class="result-answer"><strong>La tua risposta</strong>: ${answer.selectedOption} ${isCorrect ? '✅' : '❌'}</p>
                <p class="result-correct"><strong>Risposta corretta</strong>: ${answer.correctAnswer}</p>
            `;
            // Append to the dynamic content container
            resultsContent.appendChild(resultItem);
            const restartButton = document.createElement('button');

        });
    
        // Display score summary within resultsContent
        const scoreSummary = document.createElement('h2');
        scoreSummary.textContent = `Hai risposto a ${correctCount} su ${userAnswers.length} correttamente.`;
        resultsContent.insertBefore(scoreSummary, resultsContent.firstChild); // Adjust if needed
        
        // Finally, display the results section which includes the static buttons
        resultsSection.style.display = 'block';
    }   
    function restartQuiz() {
        // Reset quiz state and start over
        resultsSection.style.display = 'none';
        currentQuestionIndex = 0;
        userAnswers = [];
        prepareQuestions(); // Assumes this function resets and starts the quiz
    }
    
    function resetGame() {
        // Reset global state
        currentQuestions = [];
        userAnswers = [];
        currentQuestionIndex = 0;
        selectedCategory = '';
        selectedDifficulty = '';
        tempSelectedOption = '';
    
        // Reset UI elements
        userForm.style.display = 'block'; // Show login form
        categorySelectionSection.style.display = 'none';
        difficultySelectionSection.style.display = 'none';
        quizSection.style.display = 'none';
        resultsSection.style.display = 'none';
    
        // Optionally, reset form inputs if any
        userForm.reset();
    
        // You can also call loadQuestions here if you want to reload the questions
        // loadQuestions();
    }
    function backToLogin() {
        resetGame(); // This now not only shows the login form but also resets the game state
    }



    document.getElementById('restartQuiz').addEventListener('click', restartQuiz);
document.getElementById('changeCategory').addEventListener('click', () => {
    resultsSection.style.display = 'none';
    categorySelectionSection.style.display = 'flex';
    // Reset any necessary states if needed
});
document.getElementById('changeDifficulty').addEventListener('click', () => {
    resultsSection.style.display = 'none';
    difficultySelectionSection.style.display = 'flex';
    // Reset any necessary states if needed
});

});
