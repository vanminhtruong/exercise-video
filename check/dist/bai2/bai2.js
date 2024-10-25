"use strict";
var mang = [10, 5, 2, 5, 6, 7, 8, 9];
function isPrime(num) {
    if (num < 2)
        return false;
    for (var i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0)
            return false;
    }
    return true;
}
function calculateSum() {
    var sum = mang.reduce(function (acc, curr) { return acc + curr; }, 0);
    document.getElementById('sum').innerHTML = "T\u1ED5ng c\u00E1c s\u1ED1 trong m\u1EA3ng: ".concat(sum);
}
function findPrimes() {
    var primes = mang.filter(function (num) { return isPrime(num); });
    document.getElementById('primes').innerHTML =
        "C\u00E1c s\u1ED1 nguy\u00EAn t\u1ED1 trong m\u1EA3ng: ".concat(primes.join(', '));
}
function findDivisibleBy3() {
    var divisibleBy3 = mang.filter(function (num) { return num % 3 === 0; });
    document.getElementById('divisibleBy3').innerHTML =
        "C\u00E1c s\u1ED1 chia h\u1EBFt cho 3 trong m\u1EA3ng: ".concat(divisibleBy3.join(', '));
}
setTimeout(calculateSum, 3000);
setTimeout(findPrimes, 6000);
setTimeout(findDivisibleBy3, 9000);
