// 💰 기본 데이터
let money = 50000; 
let shieldCount = 0;
let swordLevel = 0;
let shieldPrice = 5000; // 방지권 가격은 그대로 5,000원 고정

// 📸 이미지 설정
const IMAGES = {
    swords: { 0: "bokgeom.png", 4: "bat.png", 5: "yugi.png", 6: "bansageom.png", 7: "lose.png", 8: "8th.png", 9: "smell.png", 10: "daguri.png", 11: "sams.png", 12: "highpass.png", 13: "forbidden.png" }
};

// 확률 계산식: 하드모드 (4%씩 감소)
function getSuccessRate(level) {
    let rate = 100 - (level * 4); 
    return Math.max(rate, 0.5);
}

// [핵심] 강화 단계에 따라 필요한 방지권 개수 계산
function getRequiredShields(level) {
    // 5~9강: 1개, 10~19강: 2개, 20~29강: 3개 소모
    if (level < 5) return 0;
    if (level < 10) return 1;
    if (level < 20) return 2;
    return 3;
}

function updateUI() {
    document.getElementById('money').innerText = money.toLocaleString();
    document.getElementById('shield-count').innerText = shieldCount;
    document.getElementById('level-display').innerText = "+" + swordLevel;
    document.getElementById('upgrade-cost').innerText = (500 + (swordLevel * 500)).toLocaleString();
    document.getElementById('success-rate').innerText = getSuccessRate(swordLevel).toFixed(1);
    
    // UI에 현재 레벨에서 필요한 방지권 개수 표시해주면 교수님이 더 공포를 느낄 겁니다.
    let required = getRequiredShields(swordLevel);
    document.getElementById('log-msg').innerText = required > 0 ? `(실패 시 방지권 ${required}개 소모)` : "";
}

function logMessage(msg) {
    let logEl = document.getElementById('game-log');
    logEl.innerHTML = msg + "<br>" + logEl.innerHTML;
}

function gameOver() {
    logMessage("💀 파산! 교수님의 학점 유기!");
    alert("💀 GAME OVER: 파산!");
    document.getElementById('btn-upgrade').disabled = true;
}

// 방지권 무제한 구매
function buyShield() {
    if (money >= shieldPrice) {
        money -= shieldPrice;
        shieldCount++;
        logMessage(`🛡️ 방지권 구매 (가격: ${shieldPrice}원)`);
        updateUI();
    } else {
        alert("❌ 돈이 부족합니다!");
    }
}

function upgradeSword() {
    let cost = 500 + (swordLevel * 500);
    
    // 1강 파산 규칙
    if (swordLevel === 0 && money < cost) {
        gameOver(); return;
    }
    if (money < cost) {
        alert("⚠️ 돈이 부족합니다! [검 판매]를 눌러 돈을 확보하세요.");
        return;
    }
    
    money -= cost;
    let rate = getSuccessRate(swordLevel);
    
    if (Math.random() * 100 <= rate) {
        swordLevel++;
        logMessage(`✨ 성공: +${swordLevel} (확률: ${rate.toFixed(1)}%)`);
        if (swordLevel >= 30) alert("👑 전설 달성! A+ 확정!");
    } else {
        // [핵심] 강화 단계에 따른 방지권 차감
        let required = getRequiredShields(swordLevel);
        if (shieldCount >= required && required > 0) { 
            shieldCount -= required; 
            logMessage(`🛡️ 방지권 ${required}개 사용하여 파괴 방어!`); 
        } else if (required > 0 && shieldCount < required) {
            swordLevel = 0;
            logMessage(`💥 방지권 부족! 파괴! (필요량: ${required}개)`);
        } else {
            swordLevel = 0;
            logMessage("💥 파괴!");
        }
    }
    updateUI();
}

function sellSword() {
    if (swordLevel === 0) return;
    let price = swordLevel * 1000;
    money += price;
    logMessage(`💰 ${price}원 판매 완료`);
    swordLevel = 0;
    updateUI();
}

updateUI();
