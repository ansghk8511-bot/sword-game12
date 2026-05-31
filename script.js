// 💰 기본 데이터
let money = 50000; 
let shieldCount = 0;
let swordLevel = 0;
let fragments = [];

// 🛡️ 단계별 필요한 방지권 (하드모드)
function getRequiredShields(level) {
    if (level < 5) return 0;
    return Math.floor((level - 5) / 1) + 2; 
}

// 📸 화면 전환
function goToShop() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('shop-screen').style.display = 'block';
}

function goToGame() {
    document.getElementById('shop-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    updateUI();
}

function updateUI() {
    document.getElementById('money').innerText = money.toLocaleString();
    document.getElementById('shield-count').innerText = shieldCount;
    document.getElementById('level-display').innerText = "+" + swordLevel;
    document.getElementById('upgrade-cost').innerText = (500 + (swordLevel * 500)).toLocaleString();
    document.getElementById('fragment-display').innerText = fragments.length;
    
    let req = getRequiredShields(swordLevel);
    document.getElementById('shield-req').innerText = req > 0 ? `실패 시 방지권 ${req}개 소모` : "방어 불가";
    
    // 파편 UI 업데이트
    let fragListEl = document.getElementById('fragment-list');
    fragListEl.innerHTML = "";
    fragments.forEach(() => {
        let span = document.createElement("span");
        span.innerHTML = "💎";
        fragListEl.appendChild(span);
    });
}

function logMessage(msg) {
    let logEl = document.getElementById('game-log');
    logEl.innerHTML = msg + "<br>" + logEl.innerHTML;
}

// 💥 파괴 및 파편 획득
function destroySword() {
    let earnedCount = Math.floor(swordLevel / 2) + 1;
    for(let i = 0; i < earnedCount; i++) fragments.push({ grade: "일반" });
    swordLevel = 0;
    logMessage(`💥 파괴! 파편 ${earnedCount}개 획득.`);
    updateUI();
}

// 🛠️ 파편 결합
function combineFragments() {
    if (fragments.length >= 10) {
        fragments.splice(0, 10);
        swordLevel++;
        logMessage(`✨ 파편 10개 결합! +${swordLevel}로 복구/강화!`);
        updateUI();
    } else {
        alert("❌ 파편이 부족합니다 (10개 필요)");
    }
}

// 🔥 강화 로직
function upgradeSword() {
    let cost = 500 + (swordLevel * 500);
    if (swordLevel === 0 && money < cost) { alert("💀 파산!"); location.reload(); return; }
    if (money < cost) { alert("⚠️ 돈 부족! 판매 후 다시 시도하세요."); return; }
    
    money -= cost;
    let rate = Math.max(100 - (swordLevel * 4), 0.5);
    
    if (Math.random() * 100 <= rate) {
        swordLevel++;
        logMessage(`✨ 성공: +${swordLevel} (확률: ${rate.toFixed(1)}%)`);
        if (swordLevel >= 30) alert("👑 전설 달성! A+ 확정!");
    } else {
        let required = getRequiredShields(swordLevel);
        if (required > 0 && shieldCount >= required) { 
            shieldCount -= required; 
            logMessage(`🛡️ 방지권 ${required}개 소모하여 방어!`); 
        } else {
            destroySword();
        }
    }
    updateUI();
}

// 💰 상점 함수
function buyShield() {
    if (money >= 5000) {
        money -= 5000;
        shieldCount++;
        logMessage(`🛡️ 방지권 구매 완료`);
        updateUI();
    } else { alert("❌ 돈 부족!"); }
}

function sellSword() {
    if (swordLevel === 0) return;
    let price = swordLevel * 1000;
    money += price;
    logMessage(`💰 판매: ${price.toLocaleString()}원`);
    swordLevel = 0;
    updateUI();
}

updateUI();
