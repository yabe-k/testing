let contentWidth;
let contentHeight;
let mediaStream;
let id_animationFlame;
let id_timeout;

const startVideo = (deviceId) => {
    navigator.mediaDevices.getUserMedia({ audio: false, video: {width: {ideal:4096}, height: {ideal:4096}, facingMode: "environment", deviceId: { exact: deviceId } } })//environment
        .then((stream) => {
            mediaStream = stream;
            video.srcObject = stream;
            video.onloadeddata = () => {
                video.play();
                contentWidth = video.clientWidth;
                contentHeight = video.clientHeight;
                canvasUpdate();
                checkImage();
            }
        }).catch((e) => {
            console.log(e);
        });
}

const stopVideo = () => {
    if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
        mediaStream = null;
    }
    cancelAnimationFrame(id_animationFlame);
    clearTimeout(id_timeout);
}

const canvasUpdate = () => {
    cvs.width = contentWidth;
    cvs.height = contentHeight;
    ctx.drawImage(video, 0, 0, contentWidth, contentHeight);
    id_animationFlame = requestAnimationFrame(canvasUpdate);
}

const checkImage = () => {
    const imageData = ctx.getImageData(0, 0, contentWidth, contentHeight);
    const code = jsQR(imageData.data, contentWidth, contentHeight);

    if (code) {
        //console.log("Code found", code);
        drawRect(code.location);
        document.getElementById('qr-msg').textContent = `code found: ${code.data}`;
    } else {
        //console.log("Code not found");
        rectCtx.clearRect(0, 0, contentWidth, contentHeight);
        document.getElementById('qr-msg').textContent = 'code not found';
    }
    id_timeout = setTimeout(() => { checkImage() }, 500);
}

const drawRect = (location) => {
    rectCvs.width = contentWidth;
    rectCvs.height = contentHeight;
    drawLine(location.topLeftCorner, location.topRightCorner);
    drawLine(location.topRightCorner, location.bottomRightCorner);
    drawLine(location.bottomRightCorner, location.bottomLeftCorner);
    drawLine(location.bottomLeftCorner, location.topLeftCorner);
}

const drawLine = (begin, end) => {
    rectCtx.lineWidth = 4;
    rectCtx.strokeStyle = "#F00";
    rectCtx.beginPath();
    rectCtx.moveTo(begin.x, begin.y);
    rectCtx.lineTo(end.x, end.y);
    rectCtx.stroke();
}

const createCameraRadioButtons = () => {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            videoDevices.forEach((device, index) => {
                const radioBtn = document.createElement('input');
                radioBtn.type = 'radio';
                radioBtn.name = 'camera';
                radioBtn.value = device.deviceId;
                radioBtn.id = `camera${index}`;

                const label = document.createElement('label');
                label.htmlFor = `camera${index}`;
                label.textContent = `Camera ${index + 1}`;

                radioBtn.addEventListener('change', () => {
                    stopVideo();
                    startVideo(device.deviceId);
                });

                cameraSwitchDiv.appendChild(radioBtn);
                cameraSwitchDiv.appendChild(label);
            });
        })
        .catch(error => {
            console.error('Error enumerating devices:', error);
        });
};