import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RoomStatus, RoomType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.toLowerCase() || "";

    const number = searchParams.get("number");
    const pricePerNight = searchParams.get("pricePerNight");
    const status = searchParams.get("status");

    const whereClause: any = {};
    const validStatuses = ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"];
    if (search) {
      const orConditions: any[] = [];

      const numericSearch = parseInt(search);
      if (!isNaN(numericSearch)) {
        orConditions.push({ number: numericSearch });
        orConditions.push({ pricePerNight: numericSearch });
      }

      const upperSearch = search.toUpperCase();

      if (validStatuses.includes(upperSearch)) {
        orConditions.push({ status: upperSearch });
      }



      whereClause.OR = orConditions;
    }
    if (number) {
      whereClause.number = { equals: parseInt(number) };
    }


    if (pricePerNight) {
      whereClause.pricePerNight = { equals: parseFloat(pricePerNight) };
    }

    if (status) {
      whereClause.status = { equals: status as RoomStatus };
    }

    // if (type) {
    //   whereClause.type = { equals: type as RoomType };
    // }



    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { number: "asc" },
      }),
      prisma.room.count({ where: whereClause }),
    ]);

    return NextResponse.json(
      {
        data: rooms,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      number,
      type,
      pricePerNight,
      status,

    } = body

    if (!body || Object.keys(body).length === 0) {
      console.error("Error: Empty request body");
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
    }

    const processedInput = {
      number: parseInt(number),
      type: type,
      pricePerNight: parseFloat(pricePerNight),
      status: status,
    }

    const room = await prisma.room.create({
      data: processedInput
    });

    return NextResponse.json({
      success: true,
      room
    }, { status: 201 });

  } catch (error:any) {
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });

  }


}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, number, type, pricePerNight, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        number,
        type,
        pricePerNight: parseFloat(pricePerNight),
        status,
      },
    });

    return NextResponse.json({ success: true, room: updatedRoom }, { status: 200 });
  } catch (err: any) {
    console.error("Error updating room:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
