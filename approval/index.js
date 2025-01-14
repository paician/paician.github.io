Page({
  data: {
      widgets: [
          { type: 'single-line-text', label: '单行文本' },
          { type: 'multi-line-text', label: '多行文本' },
          { type: 'description', label: '说明' },
          { type: 'number', label: '数字' },
          { type: 'currency', label: '金额' },
          { type: 'formula', label: '计算公式' }
      ],
      formItems: [],
      touchStartY: null,
      draggedItemIndex: null,
      insertPosition: null
  },

  onLoad() {
      console.log('页面加载');
  },

  // 控件点击事件处理
  onWidgetTap(e) {
      const widgetType = e.currentTarget.dataset.type;
      const newItem = this.createFormItem(widgetType);
      
      const updatedFormItems = [...this.data.formItems, newItem];
      
      this.setData({
          formItems: updatedFormItems
      });
  },

  // 创建表单项
  createFormItem(type) {
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
          'formula': {
              label: '计算公式',
              type: 'text'
          },
          'description': {
              label: '说明',
              type: 'text'
          }
      };

      return {
          ...itemMap[type],
          unique: Date.now()
      };
  },

  // 移除表单项
  removeFormItem(e) {
      const index = e.currentTarget.dataset.index;
      const updatedFormItems = this.data.formItems.filter((_, i) => i !== index);
      
      this.setData({
          formItems: updatedFormItems
      });
  },

  // 触摸开始
  onTouchStart(e) {
      this.setData({
          touchStartY: e.touches[0].clientY,
          draggedItemIndex: e.currentTarget.dataset.index
      });
  },

  // 触摸移动
  onTouchMove(e) {
      const { touchStartY, draggedItemIndex } = this.data;
      const touchMoveY = e.touches[0].clientY;
      const yDiff = touchMoveY - touchStartY;

      // 判断移动方向和距离
      if (Math.abs(yDiff) > 50) {
          const { formItems } = this.data;
          const newIndex = yDiff > 0 ? 
              parseInt(draggedItemIndex) + 1 : 
              parseInt(draggedItemIndex) - 1;

          // 确保新索引在数组范围内
          if (newIndex >= 0 && newIndex < formItems.length) {
              // 交换位置
              const newFormItems = [...formItems];
              [newFormItems[draggedItemIndex], newFormItems[newIndex]] = 
              [newFormItems[newIndex], newFormItems[draggedItemIndex]];

              this.setData({
                  formItems: newFormItems,
                  touchStartY: touchMoveY,
                  draggedItemIndex: newIndex,
                  insertPosition: newIndex
              });
          }
      }
  },

  // 触摸结束
  onTouchEnd() {
      this.setData({
          touchStartY: null,
          draggedItemIndex: null,
          insertPosition: null
      });
  }
});