// 初始化 Fabric.js Canvas
const canvas = new fabric.Canvas('canvas', {
    width: 1200,
    height: 625,
    backgroundColor: '#ffffff'
});

// 全局變數
let currentEditingText = null;
const imageFolder = 'imgs/';
const availableImages = [
    'QRcode_circle_1.png',
    'QRcode_circle_2.png',
    'QRcode_circle_3.png',
    'QRcode_circle_4.png',
    'QRcode_hand_1.png',
    'QRcode_leaf_1.png',
    'QRcode_leaf_2.png',
    'QRcode_leaf_3.png',
    'QRcode_line_1.png',
    'QRcode_line_2.png',
    'QRcode_PID_1.png',
    'QRcode_square_1.png',
    'QRcode_square_2.png'
];

// 載入圖片庫
function loadImageGallery() {
    const gallery = document.getElementById('imageGallery');
    
    availableImages.forEach(imageName => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.draggable = true;
        galleryItem.dataset.imageSrc = imageFolder + imageName;
        
        const img = document.createElement('img');
        img.src = imageFolder + imageName;
        img.alt = imageName;
        
        const nameLabel = document.createElement('div');
        nameLabel.className = 'gallery-item-name';
        nameLabel.textContent = imageName.replace('.png', '');
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(nameLabel);
        gallery.appendChild(galleryItem);
        
        // 拖曳開始事件
        galleryItem.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('imageSrc', this.dataset.imageSrc);
            e.dataTransfer.effectAllowed = 'copy';
        });
        
        // 點擊直接添加到畫布
        galleryItem.addEventListener('click', function() {
            addImageToCanvas(this.dataset.imageSrc);
        });
    });
}

// 添加圖片到畫布
function addImageToCanvas(imageSrc, left = 100, top = 100) {
    fabric.Image.fromURL(imageSrc, function(img) {
        // 根據畫布大小調整圖片
        const maxWidth = 300;
        const maxHeight = 300;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        
        img.set({
            left: left,
            top: top,
            scaleX: scale,
            scaleY: scale,
            cornerSize: 12,
            transparentCorners: false,
            borderColor: '#667eea',
            cornerColor: '#667eea',
            cornerStyle: 'circle'
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
    });
}

// 初始化畫布，添加預設圖片
function initCanvas() {
    // 預設放入裝飾性圖片
    const defaultLayout = [
         // 圓形
        { src: 'imgs/QRcode_circle_2.png', left: 900, top: 350, scale: 0.1 },
        // 右上 - 線條
        { src: 'imgs/QRcode_line_2.png', left: 990, top: 170, scale: 0.15 },
        // 右上 - 圓形
        { src: 'imgs/QRcode_circle_3.png', left: 1050, top: 90, scale: 0.15 },
        // 右上 - 圓形2
        { src: 'imgs/QRcode_circle_4.png', left: 1085, top: 135, scale: 0.15 },
        // 裝飾葉子
        { src: 'imgs/QRcode_leaf_1.png', left: 550, top: 550, scale: 0.1 },
        // 裝飾葉子
        { src: 'imgs/QRcode_leaf_3.png', left: 780, top: 80, scale: 0.13, angle: 160 },
        // 裝飾葉子
        { src: 'imgs/QRcode_leaf_3.png', left: -10, top: 400, scale: 0.13 },
        // 偏右 - 手機上的 QR code
        { src: 'imgs/QRcode_hand_1.png', left: 750, top: 160, scale: 0.13 },
    ];

    // 載入預設佈局
    defaultLayout.forEach((item, index) => {
        fabric.Image.fromURL(item.src, function(img) {
            img.set({
                left: item.left,
                top: item.top,
                scaleX: item.scale,
                scaleY: item.scale,
                angle: item.angle || 0,
                cornerSize: 12,
                transparentCorners: false,
                borderColor: '#667eea',
                cornerColor: '#667eea',
                cornerStyle: 'circle'
            });
            canvas.add(img);
            
            // 最後一個圖片載入完成後顯示提示
            if (index === defaultLayout.length - 1) {

                // 添加預設文字
                const defaultText = new fabric.IText('請出示Qr Code', {
                    left: 230,
                    top: 250,
                    fontFamily: 'Arial',
                    fontSize: 60,
                    fill: '#000000',
                    cornerSize: 12,
                    transparentCorners: false,
                    borderColor: '#667eea',
                    cornerColor: '#667eea',
                    cornerStyle: 'circle'
                });

                // 添加預設文字2 
                const defaultText2 = new fabric.IText('Please present the QR Code', {
                    left: 170,
                    top: 360,
                    fontFamily: 'Arial',
                    fontSize: 44,
                    fill: '#000000',
                    cornerSize: 12,
                    transparentCorners: false,
                    borderColor: '#667eea',
                    cornerColor: '#667eea',
                    cornerStyle: 'circle'
                });

                canvas.add(defaultText, defaultText2);
                
                canvas.renderAll();
                showToast('預設佈局已載入,可自由編輯調整', 'success');
            }
        });
    });
}

// 上傳圖片
document.getElementById('uploadImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            fabric.Image.fromURL(event.target.result, function(img) {
                // 根據畫布大小調整圖片
                const maxWidth = 400;
                const maxHeight = 400;
                const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
                
                img.set({
                    left: 100,
                    top: 100,
                    scaleX: scale,
                    scaleY: scale,
                    cornerSize: 12,
                    transparentCorners: false,
                    borderColor: '#667eea',
                    cornerColor: '#667eea',
                    cornerStyle: 'circle'
                });
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
                showToast('圖片已新增', 'success');
            });
        };
        reader.readAsDataURL(file);
    }
    // 重置 input
    e.target.value = '';
});

// 新增文字
document.getElementById('addText').addEventListener('click', function() {
    const textInput = document.getElementById('textInput').value;
    const fontFamily = document.getElementById('fontFamily').value;
    const textColor = document.getElementById('textColor').value;
    const fontSize = parseInt(document.getElementById('fontSize').value) || 24;

    if (!textInput.trim()) {
        showToast('請輸入文字內容', 'error');
        return;
    }

    const text = new fabric.IText(textInput, {
        left: 100,
        top: 100,
        fontFamily: fontFamily,
        fontSize: fontSize,
        fill: textColor,
        cornerSize: 12,
        transparentCorners: false,
        borderColor: '#667eea',
        cornerColor: '#667eea',
        cornerStyle: 'circle'
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    // 清空輸入框
    document.getElementById('textInput').value = '';
    showToast('文字已新增', 'success');
});

// 刪除物件
document.getElementById('deleteBtn').addEventListener('click', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.remove(activeObject);
        canvas.renderAll();
        showToast('物件已刪除', 'success');
    } else {
        showToast('請先選擇要刪除的物件', 'error');
    }
});

// 鎖定物件
document.getElementById('lockBtn').addEventListener('click', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.set({
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            selectable: true,
            hasControls: false
        });
        canvas.renderAll();
        showToast('物件已鎖定', 'success');
    } else {
        showToast('請先選擇要鎖定的物件', 'error');
    }
});

// 解鎖物件
document.getElementById('unlockBtn').addEventListener('click', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.set({
            lockMovementX: false,
            lockMovementY: false,
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,
            selectable: true,
            hasControls: true
        });
        canvas.renderAll();
        showToast('物件已解鎖', 'success');
    } else {
        showToast('請先選擇要解鎖的物件', 'error');
    }
});

// 置最上層
document.getElementById('bringToFront').addEventListener('click', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.bringToFront(activeObject);
        canvas.renderAll();
        showToast('已置最上層', 'success');
    } else {
        showToast('請先選擇物件', 'error');
    }
});

// 置上一層
document.getElementById('bringForward').addEventListener('click', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.bringForward(activeObject);
        canvas.renderAll();
        showToast('已往上移動一層', 'success');
    } else {
        showToast('請先選擇物件', 'error');
    }
});

// 置下一層
document.getElementById('sendBackward').addEventListener('click', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.sendBackward(activeObject);
        canvas.renderAll();
        showToast('已往下移動一層', 'success');
    } else {
        showToast('請先選擇物件', 'error');
    }
});

// 置最下層
document.getElementById('sendToBack').addEventListener('click', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.sendToBack(activeObject);
        canvas.renderAll();
        showToast('已置最下層', 'success');
    } else {
        showToast('請先選擇物件', 'error');
    }
});

// 編輯文字按鈕
document.getElementById('editTextBtn').addEventListener('click', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && (activeObject.type === 'i-text' || activeObject.type === 'text')) {
        currentEditingText = activeObject;
        document.getElementById('editTextArea').value = activeObject.text;
        document.getElementById('textEditModal').classList.add('show');
    } else {
        showToast('請先選擇文字物件', 'error');
    }
});

// 儲存文字編輯
document.getElementById('saveTextEdit').addEventListener('click', function() {
    if (currentEditingText) {
        const newText = document.getElementById('editTextArea').value;
        if (newText.trim()) {
            currentEditingText.set('text', newText);
            canvas.renderAll();
            showToast('文字已更新', 'success');
        }
    }
    document.getElementById('textEditModal').classList.remove('show');
    currentEditingText = null;
});

// 取消文字編輯
document.getElementById('cancelTextEdit').addEventListener('click', function() {
    document.getElementById('textEditModal').classList.remove('show');
    currentEditingText = null;
});

// 點擊 modal 背景關閉
document.getElementById('textEditModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('show');
        currentEditingText = null;
    }
});

// 下載為高品質圖片 (1920 x 1000 px)
document.getElementById('downloadBtn').addEventListener('click', function() {
    // 計算縮放比例
    const exportWidth = 1920;
    const exportHeight = 1000;
    const multiplier = exportWidth / canvas.width;

    // 使用 Fabric.js 的高品質匯出功能
    const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: multiplier,
        enableRetinaScaling: false
    });

    // 下載圖片
    const link = document.createElement('a');
    const timestamp = new Date().getTime();
    link.download = `edited-image-${timestamp}.png`;
    link.href = dataURL;
    link.click();
    showToast('圖片下載成功！', 'success');
});

// 顯示提示訊息
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// 鍵盤快捷鍵
document.addEventListener('keydown', function(e) {
    const activeObject = canvas.getActiveObject();
    
    // Delete 鍵刪除物件
    if (e.key === 'Delete' && activeObject) {
        canvas.remove(activeObject);
        canvas.renderAll();
        showToast('物件已刪除', 'success');
    }

    // Ctrl+C 複製
    if (e.ctrlKey && e.key === 'c' && activeObject) {
        activeObject.clone(function(cloned) {
            window._clipboard = cloned;
        });
        e.preventDefault();
    }

    // Ctrl+V 貼上
    if (e.ctrlKey && e.key === 'v' && window._clipboard) {
        window._clipboard.clone(function(clonedObj) {
            canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 20,
                top: clonedObj.top + 20,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = canvas;
                clonedObj.forEachObject(function(obj) {
                    canvas.add(obj);
                });
                clonedObj.setCoords();
            } else {
                canvas.add(clonedObj);
            }
            window._clipboard.top += 20;
            window._clipboard.left += 20;
            canvas.setActiveObject(clonedObj);
            canvas.requestRenderAll();
            showToast('物件已複製', 'success');
        });
        e.preventDefault();
    }
});

// 設置畫布拖放事件
const canvasWrapper = document.querySelector('.canvas-wrapper');

canvasWrapper.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

canvasWrapper.addEventListener('drop', function(e) {
    e.preventDefault();
    const imageSrc = e.dataTransfer.getData('imageSrc');
    
    if (imageSrc) {
        // 計算相對於畫布的位置
        const rect = canvas.getElement().getBoundingClientRect();
        const left = e.clientX - rect.left;
        const top = e.clientY - rect.top;
        
        addImageToCanvas(imageSrc, left, top);
        showToast('圖片已新增', 'success');
    }
});

// 初始化
loadImageGallery();
initCanvas();

// 確保在物件被選中時更新樣式
canvas.on('selection:created', function() {
    canvas.renderAll();
});

canvas.on('selection:updated', function() {
    canvas.renderAll();
});
