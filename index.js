// scripts.js

// 初始化變數
const widgetPanel = document.querySelector('.widget-panel');
const sortable = document.getElementById('sortable');

// 啟用 jQuery UI 的排序功能
$(function () {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
});

// 監聽左側控件點擊事件
widgetPanel.addEventListener('click', (e) => {
    if (e.target.classList.contains('widget')) {
        const widgetType = e.target.dataset.type;
        addWidgetToSortable(widgetType);
    }
});

// 動態添加控件到右側設計區
function addWidgetToSortable(widgetType) {
    const formItem = document.createElement('div');
    formItem.className = 'form-item';
    formItem.innerHTML = `
        <label>${getWidgetLabel(widgetType)}*</label>
        <input type="text" placeholder="請輸入" disabled />
        <div class="controls">
            <button class="move-up">↑</button>
            <button class="move-down">↓</button>
            <button class="delete">✖</button>
        </div>
    `;

    // 綁定按鈕事件
    const moveUp = formItem.querySelector('.move-up');
    const moveDown = formItem.querySelector('.move-down');
    const deleteBtn = formItem.querySelector('.delete');

    moveUp.addEventListener('click', () => moveElement(formItem, 'up'));
    moveDown.addEventListener('click', () => moveElement(formItem, 'down'));
    deleteBtn.addEventListener('click', () => formItem.remove());

    // 插入到排序區域
    sortable.appendChild(formItem);
}

// 移動元素上下
function moveElement(element, direction) {
    if (direction === 'up') {
        const prev = element.previousElementSibling;
        if (prev) sortable.insertBefore(element, prev);
    } else if (direction === 'down') {
        const next = element.nextElementSibling;
        if (next) sortable.insertBefore(next, element);
    }
}

// 根據控件類型返回標籤名稱
function getWidgetLabel(widgetType) {
    const labels = {
        'single-line-text': '單行文本',
        'multi-line-text': '多行文本',
    };
    return labels[widgetType] || '未知控件';
}
