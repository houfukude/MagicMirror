/**
 * 烟花效果 - 视频背景循环播放
 */

var background = {

}

background.init = function () {

    // 检查配置是否存在且有效
    if (!config || !config.background || !config.background.videoUrl) {
        console.log('背景视频未配置，跳过背景视频加载');
        return;
    }

    const videoUrl = config.background.videoUrl.trim();
    if (!videoUrl) {
        console.log('背景视频URL为空，跳过背景视频加载');
        return;
    }

    // 获取 root 元素
    const root = document.getElementById('root');
    if (!root) {
        console.error('找不到 #root 元素');
        return;
    }

    // 创建视频容器
    const videoContainer = document.createElement('div');
    videoContainer.id = 'fireworks-video-container';
    videoContainer.style.position = 'absolute';
    videoContainer.style.top = '0';
    videoContainer.style.left = '0';
    videoContainer.style.width = '100%';
    videoContainer.style.height = '100%';
    videoContainer.style.pointerEvents = 'none';
    videoContainer.style.zIndex = '0';
    videoContainer.style.overflow = 'hidden';

    // 创建视频元素
    const video = document.createElement('video');
    video.id = 'fireworks-video';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.position = 'absolute';
    video.style.top = '50%';
    video.style.left = '50%';
    video.style.transform = 'translate(-50%, -50%)';
    video.style.minWidth = '100%';
    video.style.minHeight = '100%';
    video.style.width = 'auto';
    video.style.height = 'auto';
    video.style.objectFit = 'cover';

    // 使用配置中的视频源
    video.src = videoUrl;

    // 添加加载提示
    const loadingText = document.createElement('div');
    loadingText.textContent = '烟花视频加载中...';
    loadingText.style.position = 'absolute';
    loadingText.style.top = '50%';
    loadingText.style.left = '50%';
    loadingText.style.transform = 'translate(-50%, -50%)';
    loadingText.style.color = 'rgba(255, 255, 255, 0.5)';
    loadingText.style.fontSize = '14px';
    loadingText.style.zIndex = '1';

    videoContainer.appendChild(video);
    videoContainer.appendChild(loadingText);
    root.insertBefore(videoContainer, root.firstChild);

    // 视频加载完成后隐藏提示
    video.addEventListener('loadeddata', () => {
        loadingText.style.display = 'none';

        console.log('背景视频: ' + videoUrl);
    });

    // 视频加载错误处理
    video.addEventListener('error', () => {
        loadingText.textContent = '视频加载失败';
        console.error('烟花视频加载失败');
    });

    // 页面可见性控制 - 隐藏时暂停视频
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            video.pause();
        } else {
            video.play().catch(err => console.log('自动播放受限:', err));
        }
    });

    // 窗口失焦时暂停
    window.addEventListener('blur', () => {
        video.pause();
    });

    // 窗口获得焦点时播放
    window.addEventListener('focus', () => {
        video.play().catch(err => console.log('自动播放受限:', err));
    });

    // 尝试自动播放
    video.play().catch(err => {
        console.log('自动播放受限，等待用户交互:', err);
        // 可以添加点击播放的逻辑
        document.body.addEventListener('click', () => {
            video.play().catch(e => console.log('播放失败:', e));
        }, { once: true });
    });

};
