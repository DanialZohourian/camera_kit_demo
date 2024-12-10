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
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzMzODI5NjY5LCJzdWIiOiJlYjAyYzM1YS1hYTA3LTRhZGUtYWJhYS0wODgxNTQ4ZTFkOTB-U1RBR0lOR345MTk5NTBiMS0zZDAwLTRiMGQtOTBhMy1mMzgzZTEzZGIzY2EifQ.K1evIDJZ7R2z9Wv4qWjk6OwPoxcWUJkOYyV2PjXRX_0'
  });

  // Create a new CameraKit session.
  const session = await cameraKit.createSession();

  // Replace the `canvas` element with the live output from the CameraKit session.
  document.getElementById('canvas').replaceWith(session.output.live);

  // Load the specified lens group.
  const { lenses } = await cameraKit.lensRepository.loadLensGroups(['b0feee61-9140-4924-b7b8-f1feee6a788e'])

  // Apply the first lens in the lens group to the CameraKit session.
  session.applyLens(lenses[0]);

  // Get the user's media stream.
  // for back camera use { facingMode: "environment" } instead of { facingMode: "user" }
  let mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
  });

  // Create a CameraKit media stream source from the user's media stream.
  // for back camera use { cameraType: 'back' } instead of { cameraType: 'front' }
  // and remove transofrm property
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
