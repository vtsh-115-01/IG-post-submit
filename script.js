const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQDYrX333kxKy9TeVtC8Go_ScX6-TdjfyjgEa6KssxFfBcYJRyj2LUuDdZork7mqdNrg/exec';

let currentStep = 1;
const totalSteps = 3;

const dots = document.querySelectorAll('.step-dot');
const pages = document.querySelectorAll('.step-page');
const agreeRules = document.getElementById('agreeRules');
const toPage2 = document.getElementById('toPage2');
const categoryBtns = document.querySelectorAll('.category-btn:not(:disabled)');
const categoryInput = document.getElementById('category');
const toPage3 = document.getElementById('toPage3');
const messageTextarea = document.getElementById('message');
const currentCharField = document.getElementById('currentChar');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('confessionForm');
const responseMessage = document.getElementById('responseMessage');

// 切換頁面函式
function showStep(step) {
    currentStep = step;
    pages.forEach((p, idx) => {
        p.classList.toggle('active', idx + 1 === step);
    });
    dots.forEach((d, idx) => {
        d.classList.toggle('active', idx + 1 === step);
    });
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

// 上一步按鈕通用邏輯
document.querySelectorAll('.prev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = parseInt(btn.getAttribute('data-target'));
        showStep(target);
    });
});

// 第三頁：字數限制 50 字
messageTextarea.addEventListener('input', () => {
    const len = messageTextarea.value.length;
    currentCharField.textContent = len;
    submitBtn.disabled = len === 0 || len > 50;
});

// 最終送出
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

        form.reset();
        categoryBtns.forEach(b => b.classList.remove('selected'));
        currentCharField.textContent = '0';
        showStep(1);
        agreeRules.checked = false;
        toPage2.disabled = true;
        toPage3.disabled = true;
        submitBtn.disabled = true;

        responseMessage.textContent = '✨ 投稿成功！小編審核後會發到 IG 喔！';
        responseMessage.classList.remove('hidden');
        setTimeout(() => {
            responseMessage.classList.add('hidden');
        }, 5000);

    } catch (error) {
        alert('發生錯誤，請檢查網路連線或稍後再試！');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '送出投稿 🚀';
    }
});
