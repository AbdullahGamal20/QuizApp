// selectors
let countSpan = document.querySelector(".count span");
let spansContainer = document.querySelector(".spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countdownDiv = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  fetch("questions.json")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((result) => {
      let qCount = result.length;

      createBullets(qCount);

      addQuestionsData(result[currentIndex], qCount);

      countDown(10, qCount);

      // click on btn
      submitBtn.onclick = () => {
        let rightAnswer = result[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(rightAnswer, qCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        addQuestionsData(result[currentIndex], qCount);

        // handle active Class
        handleBullets();

        clearInterval(countdownInterval);
        countDown(10, qCount);

        showResults(qCount);
      };
    });
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    // check if this is first Question
    if (i === 0) {
      theBullet.classList.add("active");
    }
    spansContainer.appendChild(theBullet);
  }
}

function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    // craete heading
    let heading = document.createElement("h2");
    heading.appendChild(document.createTextNode(obj.title + " ?"));
    quizArea.appendChild(heading);

    // create answers
    for (let i = 0; i < 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i + 1}`;
      radioInput.dataset.answer = obj[`answer_${i + 1}`];

      if (i === 0) {
        radioInput.checked = true;
      }

      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i + 1}`;
      theLabel.appendChild(document.createTextNode(obj[`answer_${i + 1}`]));

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === choosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".spans span");
  let arrOfSpans = Array.from(bulletsSpans);

  arrOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add("active");
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitBtn.remove();
    spansContainer.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good"> Good </span> : You Got ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect"> Perfect </span> : All Answers Is Correct`;
    } else {
      theResults = `<span class="bad"> Bad </span> : You Got ${rightAnswers} From ${count} `;
    }

    results.innerHTML = theResults;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;

    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      countdownDiv.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
