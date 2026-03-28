import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const res = await pool.query('DELETE FROM WatchRequests WHERE request_id=$1 RETURNING *', [id]);
        if (!res.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 })
    }

    const body = await req.json()
    const { status } = body

    try {
        const result = await pool.query(
            `UPDATE requests
       SET status = $1
       WHERE id = $2
       RETURNING *`,
            [status, id]
        )

        return NextResponse.json(result.rows[0])
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "DB error" }, { status: 500 })
    }
}