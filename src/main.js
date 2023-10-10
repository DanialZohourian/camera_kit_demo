// Import the necessary Camera Kit modules.
import {
  bootstrapCameraKit,
  CameraKitSession,
  createMediaStreamSource,
  Transform2D,
  Lens,
} from '@snap/camera-kit';

// Create an async function to initialize Camera Kit and start the video stream.
(async function() {
  // Bootstrap Camera Kit using your API token.
  const cameraKit = await bootstrapCameraKit({
    apiToken: '<API_TOKEN>'
  });

  // Create a new CameraKit session.
  const session = await cameraKit.createSession();

  // Replace the `canvas` element with the live output from the CameraKit session.
  document.getElementById('canvas').replaceWith(session.output.live);

  // Load the specified lens group.
  const { lenses } = await cameraKit.lenses.repository.loadLensGroups([
    '<TEMPLATE_ID>',
  ]);

  // Apply the first lens in the lens group to the CameraKit session.
  session.applyLens(lenses[9]);

  // Get the user's media stream.
  let mediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  // Create a CameraKit media stream source from the user's media stream.
  const source = createMediaStreamSource(
    mediaStream, {
      transform: Transform2D.MirrorX,
      cameraType: 'front'
    }
  );

  // Set the source of the CameraKit session.
  await session.setSource(source);

  // Set the render size of the CameraKit session to the size of the browser window.
  session.source.setRenderSize( window.innerWidth,  window.innerHeight);

  // Start the CameraKit session.
  session.play();
})();
