import { MongoClient } from 'mongodb';

export async function GET() {
    const uri = process.env.MONGODB_URI as string;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('nu');
        const ops_info = await db.collection('ops_data')
            .find().toArray();

        return new Response(JSON.stringify(ops_info), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch operation information';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } finally {
        await client.close();
    }
}
