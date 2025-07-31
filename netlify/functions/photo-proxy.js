const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
  const { place_id, maxwidth = 800 } = event.queryStringParameters;
  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!place_id || !GOOGLE_API_KEY) {
    return {
      statusCode: 400,
      body: 'Missing place_id or API key.'
    };
  }

  // 1. Get photo_reference from Place Details
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=photos&key=${GOOGLE_API_KEY}`;
  const detailsRes = await fetch(detailsUrl);
  const detailsJson = await detailsRes.json();
  const photos = detailsJson.result?.photos;
  if (!photos || photos.length === 0) {
    return {
      statusCode: 404,
      body: 'No photo found for this place.'
    };
  }
  const photoReference = photos[0].photo_reference;

  // 2. Fetch the actual photo (redirect URL)
  const photoApiUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
  const photoRes = await fetch(photoApiUrl, { redirect: 'manual' });
  const location = photoRes.headers.get('location');
  if (!location) {
    return {
      statusCode: 500,
      body: 'Could not retrieve photo redirect.'
    };
  }

  // 3. Stream the image from Google to the client
  const imageRes = await fetch(location);
  const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
  const arrayBuffer = await imageRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
    body: buffer.toString('base64'),
    isBase64Encoded: true
  };
};
