let formItems = [];

function onWidgetTap(event) {
    const widgetType = event.target.getAttribute('data-type');
    const newItem = createFormItem(widgetType);
    
    formItems.push(newItem);
    renderFormItems();
}

function createFormItem(type) {
    const itemMap = {
        'single-line-text': {
            label: '单行文本',
            type: 'text'
        },
        'multi-line-text': {
            label: '多行文本',
            type: 'textarea'
        },
        'number': {
            label: '数字',
            type: 'number'
        },
        'currency': {
            label: '金额',
            type: 'number'
        },
        'description': {
            label: '说明',
            type: 'text'
        },
        'formula': {
            label: '计算公式',
            type: 'text'
        }
    };

    return {
        ...itemMap[type],
        id: Date.now()
    };
}

function renderFormItems() {
    const formPanel = document.getElementById('formPanel');
    formPanel.innerHTML = formItems.map(item => `
        <div class="form-item" data-id="${item.id}">
            <span>${item.label}</span>
            <span class="form-item-remove" onclick="removeFormItem(${item.id})">🗑️</span>
        </div>
    `).join('');
}

function removeFormItem(id) {
    formItems = formItems.filter(item => item.id !== id);
    renderFormItems();
}
