// 💰 기본 데이터
let money = 50000; 
let shieldCount = 0;
let swordLevel = 0;
const SHIELD_PRICE = 3000;

// 📸 이미지 설정
const IMAGES = {
    swords: {
        0: "bokgeom.png", 4: "bat.png", 5: "yugi.png", 
        6: "bansageom.png", 7: "lose.png", 8: "8th.png", 
        9: "smell.png", 10: "daguri.png", 11: "sams.png", 
        12: "highpass.png", 13: "forbidden.png"
    }
};

const swordNames = [
    "연습용 목검", "다듬어진 목검", "녹슨 철검", "강철 롱소드", "대가리 뚝배기 파괴검",
    "수행평가 유기검", "엄마 잔소리 반사검", "롤 연패 유발검", "롤토체스 8등 확정검",
    "앞자리 정수리 냄새검", "다구리 검", "개노답 삼형제검", "급식실 1등 하이패스검",
    "타반 출입 (긴장감 100%)", "1-1", "1-2", "1-3", "1-4", "1-5", 
    "2-1", "2-2", "2-3", "2-4", "2-5", "3-1", "3-2", "3-3", "3-4", "3-5", 
    "교장실 (긴급 호출)", "👑 교무실 뒷편 (최종 전설) 👑"
];

// 판매 가격 계산식
function calculateSellPrice(level) {
    if (level === 0) return 0;
    let currentUpgradeCost = 500 + ((level - 1) * 300);
    let sellPrice = (level <= 4) ? (currentUpgradeCost * 0.7) : (currentUpgradeCost * 1.5 + (Math.pow(level, 2) * 200));
    if (level >= 7) sellPrice += Math.pow(level - 6, 2.5) * 2500;
    return Math.floor(sellPrice);
}

// 확률 계산식: 1강마다 2.5%씩 감소
function getSuccessRate(level) {
    let rate = 100 - (level * 2.5);
    return Math.max(rate, 1);
}

function updateUI() {
    document.getElementById('money').innerText = money.toLocaleString();
    document.getElementById('shield-count').innerText = shieldCount;
    document.getElementById('level-display').innerText = "+" + swordLevel;
    document.getElementById('sword-display').innerText = swordNames[Math.min(swordLevel, swordNames.length - 1)];
    
    let rate = getSuccessRate(swordLevel);
    document.getElementById('success-rate').innerText = rate.toFixed(1);
    document.getElementById('upgrade-cost').innerText = (500 + (swordLevel * 300)).toLocaleString();
    document.getElementById('sell-price').innerText = calculateSellPrice(swordLevel).toLocaleString();

    let img = "bokgeom.png";
    for (let i = swordLevel; i >= 0; i--) {
        if (IMAGES.swords[i]) { img = IMAGES.swords[i]; break; }
    }
    document.getElementById('sword-img').src = img;
}

function logMessage(msg) {
    let logEl = document.getElementById('game-log');
    logEl.innerHTML = msg + "<br>" + logEl.innerHTML;
}

// 💀 파산 처리
function gameOver() {
    logMessage("💀 GAME OVER: 파산했습니다!");
    alert("💀 파산! 게임을 더 이상 진행할 수 없습니다.");
    document.getElementById('btn-upgrade').disabled = true;
    document.getElementById('btn-sell').disabled = true;
    document.getElementById('btn-shield').disabled = true;
}

// 🏆 클리어 처리
function gameClear() {
    logMessage("🎉 GAME CLEAR: 전설 달성!");
    alert("🎉 축하합니다! 30강에 도달하여 게임을 클리어했습니다!");
    document.getElementById('btn-upgrade').disabled = true;
}

// ✅ 강화 로직 (최종 버전)
function upgradeSword() {
    let cost = 500 + (swordLevel * 300);
    
    // 1. [1강(0->1) 도전 시] 이때는 돈이 없으면 가차 없이 파산!
    if (swordLevel === 0 && money < cost) {
        logMessage("❌ 자금 부족으로 1강 도전 불가 - 탈락!");
        gameOver();
        return;
    }
    
    // 2. [1강 이후] 돈이 부족하면 강화만 안 되고, 판매 후 재도전 가능
    if (money < cost) {
        alert("⚠️ 돈이 부족합니다! [검 판매]를 눌러 돈을 확보하세요.");
        logMessage("❌ 돈이 부족합니다! 판매 후 다시 시도하세요.");
        return;
    }
    
    money -= cost;
    let rate = getSuccessRate(swordLevel);
    
    if (Math.random() * 100 <= rate) {
        swordLevel++;
        logMessage(`✨ 성공: +${swordLevel} (확률: ${rate.toFixed(1)}%)`);
        if (swordLevel >= 30) gameClear();
    } else {
        if (swordLevel >= 5 && shieldCount > 0) { 
            shieldCount--; 
            logMessage("🛡️ 방지권 사용"); 
        } else { 
            swordLevel = 0; 
            logMessage("💥 파괴!"); 
        }
    }
    updateUI();
}

function sellSword() {
    if (swordLevel === 0) { logMessage("⚠️ 0강은 판매 불가!"); return; }
    money += calculateSellPrice(swordLevel);
    logMessage(`💰 판매: ${calculateSellPrice(swordLevel).toLocaleString()}원 획득`);
    swordLevel = 0;
    updateUI();
}

function buyShield() {
    if (money >= SHIELD_PRICE) { money -= SHIELD_PRICE; shieldCount++; updateUI(); }
    else { logMessage("❌ 돈 부족!"); }
}

updateUI();
