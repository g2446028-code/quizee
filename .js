// --- 1. クイズデータ（CSVを使う場合はこの部分を置き換えます） ---
const quizData = [
    {
        question: "日本で一番高い山は何ですか？",
        options: ["富士山", "北岳", "奥穂高岳", "槍ヶ岳"],
        answer: "富士山"
    },
    {
        question: "日本の首都はどこですか？",
        options: ["大阪", "京都", "東京", "名古屋"],
        answer: "東京"
    },
    {
        question: "光の速さは秒速およそ何kmですか？",
        options: ["30万km", "15万km", "100万km", "1万km"],
        answer: "30万km"
    }
    // ここに問題を追加していきます
];
const TOTAL_QUESTIONS = quizData.length;

// --- 2. 状態管理変数 ---
let currentQuestionIndex = 0;
let score = 0;
let lives = 3;
let canClick = true; // 連続クリックを防ぐためのフラグ

// --- 3. HTML要素の取得 ---
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const scoreDisplay = document.getElementById('score-display');
const questionCount = document.getElementById('question-count');
const livesDisplay = document.getElementById('lives-display');
const resultMessage = document.getElementById('result-message');
const nextButton = document.getElementById('next-button');

// --- 4. ライフ表示の更新 ---
function updateLivesDisplay() {
    livesDisplay.innerHTML = ''; // 一旦ハートをクリア
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.textContent = '❤️';
        if (i >= lives) {
            // 残機がないハートは灰色にするなどの処理も可能
            heart.style.opacity = 0.3; 
        }
        livesDisplay.appendChild(heart);
    }
}

// --- 5. 問題を表示する ---
function displayQuestion() {
    // 最終問題が終了したら
    if (currentQuestionIndex >= TOTAL_QUESTIONS) {
        endQuiz();
        return;
    }
    
    // 初期状態に戻す
    canClick = true;
    resultMessage.classList.add('hidden');
    nextButton.classList.add('hidden');
    optionsList.innerHTML = '';
    
    const currentQuiz = quizData[currentQuestionIndex];
    
    // 問題文とカウントを更新
    questionText.textContent = currentQuiz.question;
    scoreDisplay.textContent = `🏆 スコア: ${score}`;
    questionCount.textContent = `問題 ${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}`;

    // 選択肢を生成
    currentQuiz.options.forEach(optionText => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = optionText;
        button.className = 'option-button';
        
        // クリックイベントを設定
        button.addEventListener('click', () => checkAnswer(button, optionText, currentQuiz.answer));
        
        li.appendChild(button);
        optionsList.appendChild(li);
    });
}

// --- 6. 解答をチェックする ---
function checkAnswer(button, selectedOption, correctAnswer) {
    if (!canClick) return; // 連続クリックを無視
    canClick = false;
    
    // 全てのボタンをクリック不可にする
    document.querySelectorAll('.option-button').forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        // 正解処理
        score += 10;
        button.classList.add('correct');
        resultMessage.textContent = '⭕ 正解！';
        resultMessage.style.color = '#28a745';
        scoreDisplay.textContent = `🏆 スコア: ${score}`;
    } else {
        // 不正解処理
        lives -= 1;
        button.classList.add('incorrect');
        resultMessage.textContent = `❌ 不正解... 正解は「${correctAnswer}」でした。`;
        resultMessage.style.color = '#dc3545';
        
        // 正解のボタンをハイライト
        document.querySelectorAll('.option-button').forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        });
        updateLivesDisplay();
    }
    
    resultMessage.classList.remove('hidden');
    
    // ライフが残っているかチェック
    if (lives > 0 && currentQuestionIndex < TOTAL_QUESTIONS - 1) {
        nextButton.textContent = "次の問題へ";
        nextButton.classList.remove('hidden');
        nextButton.onclick = moveToNextQuestion;
    } else {
        // 最終問題の解答後、または残機が0になったとき
        nextButton.textContent = "結果を見る";
        nextButton.classList.remove('hidden');
        nextButton.onclick = endQuiz;
    }
}

// --- 7. 次の問題へ移動する ---
function moveToNextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

// --- 8. クイズを終了する ---
function endQuiz() {
    optionsList.innerHTML = '';
    nextButton.classList.add('hidden');
    
    if (lives <= 0) {
        questionText.textContent = 'ゲームオーバー...';
        resultMessage.textContent = `残念！あなたの最終スコアは ${score} 点です。`;
    } else {
        questionText.textContent = '全問終了！';
        resultMessage.textContent = `お疲れ様でした！あなたの最終スコアは ${score} 点です。`;
    }
    resultMessage.style.color = '#333';
    resultMessage.classList.remove('hidden');
    questionCount.textContent = `終了`;

    // リスタートボタンの追加
    const restartButton = document.createElement('button');
    restartButton.textContent = 'もう一度プレイする';
    restartButton.className = 'next-button';
    restartButton.style.marginTop = '40px';
    restartButton.onclick = () => window.location.reload(); // ページをリロードして最初から
    optionsList.appendChild(restartButton);
}

// --- 9. 初期化処理 ---
// アプリがロードされたら、最初の問題を表示する
document.addEventListener('DOMContentLoaded', () => {
    updateLivesDisplay();
    displayQuestion();
});