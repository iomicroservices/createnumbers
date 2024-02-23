export async function onRequestPost(context) {
    const { request, env } = context;

    const origin = request.headers.get("Origin");
    const allowedOriginsArray = ["https://createnumbers.com", "https://www.createnumbers.com", "https://createnumbers.co.uk", "https://www.createnumbers.co.uk"];

    // Adjusted to handle array of origins
    if (!allowedOriginsArray.includes(origin)) {
        return new Response("Unauthorized request", { status: 403 });
    }

    const formData = await request.formData();

    // Convert FormData to a JSON object
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Append additional fields to the data object
    data['source'] = 'Create';

    // Forward the form data to the REQUEST_URL as JSON
    const response = await fetch(env.ACTIVATION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send data as JSON
    });

    // Regardless of the response from REQUEST_URL, return a success message
    return new Response(JSON.stringify({ message: "Form submitted successfully." }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
}
