function isPerfectNumber(num: number):boolean{
    if(num <= 1){
        return false;
    }

    let sum = 1;
    for(let i = 2; i< Math.sqrt(num); i++){
        if(num % i === 0){
            sum += i;
            if(i !== num / i){
                sum += num / i;
            }
        }
    }
    return sum === num;
}


function getRandomNumber() : number{
    return Math.floor(Math.random() * 100) + 1;
}


function updateDisplay() : void{
    const randomNum = getRandomNumber();
    const numberElement = document.getElementById("randomNumber") as HTMLSpanElement | null;
    const resultElement = document.getElementById("result") as HTMLSpanElement | null;

    if(numberElement && resultElement){
        numberElement.textContent = randomNum.toString();
        resultElement.textContent = isPerfectNumber(randomNum) ? "Is number perfect" : "Is not number perfect";
    }
}

setInterval(updateDisplay, 2000);

updateDisplay();