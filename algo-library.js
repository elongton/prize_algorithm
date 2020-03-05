

export const sum = (array) => {
    return array.reduce((a, b) => { return a + b })
}
export const sumby2 = (array) => {
    var sum = 0;
    array.forEach((val) => {
        sum = sum + val / 2
    })
    return sum;
}

const bucketPoly = (beta, r, n, t_length) => {
    let betaSum = 0
    for (let i = 1; i <= r - t_length; i++) {
        betaSum = betaSum + Math.pow(beta, i);
    }
    return (betaSum - (n - t_length))
}

const power = (alpha, n, b, p, e) => {
    let powerSum = 0
    for (let i = 1; i <= n; i++) {
        powerSum = powerSum + (p - e) / Math.pow(i, alpha)
        // console.log(powerSum)
    }
    return (powerSum - (b - n * e))
}


export const binaryBucketSolver = (condition, low, high, r, n, t_length) => {
    let mid = (high / low) / 2;

    while (Math.abs(bucketPoly(mid, r, n, t_length)) > condition) { //0.2
        if (bucketPoly(mid, r, n, t_length) * bucketPoly(high, r, n, t_length) > 0) {
            low = low;
            high = mid;
        } else {
            low = mid;
            high = high;
        }
        mid = (high + low) / 2;
        // console.log('mid: ' + mid, 'bucketPoly: ' + bucketPoly(mid, r, n, t_length))
    }
    return mid
}


export const powerSolver = (condition, low, high, n, b, p, e) => {
    let mid = (high / low) / 2;

    while (Math.abs(power(mid, n, b, p, e)) > condition) { //0.1
        // for (let i = 0; i < 100; i++) {
        if (power(mid, n, b, p, e) * power(high, n, b, p, e) > 0) {
            low = low;
            high = mid;
        } else {
            low = mid;
            high = high;
        }
        mid = (high + low) / 2;
        // console.log('mid: ' + mid, 'power: ' + power(mid, n, b, p, e))
    }
    return mid
}

////////////////////////////////
///////NICE NUMBERS DEF ////////
////////////////////////////////

export const findClosestNiceNum = (n) => {
    if (n >= 10 && n < 100) {
        return 5 * Math.floor(n / 5);
    } else if (n >= 100 && n < 250) {
        return 25 * Math.floor(n / 25);
    } else if (n >= 250 && n < 1000) {
        return 50 * Math.floor(n / 50);
    } else if (n >= 1000 && n < 2500) {
        return 250 * Math.floor(n / 250)
    } else if (n >= 2500 && n < 10000) {
        return 500 * Math.floor(n / 500);
    } else if (n >= 10000) {
        return 1000 * Math.floor(n / 1000)
    } else {
        return n;
    }
}


////////////////////////
////IDEAL PAYOUT ///////
////////////////////////
export const generateIdealPayoutArray = (alpha, N, E, P) => {
    let idealPayout = [];
    for (let i = 1; i <= N; i++) {
        idealPayout.push(E + (P - E) / Math.pow(i, alpha))
    }
    // console.log(sum(idealPayout))
    return idealPayout
}

////////////////////////
////BUCKET SIZING///////
////////////////////////

export const addRemoveBuckets = (S, r, lengthDiff) => {
    if (S.length < r) {
        // console.log('S.length < r: ', lengthDiff)
        for (let i = 0; i < lengthDiff; i++) {
            S.push(0);
        }
    }
    return S
}

export const distributeRemainder = (S, N, lengthDiff) => {
    let initialSum = sum(S);
    if (initialSum < N) {
        let sumDiff = N - initialSum;
        if (lengthDiff > 0) {
            // console.log('lengthdiff is > 0')
            sumDiff = sumDiff / lengthDiff;
            for (let i = 1; i <= lengthDiff; i++) {
                S[S.length - i] = sumDiff;
            }
        }
    }
    return S
}


export const makeBucketsMonotonic = (S, t) => {
    const shiftBins = (S, t) => {
        for (let i = t + 1; i < S.length; i++) {
            if (S[i] <= S[i - 1]) {
                S[i - 1] = S[i - 1] - 1;
                S[i] = S[i] + 1;
                shiftBins(S, t);
            }
        }
        return S
    }
    return shiftBins(S, t);
}


export const smoothBuckets = (S, N) => {
    S = S.map(b => { return Math.round(b) })
    let sumDiff = sum(S) - N;
    if (sumDiff > 0) S[S.length - 2] = S[S.length - 2] - sumDiff;  //if the difference is positive, subtract from penultimate
    else S[S.length - 1] = S[S.length - 1] - sumDiff; //if the difference is negative, subtract from last
    // console.log(sumDiff)
    return S;
}