import { NextRequest, NextResponse } from 'next/server';
import {pool} from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filters: string[] = [];
    const values: any[] = [];

    const budget = searchParams.get('budget_range');
    const timeframe = searchParams.get('timeframe');
    const brand = searchParams.get('brand_preferences');
    const material = searchParams.get('material');
    const region = searchParams.get('region');

    let index = 1;

    if (budget) {
      filters.push(`budget_range = $${index++}`);
      values.push(budget);
    }
    if (timeframe) {
      filters.push(`timeframe = $${index++}`);
      values.push(timeframe);
    }
    if (brand) {
      filters.push(`brand_preferences ILIKE $${index++}`);
      values.push(`%${brand}%`);
    }
    if (material) {
      filters.push(`material = $${index++}`);
      values.push(material);
    }
    if (region) {
      filters.push(`region ILIKE $${index++}`);
      values.push(`%${region}%`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const query = `SELECT * FROM requests ${whereClause} ORDER BY created_date DESC`;

    const res = await pool.query(query, values);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await pool.query(
      `INSERT INTO requests 
      (created_date, assisted_by, status, brand_preferences, budget_range, material, timeframe, client_name, region, phone, email, purpose)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        data.created_date,
        data.assisted_by || null,
        data.status || 'New',
        data.brand_preferences,
        data.budget_range,
        data.material,
        data.timeframe,
        data.client_name,
        data.region,
        data.phone,
        data.email,
        data.purpose,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}