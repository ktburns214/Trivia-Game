// set up new game 
var correctAnswers = 0;
var wrongAnswers = 0;
var bestScore = 0;

var intervalID;
var timePassed = 0;

var whichQ;
var correctRef;

var hasAnswered = false;

var questions = [];
var skippedQuestions = [];

// list of trivia questions 
var questionStore = [
  {
    q:
      "The butler, Carson, had a shameful secret that was revealed by an unwelcome visitor to Downton. What was it?",
    a: [
      "He is illegitimate",
      "He has jilted a woman at the alter",
      "He has performed in music halls",
      "He has been in the workhouse"
    ],
    correct: 2
  },

  {
    q:
      "What relation was Matthew Crawley, heir to Downton Abbey, to Lady Mary, his wife?",
    a: [
      "Third cousin, once removed",
      "Second cousin",
      "Brother",
      "Fourth Cousin"
    ],
    correct: 3
  },

  {
    q:
      "Vera Bates blackmailed her husband, John, for a chunk of his inheritance by threatening to reveal what information?",
    a: [
      "His crimial record for theft",
      "He has been unfaithful",
      "A scandal of Lady Mary and Kamal Pamuk"
    ],
    correct: 2
  },

  {
    q: "The Crawleys' estate is located in what part of England?",
    a: ["Sussex", "Cornwall", "Yorkshire", "Hampshire"],
    correct: 2
  },

  {
    q: "What is Mrs. Hughes' first name?",
    a: ["Eleanor", "Laura", "Elsie", "Rose"],
    correct: 2
  },

  {
    q: "Lord Robert collects what surprisingly random item?",
    a: ["Stamps", "Coins", "Shot glasses", "Snuffboxes", "Watches"],
    correct: 3
  },

  {
    q: "What was the name of the housemaid who wanted to be a secretary?",
    a: ["Daisy", "Gwen", "Ethel", "Meg"],
    correct: 1
  },

  {
    q: "Lady Rose's parents live in an estate in Scotland. What is it called?",
    a: [
      "Duneagle Castle",
      "Inveraray Castle",
      "Eilean Donan Castle",
      "Craigievar Castle"
    ],
    correct: 0
  },

  {
    q:
      "What was the name of Lord Robert’s previous valet who is replaced by Mr. Bates?",
    a: ["Watson", "Smith", "Holmes", "Williams"],
    correct: 0
  },

  {
    q:
      "The former prince from who tries to rekindle an old romance with the Dowager Countess is from Germany",
    a: ["True", "False"],
    correct: 1
  }
];

// timer 
function qTime() {
  timePassed++;
  $(".time-passed").css("width", timePassed);
  if (timePassed === 200) {
    timePassed = 0;
    clearInterval(intervalId);
    message("slow");
  }
}

function pauseTime() {
  timePassed++;
  if (timePassed === 3) {
    timePassed = 0;
    clearInterval(intervalId);
    if (questions.length > 0) {
      nextQuestion(questions);
    } else if (skippedQuestions.length > 0) {
      nextQuestion(skippedQuestions);
    } else {
      checkWin();
    }
  }
}

// message for question results 
function message(message) {
  $(".question-area").empty();
  $(".results").empty();
  intervalId = setInterval(pauseTime, 1000);

  if (message === "correct") {
    $(".question-area").text("Correct");
    correctAnswers++;
  } else if (message === "slow") {
    $(".question-area").text("Too Slow!");
    wrongAnswers++;
  } else {
    $(".question-area").text("Incorrect");
    wrongAnswers++;
  }

  $(".results").text("Correct: " + correctAnswers);
  $(".results").append("<p>Wrong: " + wrongAnswers + "</p>");

  if (questions.length > 0) {
    questions.splice(whichQ, 1);
  } else {
    skippedQuestions.splice(whichQ, 1);
  }
}

// next question
function nextQuestion(remaining) {
  $(".question-area").empty();
  $(".answer-table").empty();
  hasAnswered = false;
  if (remaining.length > 0) {
    intervalId = setInterval(qTime, 50);

    whichQ = Math.floor(Math.random() * remaining.length);
    correctRef = remaining[whichQ].correct;

    var questionQuestion = $("<p>");
    questionQuestion.addClass("question-question");
    questionQuestion.append(remaining[whichQ].q);
    $(".question-area").append(questionQuestion);

    for (var i = 0; i < remaining[whichQ].a.length; i++) {
      var idvAnswer = $("<li>");
      idvAnswer.attr("value", i);
      idvAnswer.addClass("answer answer-" + i);
      idvAnswer.append(remaining[whichQ].a[i]);
      $(".answer-table").append(idvAnswer);
    }

    if (questions.length > 0) {
      var skipButton = $("<li>");
      skipButton.addClass("skip-bo");
      skipButton.text("Skip");
      $(".answer-table").append(skipButton);
    } else {
      var toldYaSo = $("<p>");
      toldYaSo.addClass("neener");
      toldYaSo.text("Oh all this endless thinking.  It's very overrated.");
      $(".answer-table").append(toldYaSo);
    }
  }
}

// reset game 
function gameReset() {
  $(".results").empty();
  questions = [];
  skippedQuestions = [];
  for (var i = 0; i < questionStore.length; i++) {
    questions.push(questionStore[i]);
  }
  wrongAnswers = 0;
  correctAnswers = 0;

  $(".timer").show();
  nextQuestion(questions);
}

// high score calculator 
function checkWin() {
  if (bestScore < correctAnswers) {
    bestScore = correctAnswers;
    $(".results").text(
      "You got a new high score of " +
        bestScore +
        "!  I wonder your halo doesn’t grow heavy. It must be like wearing a tiara around the clock."
    );
  } else {
    $(".results").text(
      "All life is a series of problems that we must try and solve.  You got " +
        correctAnswers +
        " correct.  But there is still room for improvement if you want to beat the high score of " +
        bestScore +
        "."
    );
  }
  $(".question-area").empty();
  $(".answer-table").empty();
  var nextGame = $("<div>");
  nextGame.addClass("next-game");
  var nextText = $("<h2>");
  nextText.addClass("next-text");
  nextText.text("Click to Play Again");
  nextGame.append(nextText);
  $(".question-area").append(nextGame);
  $(".next-game").on("click", gameReset);
}

$(document).on("click", ".answer", function() {
  if (hasAnswered === false) {
    clearInterval(intervalId);
    timePassed = 0;
    var answerRef = $(this).attr("value");
    $(this).css("list-style-type", "disc");

// selected choice changes color if correct or incorrect
    if (questions.length > 0) {
      for (var i = 0; i < questions[whichQ].a.length; i++) {
        $(".answer-" + i).css("color", "#f00");
      }
      $(".answer-" + correctRef).css("color", "#23DD2C");
    } else {
      for (var i = 0; i < skippedQuestions[whichQ].a.length; i++) {
        $(".answer-" + i).css("color", "#f00");
      }
      $(".answer-" + correctRef).css("color", "#23DD2C");
    }

    if (correctRef == answerRef) {
      message("correct");
    } else {
      message("wrong");
    }
    hasAnswered = true;
  }
});

// skip question
$(document).on("click", ".skip-bo", function() {
  if (hasAnswered === false) {
    clearInterval(intervalId);
    timePassed = 0;
    intervalId = setInterval(pauseTime, 1000);
    $(".question-area").empty();
    $(".answer-table").empty();
    $(".question-area").text(
      "Don’t be defeatist, dear, it’s very middle class."
    );

    skippedQuestions.push(questions[whichQ]);
    questions.splice(whichQ, 1);

    hasAnswered = true;
  }
});

$(".timer").hide();
$(".play-game").on("click", gameReset);
