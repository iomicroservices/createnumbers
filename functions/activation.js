export async function onRequestPost(context) {
    const { request, env } = context;

    const origin = request.headers.get("Origin");
    const allowedOrigins = "https://createnumbers.com, https://www.createnumbers.com, https://createnumbers.co.uk, https://www.createnumbers.co.uk";

    if (!allowedOrigins.includes(origin)) {
        return new Response("Unauthorized request", { status: 403 });
    }

    // Assuming the body is JSON
    const data = await request.json();

    // Prepare data for Airtable
    const airtableData = {
        "records": [
            {
                "fields": {
                    "Email": data.email,
                    "Code": data.code,
                    "Source": data.source
                }
            }
        ]
    };

    const airtableResponse = await fetch(env.AIRTABLE_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(airtableData)
    });

    if (!airtableResponse.ok) {
        return new Response("Failed to post data to Airtable", {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Return success message
    return new Response(JSON.stringify({ message: "Form submitted successfully." }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    });
}
