const mang: number[] = [10, 5, 2, 5, 6, 7, 8, 9];

function isPrime(num: number): boolean {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function calculateSum(): void {
    const sum = mang.reduce((acc, curr) => acc + curr, 0);
    document.getElementById('sum')!.innerHTML = `Tổng các số trong mảng: ${sum}`;
}

function findPrimes(): void {
    const primes = mang.filter(num => isPrime(num));
    document.getElementById('primes')!.innerHTML = 
        `Các số nguyên tố trong mảng: ${primes.join(', ')}`;
}

function findDivisibleBy3(): void {
    const divisibleBy3 = mang.filter(num => num % 3 === 0);
    document.getElementById('divisibleBy3')!.innerHTML = 
        `Các số chia hết cho 3 trong mảng: ${divisibleBy3.join(', ')}`;
}

setTimeout(calculateSum, 3000);
setTimeout(findPrimes, 6000);
setTimeout(findDivisibleBy3, 9000);
