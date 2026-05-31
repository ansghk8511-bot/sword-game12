// 게임 상태 변수
let money = 50000; 
let shieldCount = 0;
let swordLevel = 0;
let fragments = [];

// 화면 전환
function goToShop() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('shop-screen').style.display = 'block';
}

function goToGame() {
    document.getElementById('shop-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    updateUI();
}

// 화면 업데이트
function updateUI() {
    document.getElementById('money').innerText = money.toLocaleString();
    document.getElementById('shield-count').innerText = shieldCount;
    document.getElementById('level-display').innerText = "+" + swordLevel;
    document.getElementById('upgrade-cost').innerText = (500 + (swordLevel * 500)).toLocaleString();
    
    // 단계별 방지권 필요량 표시
    let req = (swordLevel < 5) ? 0 : Math.floor((swordLevel - 5) / 1) + 2;
    document.getElementById('shield-req').innerText = req > 0 ? `실패 시 방지권 ${req}개 소모` : "방어 불가";
    
    // 파편 UI
    let fragList = document.getElementById('fragment-list');
    fragList.innerHTML = "";
    fragments.forEach(() => {
        let span = document.createElement("span");
        span.innerText = "💎";
        fragList.appendChild(span);
    });
}

// 로그 메시지 출력 및 자동 스크롤
function logMessage(msg) {
    let logEl = document.getElementById('game-log');
    logEl.innerHTML = `<div>${msg}</div>` + logEl.innerHTML;
    logEl.scrollTop = 0; // 항상 최신 로그가 맨 위에 오도록
}

// 핵심 강화 로직
function upgradeSword() {
    let cost = 500 + (swordLevel * 500);
    
    if (swordLevel === 0 && money < cost) { 
        alert("💀 파산! 게임을 다시 시작합니다."); 
        location.reload(); 
        return; 
    }
    if (money < cost) { 
        alert("⚠️ 돈이 부족합니다! 판매 후 다시 시도하세요."); 
        return; 
    }
    
    money -= cost;
    // 강화 확률: 90%에서 시작하여 레벨당 10%씩 감소, 최소 5% 확률 유지
    let rate = Math.max(90 - (swordLevel * 10), 5); 
    
    if (Math.random() * 100 <= rate) {
        swordLevel++;
        logMessage(`✨ 성공: +${swordLevel} (확률: ${rate.toFixed(0)}%)`);
    } else {
        let req = (swordLevel < 5) ? 0 : Math.floor((swordLevel - 5) / 1) + 2;
        
        if (req > 0 && shieldCount >= req) {
            shieldCount -= req;
            logMessage(`🛡️ 방지권 ${req}개 소모하여 방어 성공!`);
        } else {
            let earned = Math.floor(swordLevel / 2) + 1;
            for(let i = 0; i < earned; i++) fragments.push({});
            swordLevel = 0;
            logMessage(`💥 파괴! +0으로 초기화됨 (파편 ${earned}개 획득)`);
        }
    }
    updateUI();
}

// 상점 전용 기능
function buyShield() {
    if (money >= 5000) {
        money -= 5000;
        shieldCount++;
        logMessage("🛡️ 방지권 구매 완료");
        updateUI();
    } else { 
        alert("❌ 돈이 부족합니다!"); 
    }
}

// 판매 기능
function sellSword() {
    if (swordLevel === 0) return;
    let sellPrice = swordLevel * 1000;
    money += sellPrice;
    logMessage(`💰 판매 완료: ${sellPrice.toLocaleString()}원 획득`);
    swordLevel = 0;
    updateUI();
}

// 파편 결합 (방지권 제작)
function combineFragments() {
    if (fragments.length >= 10) {
        fragments.splice(0, 10);
        shieldCount += 1;
        logMessage("🛠️ 파편 10개 결합 완료! 방지권 1개 획득.");
        updateUI();
    } else { 
        alert("❌ 파편이 부족합니다 (10개 필요)"); 
    }
}

// 초기 호출
updateUI();
