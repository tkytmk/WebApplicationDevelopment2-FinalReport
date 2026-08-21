'use strict';

/*
===================================================================================================


変数・定数・関数定義


===================================================================================================
*/

const display_credit = document.getElementById('display_credit');
const display_name = document.getElementById('display_name');
const display_comment = document.getElementById('display_comment');
const display_gameCount = document.getElementById('display_gameCount');

const lilleLeft = document.getElementById('lilleLeft');
const lilleMiddle = document.getElementById('lilleMiddle');
const lilleRight = document.getElementById('lilleRight');

let randomNumber; // 乱数格納用変数
let currentMode; // 現在のモード
let remainCount; // 残りゲームカウント

let credit = 0;
let isHit = false;
let rotationCount = 0;
let hitCount = 0;
let variables = {};

/// リール関連
let resultDigit = generateDigits(); // 結果確定で出てきた数字を入れる変数 ランダムな値で初期化
let lilleRotation = [false, false, false]; // 各リールが回っているか否か
let displayLille = resultDigit; // 実際に表示されるリールの数字

// アタリ出目リスト
const digitList = {
    zero: [[0, 0, 0]],
    seven: [[7, 7, 7]],
    odd: [[1, 1, 1], [3, 3, 3], [5, 5, 5], [9, 9, 9]],
    even: [[2, 2, 2], [4, 4, 4], [6, 6, 6], [8, 8, 8]],
}

/**　リザルト設定用ファクトリ関数
 * 
 * @param {string} resultName 
 * @param {number} probability 
 * @param {() => void} hitAction 
 * @param {digitList} digit
 * @returns 
 */
const result = (resultName, probability, hitAction, digit) => ({
    resultName,
    probability,
    hitAction,
    digit,
});

// ゾロ目ではないランダムな図柄を生成
function generateDigits() {
    let digits;

    do {
        digits = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ];
    } while (digits[0] === digits[1] && digits[1] === digits[2]);

    return digits;
}

// リール描画
function displayDigit(digits) {
    lilleLeft.innerText = digits[0];
    lilleMiddle.innerText = digits[1];
    lilleRight.innerText = digits[2];
}


function change(mode) {
    currentMode = mode;
    remainCount = mode.gameCount;
}

/*
===================================================================================================


モード定義


===================================================================================================
*/

const normal = {
    name: "通常",
    comment: "奇数ゾロ目が当たると確変！",
    gameCount: Infinity,
    gameCountOver: () => { console.log("gameCountOver"); },
    results: [
        {
            resultName: "special",
            probability: 0.005,
            hitAction: () => { console.log("special"); change(specialChance); credit += 20; },
            digit: digitList.zero,
        },
        {
            resultName: "big",
            probability: 0.01,
            hitAction: () => { console.log("big"); change(bigChance); credit += 15; },
            digit: digitList.seven,
        },
        result("regular", 0.05, () => { console.log("reguler"); change(regularChance); credit += 10; }, digitList.odd),
        result("small", 0.1, () => { console.log("small"); credit += 5; }, digitList.even),
    ],
    variables: {

    },
    notHit() {
        console.log("noHit");
    }
}

const reentry = {
    name: "引き戻し",
    comment: "奇数ゾロ目が出やすい！",
    gameCount: 15,
    gameCountOver: () => { change(normal); },
    results: [
        result("special", 0.01, () => { console.log("special"); change(specialChance); credit += 20; }, digitList.zero),
        result("big", 0.05, () => { console.log("big"); change(bigChance); credit += 15; }, digitList.seven),
        result("regular", 0.1, () => { console.log("reguler"); change(regularChance); credit += 10; }, digitList.odd),
        result("small", 0.1, () => { console.log("small"); credit += 5; }, digitList.even),
    ],
    variables: {

    },
    notHit() {
        console.log("noHit");
    }
}

const regularChance = {
    name: "確変",
    comment: "偶数ゾロ目が出やすい！",
    gameCount: 20,
    gameCountOver: () => { change(reentry); },
    results: [
        result("special", 0.005, () => { console.log("special"); change(specialChance); credit += 20; }, digitList.zero),
        result("big", 0.01, () => { console.log("big"); credit += 15; }, digitList.seven),
        result("regular", 0.05, () => { console.log("regular"); credit += 10; }, digitList.odd),
        result("small", 0.4, () => { console.log("small"); credit += 5; }, digitList.even),
    ],
    variables: {

    },
    notHit() {
        console.log("noHit");
    }
}

const bigChance = {
    name: "超確変",
    comment: "偶数ゾロ目がもっと出やすい！",
    gameCount: 30,
    gameCountOver: () => { change(reentry); },
    results: [
        result("special", 0.005, () => { console.log("special"); change(specialChance); credit += 20; }, digitList.zero),
        result("big", 0.01, () => { console.log("big"); credit += 15; }, digitList.seven),
        result("regular", 0.05, () => { console.log("regular"); credit += 10; }, digitList.odd),
        result("small", 0.6, () => { console.log("small"); credit += 5; }, digitList.even),
    ],
    variables: {

    },
    notHit() {
        console.log("noHit");
    }
}

const specialChance = {
    name: "チャンス",
    comment: "もう1度000を出せ！",
    gameCount: 10,
    gameCountOver: () => { change(reentry); },
    results: [
        result("special", 0.1, () => { console.log("special"); change(specialBonus); credit += 20; }, digitList.zero),
        result("small", 0.6, () => { console.log("small"); credit += 5; }, digitList.even),
    ],
    variables: {

    },
    notHit() {
        console.log("noHit");
    }
}

const specialBonus = {
    name: "スペシャル",
    comment: "奇数ゾロ目が当たると残りゲーム数+10回！",
    gameCount: 30,
    gameCountOver: () => { change(reentry); },
    results: [
        result("big", 0.05, () => { console.log("big"); remainCount += 50; credit += 15; }, digitList.seven),
        result("regular", 0.1, () => { console.log("regular"); remainCount += 10; credit += 10; }, digitList.odd),
        result("small", 0.6, () => { console.log("small"); credit += 5; }, digitList.even),
    ],
    variables: {

    },
    notHit() {
        console.log("noHit");
    }
}

/*
===================================================================================================


処理部分


===================================================================================================
*/

currentMode = normal;
remainCount = currentMode.gameCount;

display_credit.innerText = `残りクレジット：${credit}`;
display_name.innerText = `現在のモード：${currentMode.name}`
display_comment.innerText = currentMode.comment;
display_gameCount.innerText = ``;

//画面更新
setInterval(() => {
    randomNumber = Math.random();

    for (let i = 0; i < lilleRotation.length; i++) {
        if (lilleRotation[i]) {
            displayLille[i] = Math.floor(Math.random() * 10);
        } else {
            displayLille[i] = resultDigit[i]
        }

    }

    displayDigit(displayLille);

    if (lilleRotation.every(x => x === false)) {
        display_credit.innerText = `残りクレジット：${credit}`;
    }

}, 1);

// キー入力検知
document.addEventListener('keydown', (event) => {

    if (event.key === ' ' && lilleRotation.every(x => x === false)) {
        console.log(randomNumber);

        remainCount--;
        credit--;
        isHit = false;

        display_credit.innerText = `残りクレジット：${credit}`;
        display_name.innerText = `現在のモード：${currentMode.name}`;
        display_comment.innerText = currentMode.comment;

        if (currentMode.name === "通常") {
            display_gameCount.innerText = ``;
        } else {
            display_gameCount.innerText = `残り回数：${remainCount}`;
        }

        let probability = 0;
        resultDigit = [];

        lilleRotation.fill(true);

        for (const result of currentMode.results) {
            probability += result.probability;

            if (randomNumber < probability) {

                resultDigit = result.digit[Math.floor(Math.random() * result.digit.length)]
                result.hitAction();
                console.log(resultDigit);
                isHit = true;
                break;
            }
        }

        if (!isHit) {
            currentMode.notHit();
            resultDigit = generateDigits();
            console.log(resultDigit);
            displayDigit(resultDigit);
        }

        if (remainCount === 0) {
            currentMode.gameCountOver()
        }
    }

    // if (event.key === 'Enter') {
    //     console.log(currentMode)
    //     console.log(remainCount)
    // }

    if (event.key === 'v') {
        //console.log("v");
        lilleRotation[0] = false;
    }
    if (event.key === 'b') {
        //console.log("b");
        lilleRotation[1] = false;
    }
    if (event.key === 'n') {
        //console.log("n");
        lilleRotation[2] = false;
    }

    // if (event.key === 'a') {
    //     lilleRotation.fill(false);
    // }
});