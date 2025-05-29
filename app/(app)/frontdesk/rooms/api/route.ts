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
    const type = searchParams.get("type");
    const pricePerNight = searchParams.get("pricePerNight");
    const status = searchParams.get("status");

    const whereClause: any = {};

    if (search) {
      const orConditions: any[] = [];

      // Search string match on room number
      orConditions.push({
        number: {
          contains: search,
          mode: "insensitive",
        },
      });

      // If search is a number, try matching price
      const numericSearch = parseFloat(search);
      if (!isNaN(numericSearch)) {
        orConditions.push({ pricePerNight: numericSearch });
      }

      // Try exact match on enums
      const upperSearch = search.toUpperCase();

      const validStatuses = ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"];
      const validTypes = ["STANDARD", "A_FRAMES", "FLOATING", "EXECUTIVE"];

      if (validStatuses.includes(upperSearch)) {
        orConditions.push({ status: upperSearch });
      }

      if (validTypes.includes(upperSearch)) {
        orConditions.push({ type: upperSearch });
      }

      whereClause.OR = orConditions;
    }

    // Additional filters
    if (number) {
      whereClause.number = { equals: number };
    }

    if (pricePerNight) {
      whereClause.pricePerNight = { equals: parseFloat(pricePerNight) };
    }

    if (status) {
      whereClause.status = { equals: status as RoomStatus };
    }

    if (type) {
      whereClause.type = { equals: type as RoomType };
    }

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { id: "desc" },
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
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}


  // export async function GET(req: NextRequest) {
  //   try {
  //     const { searchParams } = new URL(req.url);

  //     const page = parseInt(searchParams.get("page") || "1");
  //     const limit = parseInt(searchParams.get("limit") || "20");
  //     const skip = (page - 1) * limit;

  //     const search = searchParams.get("search")?.toLowerCase() || "";

  //     const number = searchParams.get("number");
  //     const type = searchParams.get("type");
  //     const pricePerNight = searchParams.get("pricePerNight");
  //     const status = searchParams.get("status");

  //     const whereClause: any = {};

  //     if (search) {
  //       whereClause.OR = [
  //         { number: { contains: search, mode: "insensitive" } },
  //         { status: { contains: search, mode: "insensitive" } },
  //         { type: { contains: search, mode: "insensitive" } },
  //       ];

  //       const numericSearch = parseFloat(search);
  //       if (!isNaN(numericSearch)) {
  //         whereClause.OR.push({ pricePerNight: numericSearch });
  //       }
  //     }

  //     if (number) {
  //       whereClause.number = { equals: number };
  //     }

  //     if (pricePerNight) {
  //       whereClause.pricePerNight = { equals: parseFloat(pricePerNight) };
  //     }


  //     if (status) {
  //       whereClause.status = { equals: status as RoomStatus };
  //     }
  //     if (type) {
  //       whereClause.type = { equals: type as RoomType };
  //     }

  //     const [rooms, total] = await Promise.all([
  //       prisma.room.findMany({
  //         where: whereClause,
  //         skip,
  //         take: limit,
  //         orderBy: { id: "desc" },
  //       }),
  //       prisma.room.count({ where: whereClause }),
  //     ]);

  //     return NextResponse.json(
  //       {
  //         data: rooms,
  //         pagination: {
  //           total,
  //           page,
  //           limit,
  //           totalPages: Math.ceil(total / limit),
  //         },
  //       },
  //       { status: 200 }
  //     );
  //   } catch (error) {
  //     console.error("Error fetching rooms:", error);
  //     return NextResponse.json(
  //       { error: "Failed to fetch rooms" },
  //       { status: 500 }
  //     );
  //   }
  // }


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
      number: number,
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

  } catch (err) {
    console.log("Error creating guest:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });

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
