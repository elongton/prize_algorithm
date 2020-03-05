import {
    powerSolver,
    binaryBucketSolver,
    sum,
    addRemoveBuckets,
    distributeRemainder,
    makeBucketsMonotonic,
    smoothBuckets,
    findClosestNiceNum,
    generateIdealPayoutArray
} from './algo-library.js';


export const createPrizeDistribution = (S_initial, N, r, B, P, E) => {
    let S = S_initial.slice() //first couple buckets

    if (!(B <= N * E)) { ///make sure that B is not less than N * E, numerical solver will never converge
        /////BUCKET CREATION//////
        if (N - sum(S) === 1) {
            S[4] = 1
        } else {
            //find beta coefficient for ideal bucket sizing
            let beta = binaryBucketSolver(0.2, 1, 1000, r, N, S_initial.length)
            let c1_val;
            let c2_val;
            S = S_initial.slice()
            for (let i = S.length; i <= r; i++) {
                S[i] = beta * S[i - 1];
                c1_val = Math.pow(beta, 2) * S[i] + beta * S[i] + sum(S);
                c2_val = beta * S[i] + sum(S);
                if (c1_val > N && c2_val <= N) {
                    break;
                }
            }
            let lengthDiff = Math.abs(r - S.length);
            S = addRemoveBuckets(S, r, lengthDiff)
            S = distributeRemainder(S, N, lengthDiff)
            S = makeBucketsMonotonic(S, S_initial.length)
            S = smoothBuckets(S, N)
        }

        // console.log(S)
        // console.log('sum of S: ' + sum(S))
        // console.log('Number of entrants who win > 0: ' + N)


        /////IDEAL PAYOUT INITIALIZE//////
        let alpha = powerSolver(0.1, 0.01, 10, N, B, P, E)
        let idealPayout = generateIdealPayoutArray(alpha, N, E, P)
        let sStart, sFinish, payoutSlice, payoutAverage;
        let L = 0; //remainder
        let finalSArray = [];
        /////PRETTY PAYOUT CREATION//////
        for (let i = 1; i <= S.length; i++) {
            sStart = (i == 1) ? 0 : sum(S.slice(0, i - 1));
            sFinish = sum(S.slice(0, i));
            payoutSlice = idealPayout.slice(sStart, sFinish);
            payoutAverage = sum(payoutSlice) / payoutSlice.length;
            L = L + (payoutAverage - findClosestNiceNum(payoutAverage)) * payoutSlice.length;
            finalSArray.push({ bucket: S[i - 1], payout: findClosestNiceNum(payoutAverage) });
        }
        // console.log(L)
        // console.log(finalSArray)

        let finalSum = 0;
        finalSArray.forEach(f => {
            finalSum = finalSum + f.bucket * f.payout
        })
        // console.log(finalSum + L)


        /////FINALLY LUMP THAT REMAINDER BACK IN//////
        let replacement;
        let lCut;
        //first add to the singleton buckets
        for (let i = 1; i < S_initial.length; i++) {
            replacement = findClosestNiceNum(Math.min(finalSArray[i].payout + L, (finalSArray[i - 1].payout + finalSArray[i].payout) / 2))
            lCut = replacement - finalSArray[i].payout;
            finalSArray[i].payout = replacement;
            L = L - lCut;
        }
        //if a remainder still exists, add to the last bucket
        if (L > 0) {
            var ult, penult;
            ult = finalSArray.slice(-1)[0]; //last element
            while (L >= finalSArray.slice(-1)[0].bucket) {
                finalSArray[finalSArray.length - 1].payout++;
                L = L - finalSArray.slice(-1)[0].bucket;
                ult = finalSArray.slice(-1)[0]; //last element
                penult = finalSArray.slice(-2)[0]; //second to last element
                if (ult.payout >= penult.payout) {
                    finalSArray[finalSArray.length - 2].bucket = penult.bucket + ult.bucket;
                    finalSArray.pop();
                }

            }
            //now divide L by PI_k and add that number to the final bucket
            let finalDividedRemainder = Math.floor(L / finalSArray.slice(-1)[0].payout);
            finalSArray[finalSArray.length - 1].bucket = finalSArray[finalSArray.length - 1].bucket + finalDividedRemainder
            L = L - (finalDividedRemainder * ult.payout)
        }


        finalSum = 0;
        finalSArray.forEach(f => {
            finalSum = finalSum + f.bucket * f.payout
        })
        console.log('remainder funds: ', L)
        console.log('ideal prize pool: ', B)
        console.log('actual prize pool: ', finalSum)
        console.log(finalSArray)

        return finalSArray;


    } else {
        console.log('prize pool is less than N * E')
        return null;
    }

}


let total_entrants = 2000;
let N = Math.round(0.25 * total_entrants) //total entrants that will receive points
let r = 25; //number of buckets
let S_initial = [1, 1, 1, 2];
//////note - prize pool cannot be <= N * E//////////
let B = 2000000; //total prize pool
let P = findClosestNiceNum(B * 0.15); //first prize winnings
let E = 4; //initial amount to allocate to all users


createPrizeDistribution(S_initial, N, r, B, P, E);