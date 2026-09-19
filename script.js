const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQDYrX333kxKy9TeVtC8Go_ScX6-TdjfyjgEa6KssxFfBcYJRyj2LUuDdZork7mqdNrg/exec';

let currentStep = 1;

// DOM 元素
const dots = document.querySelectorAll('.step-dot');
const stepIndicator = document.getElementById('stepIndicator');
const pages = document.querySelectorAll('.step-page');
const agreeRules = document.getElementById('agreeRules');
const toPage2 = document.getElementById('toPage2');
const categoryBtns = document.querySelectorAll('.category-btn:not(:disabled)');
const categoryInput = document.getElementById('category');
const toPage3 = document.getElementById('toPage3');
const messageTextarea = document.getElementById('message');
const currentCharField = document.getElementById('currentChar');
const toPage4 = document.getElementById('toPage4');
const confirmCategory = document.getElementById('confirmCategory');
const confirmMessage = document.getElementById('confirmMessage');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('confessionForm');

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

// 第二頁：選擇分類
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        categoryInput.value = btn.getAttribute('data-category');
        toPage3.disabled = false;
    });
});

toPage3.addEventListener('click', () => showStep(3));

// 第三頁：字數限制 50 字
messageTextarea.addEventListener('input', () => {
    const len = messageTextarea.value.length;
    currentCharField.textContent = len;
    toPage4.disabled = len === 0 || len > 50;
});

// 進入確認頁 (第 4 頁)
toPage4.addEventListener('click', () => {
    confirmCategory.textContent = categoryInput.value;
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

        // 成功後直接切到第 5 頁成功畫面，不回重設投稿頁
        showStep(5);

    } catch (error) {
        alert('發生錯誤，請檢查網路連線或稍後再試！');
        submitBtn.disabled = false;
        submitBtn.textContent = '確認送出 🚀';
    }
});
