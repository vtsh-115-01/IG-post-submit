const form = document.getElementById('confessionForm');
const responseMessage = document.getElementById('responseMessage');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQDYrX333kxKy9TeVtC8Go_ScX6-TdjfyjgEa6KssxFfBcYJRyj2LUuDdZork7mqdNrg/exec';

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '傳送中...';

    const formData = {
        category: document.getElementById('category').value,
        message: document.getElementById('message').value
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