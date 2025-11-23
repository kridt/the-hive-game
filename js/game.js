// Game State
const game = {
    honey: 0,
    totalHoney: 0,
    totalClicks: 0,
    clickValue: 1,

    // Upgrades
    upgrades: {
        workerBee: { owned: 0, baseCost: 10, costMultiplier: 1.15, hps: 0.1 },
        hive: { owned: 0, baseCost: 100, costMultiplier: 1.15, hps: 1 },
        apiary: { owned: 0, baseCost: 1000, costMultiplier: 1.15, hps: 10 },
        queenBee: { owned: 0, baseCost: 5000, costMultiplier: 1.15, hps: 50 },
        flowerField: { owned: 0, baseCost: 25000, costMultiplier: 1.15, hps: 200 }
    },

    // Research (one-time purchases)
    research: {
        efficiency: { purchased: false, cost: 50 },
        breeding: { purchased: false, cost: 500 }
    },

    // Multipliers
    multipliers: {
        workerBee: 1,
        click: 1
    }
};

// Calculate cost of upgrade
function getUpgradeCost(upgradeId) {
    const upgrade = game.upgrades[upgradeId];
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
}

// Calculate honey per second
function getHoneyPerSecond() {
    let hps = 0;

    for (const [id, upgrade] of Object.entries(game.upgrades)) {
        let multiplier = game.multipliers[id] || 1;
        hps += upgrade.owned * upgrade.hps * multiplier;
    }

    return hps;
}

// Collect honey (click action)
function collectHoney() {
    const amount = game.clickValue * game.multipliers.click;
    game.honey += amount;
    game.totalHoney += amount;
    game.totalClicks++;
    updateUI();
}

// Buy upgrade
function buyUpgrade(upgradeId) {
    const cost = getUpgradeCost(upgradeId);

    if (game.honey >= cost) {
        game.honey -= cost;
        game.upgrades[upgradeId].owned++;
        checkUnlocks();
        updateUI();
    }
}

// Buy research
function buyResearch(researchId) {
    const research = game.research[researchId];

    if (!research.purchased && game.honey >= research.cost) {
        game.honey -= research.cost;
        research.purchased = true;
        applyResearch(researchId);
        document.getElementById(`research-${researchId}`).style.display = 'none';
        updateUI();
    }
}

// Apply research effects
function applyResearch(researchId) {
    switch (researchId) {
        case 'efficiency':
            game.multipliers.click = 2;
            document.getElementById('collect-btn').querySelector('.btn-info').textContent = `+${game.clickValue * game.multipliers.click} honey`;
            // Unlock breeding research
            document.getElementById('research-breeding').style.display = 'block';
            break;
        case 'breeding':
            game.multipliers.workerBee = 2;
            break;
    }
}

// Check for unlocks based on progress
function checkUnlocks() {
    // Unlock research section
    if (game.totalHoney >= 30) {
        document.getElementById('research').style.display = 'block';
    }

    // Unlock hive
    if (game.upgrades.workerBee.owned >= 5 || game.totalHoney >= 50) {
        document.getElementById('buy-hive').style.display = 'block';
    }

    // Unlock apiary
    if (game.upgrades.hive.owned >= 3 || game.totalHoney >= 500) {
        document.getElementById('buy-apiary').style.display = 'block';
    }

    // Unlock queen bee
    if (game.upgrades.apiary.owned >= 2 || game.totalHoney >= 2500) {
        document.getElementById('buy-queenBee').style.display = 'block';
    }

    // Unlock flower field
    if (game.upgrades.queenBee.owned >= 2 || game.totalHoney >= 12500) {
        document.getElementById('buy-flowerField').style.display = 'block';
    }
}

// Update UI
function updateUI() {
    // Main display
    document.getElementById('honey-count').textContent = formatNumber(Math.floor(game.honey));
    document.getElementById('hps').textContent = formatNumber(getHoneyPerSecond(), 1);

    // Stats
    document.getElementById('total-honey').textContent = formatNumber(Math.floor(game.totalHoney));
    document.getElementById('total-clicks').textContent = formatNumber(game.totalClicks);

    // Upgrades
    for (const [id, upgrade] of Object.entries(game.upgrades)) {
        const cost = getUpgradeCost(id);
        const costEl = document.getElementById(`${id}-cost`);
        const ownedEl = document.getElementById(`${id}-owned`);
        const btnEl = document.getElementById(`buy-${id}`);

        if (costEl) costEl.textContent = formatNumber(cost);
        if (ownedEl) ownedEl.textContent = upgrade.owned;

        if (btnEl) {
            btnEl.disabled = game.honey < cost;
            btnEl.classList.toggle('affordable', game.honey >= cost);
        }
    }

    // Research
    for (const [id, research] of Object.entries(game.research)) {
        const btnEl = document.getElementById(`research-${id}`);
        if (btnEl && !research.purchased) {
            btnEl.disabled = game.honey < research.cost;
            btnEl.classList.toggle('affordable', game.honey >= research.cost);
        }
    }
}

// Format large numbers
function formatNumber(num, decimals = 0) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return decimals ? num.toFixed(decimals) : num.toString();
}

// Game loop
function gameLoop() {
    const hps = getHoneyPerSecond();
    const honeyGained = hps / 10; // Running at 10 ticks per second

    game.honey += honeyGained;
    game.totalHoney += honeyGained;

    updateUI();
}

// Save game
function saveGame() {
    const saveData = {
        honey: game.honey,
        totalHoney: game.totalHoney,
        totalClicks: game.totalClicks,
        clickValue: game.clickValue,
        upgrades: game.upgrades,
        research: game.research,
        multipliers: game.multipliers,
        timestamp: Date.now()
    };

    localStorage.setItem('universalHoneySave', JSON.stringify(saveData));
    document.getElementById('save-status').textContent = 'Game saved!';
    setTimeout(() => {
        document.getElementById('save-status').textContent = '';
    }, 2000);
}

// Load game
function loadGame() {
    const saveData = localStorage.getItem('universalHoneySave');

    if (saveData) {
        const data = JSON.parse(saveData);

        game.honey = data.honey || 0;
        game.totalHoney = data.totalHoney || 0;
        game.totalClicks = data.totalClicks || 0;
        game.clickValue = data.clickValue || 1;

        // Load upgrades
        if (data.upgrades) {
            for (const [id, upgrade] of Object.entries(data.upgrades)) {
                if (game.upgrades[id]) {
                    game.upgrades[id].owned = upgrade.owned;
                }
            }
        }

        // Load research
        if (data.research) {
            for (const [id, research] of Object.entries(data.research)) {
                if (game.research[id]) {
                    game.research[id].purchased = research.purchased;
                    if (research.purchased) {
                        applyResearch(id);
                    }
                }
            }
        }

        // Load multipliers
        if (data.multipliers) {
            game.multipliers = { ...game.multipliers, ...data.multipliers };
        }

        // Calculate offline progress
        if (data.timestamp) {
            const offlineSeconds = (Date.now() - data.timestamp) / 1000;
            const offlineHoney = getHoneyPerSecond() * offlineSeconds * 0.5; // 50% offline efficiency

            if (offlineHoney > 0) {
                game.honey += offlineHoney;
                game.totalHoney += offlineHoney;
                alert(`Welcome back! You earned ${formatNumber(Math.floor(offlineHoney))} honey while away.`);
            }
        }

        checkUnlocks();
        updateUI();
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset your game? All progress will be lost!')) {
        localStorage.removeItem('universalHoneySave');
        location.reload();
    }
}

// Auto-save every 30 seconds
setInterval(saveGame, 30000);

// Initialize game
window.onload = function() {
    loadGame();
    checkUnlocks();
    updateUI();

    // Start game loop (10 ticks per second)
    setInterval(gameLoop, 100);
};

// Save before closing
window.onbeforeunload = function() {
    saveGame();
};
