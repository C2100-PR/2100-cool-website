import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const vertexEndpoint = `https://${process.env.VERTEX_AI_REGION}-aiplatform.googleapis.com/v1/projects/${process.env.PROJECT_ID}/locations/${process.env.VERTEX_AI_REGION}/endpoints/${process.env.VERTEX_AI_ENDPOINT_ID}:predict`;
    
    // Get auth token
    const tokenResponse = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
      headers: {
        'Metadata-Flavor': 'Google'
      }
    });
    const { access_token } = await tokenResponse.json();

    // Call Vertex AI
    const response = await fetch(vertexEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{
          content: message
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Vertex AI responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}