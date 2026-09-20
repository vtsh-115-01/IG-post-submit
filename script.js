const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQDYrX333kxKy9TeVtC8Go_ScX6-TdjfyjgEa6KssxFfBcYJRyj2LUuDdZork7mqdNrg/exec';

let currentStep = 1;

const PLACEHOLDERS = {
    '200粉Q&A': '200粉限定Q&A，問個問題吧',
    '生日': '同班這麼久，來點祝福',
    '告白': '趁亂告白，搞不好能成功'
};

const dots = document.querySelectorAll('.step-dot');
const stepIndicator = document.getElementById('stepIndicator');
const pages = document.querySelectorAll('.step-page');
const agreeRules = document.getElementById('agreeRules');
const toPage2 = document.getElementById('toPage2');
const categoryInput = document.getElementById('category');
const toPage3 = document.getElementById('toPage3');
const messageTextarea = document.getElementById('message');
const currentCharField = document.getElementById('currentChar');
const toPage4 = document.getElementById('toPage4');
const confirmCategory = document.getElementById('confirmCategory');
const confirmMessage = document.getElementById('confirmMessage');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('confessionForm');

// 💡 【新增】初始化檢查每個分類的截止日期
function checkDeadlines() {
    const now = new Date();
    document.querySelectorAll('.category-btn').forEach(btn => {
        const deadlineStr = btn.getAttribute('data-deadline');
        const badge = btn.querySelector('.status-badge');
        
        if (deadlineStr) {
            const deadline = new Date(deadlineStr);
            if (now > deadline) {
                // 已過期 -> 鎖定並顯示紅標
                btn.disabled = true;
                btn.classList.remove('selected');
                if (badge) {
                    badge.className = 'badge closed status-badge';
                    badge.textContent = '不開放';
                }
            } else {
                // 未過期 -> 如果本來不是手動關閉，確保可以點
                // 註：若你希望保留靠北預設關閉，可讓它維持 disabled
                if (badge && badge.textContent === '不開放') {
                    badge.textContent = '';
                    badge.className = 'badge status-badge';
                }
            }
        }
    });
}

// 執行截止檢查
checkDeadlines();

// 切換頁面函式
function showStep(step) {
    currentStep = step;
    pages.forEach((p, idx) => {
        p.classList.toggle('active', idx + 1 === step);
    });

    if (step === 5) {
        stepIndicator.classList.add('hidden');
    } else {
        stepIndicator.classList.remove('hidden');
        dots.forEach((d, idx) => {
            d.classList.toggle('active', idx + 1 === step);
        });
    }
}

// 第一頁：同意規則勾選
agreeRules.addEventListener('change', () => {
    toPage2.disabled = !agreeRules.checked;
});

toPage2.addEventListener('click', () => showStep(2));

// 第二頁：選擇分類 (排除 disabled)
document.querySelectorAll('.category-btn').forEach(btn => {
    if (btn.disabled) return;
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const selectedCat = btn.getAttribute('data-category');
        categoryInput.value = selectedCat;
        
        // 更新 placeholder
        if (PLACEHOLDERS[selectedCat]) {
            messageTextarea.setAttribute('placeholder', PLACEHOLDERS[selectedCat]);
        }

        toPage3.disabled = false;
    });
});

toPage3.addEventListener('click', () => showStep(3));

// 第三頁：字數限制 1~50 字
function updateCharState() {
    const len = messageTextarea.value.trim().length;
    currentCharField.textContent = messageTextarea.value.length;
    toPage4.disabled = len === 0 || messageTextarea.value.length > 50;
}

messageTextarea.addEventListener('input', updateCharState);

// 進入確認頁 (第 4 頁)
toPage4.addEventListener('click', () => {
    if (toPage4.disabled) return;
    confirmCategory.textContent = categoryInput.value || '未選擇';
    confirmMessage.textContent = messageTextarea.value;
    showStep(4);
});

// 上一步按鈕通用邏輯
document.querySelectorAll('.prev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = parseInt(btn.getAttribute('data-target'));
        showStep(target);
    });
});

// 最終送出並轉跳成功頁
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = '傳送中...';

    const formData = {
        category: categoryInput.value,
        message: messageTextarea.value
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // 成功後直接切到第 5 頁成功畫面
        showStep(5);

    } catch (error) {
        alert('發生錯誤，請檢查網路連線或稍後再試！');
        submitBtn.disabled = false;
        submitBtn.textContent = '確認送出 🚀';
    }
});
