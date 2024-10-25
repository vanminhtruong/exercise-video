"use strict";
function isPerfectNumber(num) {
    if (num <= 1) {
        return false;
    }
    var sum = 1;
    for (var i = 2; i < Math.sqrt(num); i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) {
                sum += num / i;
            }
        }
    }
    return sum === num;
}
function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}
function updateDisplay() {
    var randomNum = getRandomNumber();
    var numberElement = document.getElementById("randomNumber");
    var resultElement = document.getElementById("result");
    if (numberElement && resultElement) {
        numberElement.textContent = randomNum.toString();
        resultElement.textContent = isPerfectNumber(randomNum) ? "Is number perfect" : "Is not number perfect";
    }
}
setInterval(updateDisplay, 2000);
updateDisplay();
