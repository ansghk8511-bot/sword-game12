// 상태 변수
let money = 50000;
let shieldCount = 0;
let swordLevel = 0;

// 1. 강화 확률 계산 함수 (3강부터 레벨당 3.5%씩 감소)
function getSuccessRate(level) {
    if (level < 3) return 100;
    return Math.max(100 - ((level - 2) * 3.5), 1.0);
}

// 2. 강화 비용 계산 함수
function getUpgradeCost() {
    return 500 + (swordLevel * 300);
}

// 3. UI 업데이트 함수
function updateUI() {
    document.getElementById('money').innerText = money.toLocaleString();
    document.getElementById('shield-count').innerText = shieldCount;
    document.getElementById('level-display').innerText = "+" + swordLevel;
    document.getElementById('upgrade-cost').innerText = getUpgradeCost().toLocaleString();
    document.getElementById('sell-price').innerText = (swordLevel * 1000).toLocaleString();
    
    // 성공 확률 업데이트
    const rate = getSuccessRate(swordLevel);
    document.getElementById('success-rate').innerText = rate.toFixed(1);
    
    // 검 이름 업데이트 (선택 사항)
    document.getElementById('sword-display').innerText = swordLevel >= 30 ? "전설의 검" : "강화 중인 검";
}

// 4. 로그 메시지 출력
function logMessage(msg) {
    const logEl = document.getElementById('game-log');
    logEl.innerHTML = msg + "<br>" + logEl.innerHTML;
}

// 5. 강화 로직
function upgradeSword() {
    let cost = getUpgradeCost();
    
    // 파산 규칙
    if (swordLevel === 0 && money < cost) {
        logMessage("❌ 자금 부족으로 1강 도전 불가 - 탈락!");
        gameOver();
        return;
    }
    
    if (money < cost) {
        logMessage("❌ 돈이 부족합니다!");
        return;
    }
    
    money -= cost;
    let rate = getSuccessRate(swordLevel);
    
    if (Math.random() * 100 <= rate) {
        swordLevel++;
        logMessage(`✨ 성공: +${swordLevel} (확률: ${rate.toFixed(1)}%)`);
        if (swordLevel >= 30) gameClear();
    } else {
        logMessage("💥 강화 실패!");
        // 여기서 실패 시 로직 추가 (예: 파괴 또는 방지권 소모)
        swordLevel = 0; 
    }
    
    updateUI();
}

// 6. 상점 및 판매 로직
function buyShield() {
    if (money >= 3000) {
        money -= 3000;
        shieldCount++;
        logMessage("🛡️ 방지권 구매 완료!");
        updateUI();
    } else {
        alert("돈이 부족합니다!");
    }
}

function sellSword() {
    if (swordLevel === 0) return;
    let price = swordLevel * 1000;
    money += price;
    logMessage(`💰 판매: +${price.toLocaleString()}원`);
    swordLevel = 0;
    updateUI();
}

// 7. 게임 오버 및 클리어
function gameOver() {
    logMessage("💀 GAME OVER: 파산했습니다!");
    alert("💀 파산! 게임을 더 이상 진행할 수 없습니다.");
    document.getElementById('btn-upgrade').disabled = true;
}

function gameClear() {
    logMessage("🏆 GAME CLEAR: 전설 달성!");
    alert("🎉 축하합니다! 30강에 도달하여 게임을 클리어했습니다!");
    document.getElementById('btn-upgrade').disabled = true;
}

// 초기화
updateUI();
