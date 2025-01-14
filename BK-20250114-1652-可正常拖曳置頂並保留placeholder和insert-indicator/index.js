// V1.4 确保 indicator 在拖曳完成后消失
let formItems = [];
let draggedElement = null;
let draggedIndex = -1;
let currentPlaceholder = null;
let currentIndicator = null;

function onWidgetTap(event) {
    const widgetType = event.target.getAttribute('data-type');
    const newItem = createFormItem(widgetType);
    
    formItems.push(newItem);
    renderFormItems();
}

function createFormItem(type) {
    const itemMap = {
        'single-line-text': { label: '单行文本', type: 'text' },
        'multi-line-text': { label: '多行文本', type: 'textarea' },
        'number': { label: '数字', type: 'number' },
        'currency': { label: '金额', type: 'number' },
        'description': { label: '说明', type: 'text' },
        'formula': { label: '计算公式', type: 'text' }
    };

    return {
        ...itemMap[type],
        id: Date.now()
    };
}

function renderFormItems() {
    const formPanel = document.getElementById('formPanel');
    formPanel.innerHTML = formItems.map((item, index) => `
        <div 
            class="form-item" 
            data-id="${item.id}" 
            data-index="${index}"
        >
            <span>${item.label}</span>
            <span 
                class="form-item-remove" 
                onclick="event.stopPropagation(); removeFormItem(${item.id})"
            >🗑️</span>
        </div>
    `).join('');

    // 初始化 Sortable
    new Sortable(formPanel, {
        animation: 150,
        ghostClass: 'dragging',
        chosenClass: 'dragging-chosen',
        dragClass: 'dragging-active',
        
        // 拖拽开始时
        onStart: function(evt) {
            // 创建占位符
            currentPlaceholder = document.createElement('div');
            currentPlaceholder.classList.add('form-item', 'placeholder');
            currentPlaceholder.style.height = `${evt.item.offsetHeight}px`;
            
            // 在原始元素后插入占位符
            evt.to.insertBefore(currentPlaceholder, evt.item.nextSibling);
        },
        
        // 拖拽移动时
        onMove: function(evt) {
            // 清除现有的插入指示器
            if (currentIndicator) {
                currentIndicator.remove();
            }
            
            // 创建插入指示器
            currentIndicator = document.createElement('div');
            currentIndicator.classList.add('insert-indicator');
            
            // 确定插入位置和指示器位置
            if (evt.related) {
                const rect = evt.related.getBoundingClientRect();
                const isAbove = evt.willInsertAfter === false;
                
                currentIndicator.style.position = 'absolute';
                currentIndicator.style.left = `${rect.left}px`;
                currentIndicator.style.width = `${rect.width}px`;
                currentIndicator.style.height = '2px';
                currentIndicator.style.backgroundColor = 'blue';
                currentIndicator.style.zIndex = '10';
                
                if (isAbove) {
                    currentIndicator.style.top = `${rect.top - 2}px`;
                    evt.to.insertBefore(currentPlaceholder, evt.related);
                } else {
                    currentIndicator.style.top = `${rect.bottom - 2}px`;
                    evt.to.insertBefore(currentPlaceholder, evt.related.nextSibling);
                }
                
                document.body.appendChild(currentIndicator);
            } else {
                // 如果是插入到最后
                evt.to.appendChild(currentPlaceholder);
            }
        },

        // 拖拽结束时的回调
        onEnd: function(evt) {
            // 更新 formItems 数组
            const [removedItem] = formItems.splice(evt.oldIndex, 1);
            formItems.splice(evt.newIndex, 0, removedItem);
            
            // 移除 indicator
            if (currentIndicator) {
                currentIndicator.remove();
                currentIndicator = null;
            }
            
            // 重新渲染以清理临时元素
            renderFormItems();
        }
    });
}

function removeFormItem(id) {
    formItems = formItems.filter(item => item.id !== id);
    renderFormItems();
}

// 初始渲染
renderFormItems();