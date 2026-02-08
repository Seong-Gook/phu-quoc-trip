import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const filePath = path.join(process.cwd(), 'data', 'trip_data.json');

    if (!fs.existsSync(filePath)) {
        return NextResponse.json([], { status: 404 });
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(jsonData));
}
