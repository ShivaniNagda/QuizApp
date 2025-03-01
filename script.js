const button = document.getElementById("startQuiz");
const loading = document.getElementById("loading");
const questionParentContainer = document.getElementById(
  "question-parent-container"
);
const answerContainer = document.getElementById("answers");
const question = document.getElementById("question");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const retryButton = document.getElementById("retry-button");
let nextButtonContainer = document.getElementById("next-button-container")
let timeDisplay = document.getElementById("timer")
let startQuiz = document.getElementById("startQuiz")


let li;
  let questionNumber=0;
  let index = 0;
  let score = 0;
  let time = 60;
  let interval;
// --------------------------------------------------------
async function fetchDataFromApi() {
  try {
    let res = await fetch("https://opentdb.com/api.php?amount=10");
    let data = await res.json();
    let allQuestions = data.results;
    return allQuestions;
  } catch (err) {
    console.log("Something Went Wrong........");
    somewentWrong();
  }
}
// -----------------------------------------------------------
function somewentWrong(){
    loading.innerText="Something Went Wrong........";
}
// -----------------------------------------------------------
let allQuestions = [];
function start(){
   questionNumber=0;
   index = 0;
   score = 0;
   timer();
    startQuiz.style.display='none';
    loading.style.display = "block";
    let interval = setTimeout(() => {
     let data = fetchDataFromApi();
    data.then((questions) => {
    console.log("Inside getQuestions", questions,data);
    allQuestions = questions;
    displayQuestion(allQuestions);
  
}, 1000);
});

}

// --------------------------------------------------------
function shuffleAnswers(answers) {
    nextButton.style.display='block';
    prevButton.style.display='block';
    return answers.sort(() => Math.random() - 0.5);
  }


//   --------------------------------------------------
  
   function displayQuestion(allQuestions) {
    console.log("After Next - Index",  index);
    questionParentContainer.style.display = "block";
    loading.style.display = "none";
   
    questionNumber = index+1;
    question.innerText =" Q. " + questionNumber + "  " + allQuestions[index].question;
    let answers = allQuestions[index].incorrect_answers;
    answers.push(allQuestions[index].correct_answer);
    let shuffledAnswers = shuffleAnswers(answers);
    console.log(shuffledAnswers);
    answerContainer.innerHTML = "";
       shuffledAnswers.map((answer) => {
        li = document.createElement("button");
        li.classList.add("answer");
        li.innerText = answer;
        answerContainer.appendChild(li);
        li.addEventListener("click", checkAnswer);
        
    });
  }
//   ------------------------------------------------------------

   function checkAnswer(e) {
    e.preventDefault();
    if (e.target.innerText === allQuestions[index].correct_answer) {
      e.target.classList.remove("answer");
      e.target.classList.add("correct");
      e.target.classList.add("disable");
      score+=10;
      console.log("Correct Answer");
    }else {
      e.target.classList.remove("answer");
      e.target.classList.add("incorrect");
      e.target.classList.add("disable");
        console.log("Incorrect Answer");
      loading.style.display = "block";
      loading.style.backgroundColor = "#262d47";
      loading.style.color = "white";
      loading.innerHTML = `<div>Correct Answer is ${allQuestions[index].correct_answer}</div>`;
    }
    nextButton.addEventListener("click",nextQuestion)  
    prevButton.addEventListener("click",prevQuestion)  
  }
 function nextQuestion(){
    index++;
    if (index < allQuestions.length - 1) {
      console.log("After Next Index", index);
      displayQuestion(allQuestions);
    } else {
      console.log("Game Over");
      questionParentContainer.style.display = "none";
      loading.style.display = "block";
      loading.innerHTML = `Game Over. Your Score is ${score} `;
      nextButton.style.display='none';
      prevButton.style.display='none';
      retryButton.style.display='block';
      retryButton.addEventListener("click",retry);
    }
}
 function prevQuestion(){
    index--;
    if (index >= 0) {
      console.log("After Next Index", index);
      displayQuestion(allQuestions);
    } 
    
}
function timer(){
     time = 60;
     interval = setInterval(function(){
        time--;
        timeDisplay.textContent = time < 10 ? `0${time}` : time; 
        
        if(time === 0){
            clearInterval(interval);
            questionParentContainer.style.display = "none";
            loading.style.display = "block";
            loading.style.color = "red";
            loading.innerHTML = `Oops ! Time Up .. Game is Over. Your Score is ${score} `;
            nextButton.style.display='none';
            prevButton.style.display='none';
            retryButton.style.display='block';
            retryButton.addEventListener("click",retry);
           
        }},1000)
}
function retry(){
    time=0;
    nextButton.style.display='none';
    prevButton.style.display='none';
    timeDisplay.textContent = `0${time}`;
    clearInterval(interval);
    retryButton.style.display='none';
    nextButtonContainer.removeChild(retryButton);
    start();
}
startQuiz.addEventListener("click",start)