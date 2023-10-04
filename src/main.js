import {
    bootstrapCameraKit,
    CameraKitSession,
    createMediaStreamSource,
    Transform2D,
    Lens,
  } from '@snap/camera-kit';
  
  let mediaStream;
  
  function isFirstCharactersBack(str) {
    // Convert both the first character and "Back" to lowercase for case-insensitive comparison
    const firstFourChars = str.slice(0, 4).toLowerCase();
    const comparisonStr = "back".toLowerCase();
  
    return firstFourChars === comparisonStr;
  }

  async function init() {
    const cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjg0ODMxMTQ0LCJzdWIiOiJlYTg4ZjQyZC0xYmM5LTRkN2YtYTMwMS02Y2M4YzU2OTg2Y2J-U1RBR0lOR340OGY1YjJmYS1iZGNjLTQ5MzAtYjI2NS1jNGYzODliMzAwYjAifQ.BojCwDCBLoh_7wsjjiM59vkpvdCDUyDd0WVMcFjcei0' });
    const session = await cameraKit.createSession();
    document.getElementById('canvas').replaceWith(session.output.live);
    const { lenses } = await cameraKit.lenses.repository.loadLensGroups([
      '1ef0167d-093e-4165-8fdd-d1f8326ba52a',
    ]);
  
    session.applyLens(lenses[1]);

    await setCameraKitSource(session);
  
    attachCamerasToSelect(session);
    attachLensesToSelect(lenses, session);
  }
  
  async function setCameraKitSource(
    session,
    deviceId,
    isBackCamera,
  ) {
    if (mediaStream) {
      session.pause();
      mediaStream.getVideoTracks()[0].stop();
    }
  
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId },
    });

    const source = createMediaStreamSource(mediaStream);
  
    await session.setSource(source);


    session.source.setRenderSize( window.innerWidth,  window.innerHeight);
    if (!isBackCamera) {
        session.source.setTransform(Transform2D.MirrorX);
    }
  
    session.play();
  }
  
  async function attachCamerasToSelect(session) {
    const cameraSelect = document.getElementById('cameras');
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(({ kind }) => kind === 'videoinput');
  
    cameras.forEach((camera) => {
      const option = document.createElement('option');
  
      option.value = camera.deviceId;
      option.text = camera.label;
  
      cameraSelect.appendChild(option);
    });
  
    cameraSelect.addEventListener('change', (event) => {
      const deviceId = (event.target).selectedOptions[0]
        .value;
      setCameraKitSource(session, deviceId, isFirstCharactersBack((event.target).selectedOptions[0].text));
    });
  }
  
  async function attachLensesToSelect(lenses, session) {
    const lensSelect = document.getElementById('lenses');
  
    lenses.forEach((lens) => {
      const option = document.createElement('option');
  
      option.value = lens.id;
      option.text = lens.name;
  
      lensSelect.appendChild(option);
    });
  
    lensSelect.addEventListener('change', (event) => {
      const lensId = (event.target).selectedOptions[0].value;
      const lens = lenses.find((lens) => lens.id === lensId);
  
      if (lens) session.applyLens(lens);
    });
  }
  
  init();

// 'use strict';


// window.addEventListener("load", async () => {

//     var videoRequest = async () => {

//         const cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjg0ODMxMTQ0LCJzdWIiOiJlYTg4ZjQyZC0xYmM5LTRkN2YtYTMwMS02Y2M4YzU2OTg2Y2J-U1RBR0lOR340OGY1YjJmYS1iZGNjLTQ5MzAtYjI2NS1jNGYzODliMzAwYjAifQ.BojCwDCBLoh_7wsjjiM59vkpvdCDUyDd0WVMcFjcei0' });
//         const session = await cameraKit.createSession();
//         document.getElementById('output-canvas').replaceWith(session.output.live);
//         const mediaStream = session.output.capture.captureStream();
        
//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//             console.log(await navigator.mediaDevices.enumerateDevices());
//             navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', _deviceId: { exact: '481ae3cf657b958fda98e99c4f1d200be8993138bc6b7603f1e068f226fe1500' }  } })
//                 .then(async function(stream) {
//                     var video = document.getElementById('video');
//                     video.srcObject = stream;
//                     session.setSource(stream);

                    
//                     var canvas = document.getElementById('output-canvas');

//                     const { lenses } = await cameraKit.lensRepository.loadLensGroups(['1ef0167d-093e-4165-8fdd-d1f8326ba52a']);
//                     console.log(lenses);
//                     await session.applyLens(lenses[19])

//                     var videoAspectRatio = video.videoWidth / video.videoHeight;
//                     var canvasHeight = window.innerHeight;
//                     var canvasWidth = canvasHeight * videoAspectRatio;

//                     session.source.setRenderSize(canvasHeight, window.innerWidth);
//                     session.source.setTransform(Transform2D.MirrorX);
//                     session.play();

//                     function drawVideoToCanvas() {
//                         var videoAspectRatio = video.videoWidth / video.videoHeight;
//                         var canvasHeight = window.innerHeight;
//                         var canvasWidth = canvasHeight * videoAspectRatio;
                
//                         session.source.setRenderSize(canvasWidth, canvasHeight);
//                         requestAnimationFrame(drawVideoToCanvas);
//                       }
                

//                     drawVideoToCanvas();
//                 })
//                 .catch(function(error) {
//                     console.error('Error accessing the camera: ', error);
//                 });
//         } else {
//             console.error('getUserMedia is not supported by this browser.');
//         }
//     }
//     await videoRequest()
// });
